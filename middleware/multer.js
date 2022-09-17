const multer = require("multer");
const path = require("path");

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".gif") {
      req.fileValidationError = "File type is not supported.";
      return cb(null, false, new Error("File type is not supported."));
    }
    cb(null, true);
  }
});
