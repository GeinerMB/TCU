require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('audio/')) {
            return cb(new Error('Solo se permiten archivos de audio'));
        }
        cb(null, true);
    }
});
// ======================
//      Middleware
// ======================
app.use(cors({
    origin: "nairiawarilab-blush-nu.vercel.app",
    methods: ["GET", "POST", "DELETE"]
}));
app.use(express.json());

// ======================
//   Conexión MongoDB
// ======================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error de conexión:", err));

// ======================
//      Esquema Quiz
// ======================
const quizSchema = new mongoose.Schema({
    quizTitle: {
        type: String,
        required: [true, "El título es obligatorio"],
        trim: true,
        minlength: [5, "Mínimo 5 caracteres"]
    },
    questions: [{
        question: {
            type: String,
            required: [true, "La pregunta es obligatoria"],
            trim: true
        },
        type: {
            type: String,
            required: true,
            enum: {
                values: ["multiple", "true_false"],
                message: "Tipo inválido (solo: multiple/true_false)"
            }
        },
        answers: {
            type: [String],
            required: true,
            validate: {
                validator: function (arr) {
                    if (this.type === "true_false") {
                        return arr.length === 2 &&
                            arr.includes("Verdadero") &&
                            arr.includes("Falso");
                    }
                    return arr.length >= 2 && arr.length <= 4;
                },
                message: "Respuestas inválidas para el tipo seleccionado"
            }
        },
        correctAnswer: {
            type: String,
            required: [true, "Selecciona una respuesta correcta"],
            validate: {
                validator: function (v) {
                    return this.answers.includes(v);
                },
                message: "La respuesta correcta debe coincidir con las opciones"
            }
        }
    }],
    quizCode: {
        type: String,
        unique: true,
        default: () => uuidv4().slice(0, 8).toUpperCase() // Código en mayúsculas
    },

    audio: {
        data: {
            type: Buffer,
            required: [true, "Los datos del audio son obligatorios"]
        },
        contentType: {
            type: String,
            required: [true, "El tipo MIME del audio es obligatorio"],
            validate: {
                validator: (v) => v.startsWith("audio/"), // Valida que sea un tipo audio
                message: "El archivo debe ser un audio válido (ej. audio/mpeg)"
            }
        }
    }

}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);

// ======================
//        Rutas
// ======================
app.delete("/api/quizzes/:quizCode", async (req, res) => {
    try {
        const { adminCode } = req.body; // Código de seguridad
        const quizCode = req.params.quizCode.toUpperCase();

        if (adminCode !== process.env.ADMIN_CODE) {
            return res.status(403).json({ error: "Código de administrador inválido" });
        }

        const result = await Quiz.deleteOne({ quizCode });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Quiz no encontrado" });
        }

        res.json({ message: "Quiz eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el quiz" });
    }
});

app.post("/api/quizzes", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("Debes subir un archivo de audio");
        }

        // Crear el quiz SIN especificar quizCode
        const newQuiz = new Quiz({
            quizTitle: req.body.quizTitle,
            questions: JSON.parse(req.body.questions),
            audio: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await newQuiz.save();
        res.status(201).json({ quizCode: newQuiz.quizCode });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// app.post("/api/quizzes/validate", async (req, res) => {
//     try {
//         const { quizCode, answers } = req.body;
//         const quiz = await Quiz.findOne({ quizCode });

//         if (!quiz) {
//             return res.status(404).json({ error: "Quiz no encontrado" });
//         }

//         const results = quiz.questions.map((question, index) => ({
//             question: question.question,
//             correct: question.correctAnswer === answers[index],
//             correctAnswer: question.correctAnswer
//         }));

//         const score = results.filter(result => result.correct).length;

//         res.json({ results, score, total: quiz.questions.length });
//     } catch (error) {
//         res.status(500).json({ error: "Error al validar respuestas" });
//     }
// });

app.get("/api/quizzes/:quizCode", async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ quizCode: req.params.quizCode });

        if (!quiz) {
            return res.status(404).json({ error: "Quiz no encontrado" });
        }

        res.json({
            quizTitle: quiz.quizTitle,
            questions: quiz.questions,
            audio: quiz.audio
                ? {
                    contentType: quiz.audio.contentType,
                    data: quiz.audio.data.toString("base64") // Convertir a Base64
                }
                : null
        });
    } catch (error) {
        res.status(500).json({ error: "Error al buscar el quiz" });
    }
});

// app.get("/api/quizzes/:quizCode", async (req, res) => {
//     try {
//         const quiz = await Quiz.findOne({ quizCode: req.params.quizCode });
//         if (!quiz) {
//             return res.status(404).json({ error: "Quiz no encontrado" });
//         }
//         res.json(quiz);
//     } catch (error) {
//         res.status(500).json({ error: "Error al buscar el quiz" });
//     }
// });

// app.post("/api/quizzes", async (req, res) => {
//     try {
//         const { quizTitle, questions } = req.body;

//         // Validación básica
//         if (!quizTitle?.trim() || !questions?.length) {
//             return res.status(400).json({
//                 error: "Faltan datos: título o preguntas"
//             });
//         }

//         // Crear documento
//         const newQuiz = new Quiz({
//             quizTitle: quizTitle.trim(),
//             questions: questions.map(q => ({
//                 question: q.question?.trim(),
//                 type: q.type,
//                 answers: q.type === "true_false"
//                     ? ["Verdadero", "Falso"]  // Fuerza valores correctos
//                     : q.answers?.map(a => a.trim()).filter(a => a !== ""),
//                 correctAnswer: q.correctAnswer?.trim()
//             }))
//         });

//         // Guardar en DB
//         await newQuiz.save();

//         // Respuesta exitosa
//         res.status(201).json({
//             message: "Quiz creado exitosamente",
//             quizCode: newQuiz.quizCode,
//             id: newQuiz._id
//         });

//     } catch (error) {
//         // Manejo detallado de errores
//         let statusCode = 500;
//         let errorMessage = "Error interno del servidor";

//         if (error.name === "ValidationError") {
//             statusCode = 400;
//             errorMessage = Object.values(error.errors)
//                 .map(err => `• ${err.message}`)
//                 .join("\n");
//         } else if (error.code === 11000) {
//             statusCode = 409;
//             errorMessage = "Error: Código único duplicado (vuelve a intentar)";
//         }

//         console.error("🔥 Error:", error);
//         res.status(statusCode).json({ error: errorMessage });
//     }
// });

// ======================
//    Iniciar Servidor
// ======================
app.listen(PORT, () => {
    console.log(`\n⚡ Servidor listo en http://localhost:${PORT}`);
    console.log("📝 Endpoint POST: /api/quizzes\n");
});