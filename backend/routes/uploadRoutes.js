import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();
import sharp from "sharp";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
});

// router.post("/", upload.single("image"), (req, res) => {
//   res.send({
//     message: "Image Uploaded",
//     image: `/${req.file.path}`,
//   });
// });

router.post("/", upload.single("image"), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  // Use sharp to resize the image to 100x100 pixels
  sharp(req.file.path)
    .resize(100, 100)
    .toFile(`uploads/resized-${req.file.filename}`, (err, info) => {
      if (err) {
        return res.status(500).json({ message: "Error resizing image" });
      }

      res.json({
        message: "Image Uploaded and Resized",
        image: `/${req.file.path}`,
        resizedImage: `/uploads/resized-${req.file.filename}`,
      });
    });
});

export default router;
