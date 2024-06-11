const path = require("path");

const sendImage = (req, res) => {

    const imageName = req.params.image;
    const imagePath = path.join(__dirname, '../public', 'img', imageName);

    // Invia il file immagine al frontend
    res.sendFile(imagePath);

}

module.exports = { sendImage }