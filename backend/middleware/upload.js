const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Ensure upload directories exist ──────────────────────────────────────────
const UPLOAD_BASE = path.resolve(process.env.UPLOAD_PATH || './uploads');
const DIRS = {
  destinations: path.join(UPLOAD_BASE, 'destinations'),
  hotels:       path.join(UPLOAD_BASE, 'hotels'),
};

Object.values(DIRS).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Storage engine ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route-based subfolder selection
    let folder = UPLOAD_BASE;
    if (req.baseUrl && req.baseUrl.includes('destination')) {
      folder = DIRS.destinations;
    } else if (req.baseUrl && req.baseUrl.includes('hotel')) {
      folder = DIRS.hotels;
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext       = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const safeName  = file.originalname
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);
    cb(null, `${safeName}_${timestamp}${ext}`);
  },
});

// ─── File filter ───────────────────────────────────────────────────────────────
const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp/;

const fileFilter = (req, file, cb) => {
  const extValid  = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = ALLOWED_TYPES.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Only image files (jpeg, jpg, png, gif, webp) are allowed.'
      ),
      false
    );
  }
};

// ─── Multer instance ────────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // default 5MB
  },
});

module.exports = upload;
