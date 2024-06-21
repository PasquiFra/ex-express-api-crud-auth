const express = require('express');
const app = express();
require("dotenv").config();
const port = 3000;

//import dei middlewares,routers...
const routeNotFound = require('./middlewares/routeNotFound')
const errorHandler = require('./middlewares/errorHandler')
const postsRouter = require("./routers/posts.js")
const categoriesRouter = require("./routers/categories.js")
const tagsRouter = require("./routers/tags.js")
const userAuth = require("./routers/auth.js")
const { sendImage } = require("./controllers/images");

// import del modulo CORS
const cors = require("cors");

// utilizzo il cors per consetire a tutti l'accesso all'API (è possibile customizzare gli accessi)
app.use(cors())

//aggiungo il middleware che si occupa della cartella public
app.use(express.static('./public'));

// decodificatori del req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! DISATTIVATO: app.use("/auth", userAuth);
app.use('/posts', postsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/images/:image', sendImage);

//? middlewares per errori di rotta/generici
app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server avviato alla porta http://localhost:${port}`)
})