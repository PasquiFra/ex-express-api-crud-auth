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
// import del modulo CORS
const cors = require("cors");

// utilizzo il cors per consetire a tutti l'accesso all'API (è possibile customizzare gli accessi)
app.use(cors())

app.use(express.json());

app.use("/auth", userAuth);

app.use('/posts', postsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);

//? middlewares per errori di rotta/generici
app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server avviato alla porta http://localhost:${port}`)
})