import express, {json} from 'express';
import multer from 'multer'
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from "mongoose";
import {UserController, PostController} from "./controllers/index.js";
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";
import {handleValidationErrors, checkAuth} from "./utils/index.js";

mongoose
  .connect('mongodb+srv://olegweremey1994:1994@cluster0.mkhz8ww.mongodb.net/blog-mern?retryWrites=true&w=majority')
  .then(() => console.log('BD ok'))
  .catch((err) => console.log('bad connect ', err))

dotenv.config()
const PORT = process.env.PORT
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({storage})

const app = express();
app.use(json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send("0;esdfg")
})

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(PORT, () => {
  console.log(`${PORT}`)
})
