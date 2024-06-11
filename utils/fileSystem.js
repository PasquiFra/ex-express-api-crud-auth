const path = require("path");
const fs = require("fs");


const deleteFile = (fileName) => {
    const filePath = path.join(__dirname, '../public/img', fileName);
    fs.unlinkSync(filePath);
}

module.exports = {
    deleteFile
};