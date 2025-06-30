// Express.js API for pothole verification flow
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Fix for CommonJS export
const tempModule = require(path.join(__dirname, '../frontends/src/temp.js'));
const verifyAndProcessPothole = tempModule.verifyAndProcessPothole;

console.log('tempModule:', tempModule);
console.log('verifyAndProcessPothole:', verifyAndProcessPothole);

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

// POST /api/verify-pothole
// Expects: multipart/form-data with 4 images, userId, tableName
app.post('/api/verify-pothole', upload.array('images', 4), async (req, res) => {
  try {
    const userId = req.body.userId;
    const tableName = req.body.tableName || 'posts';
    const files = req.files;
    if (!userId || !files || files.length !== 4) {
      return res.status(400).json({ error: 'userId and 4 images are required' });
    }
    const filePaths = files.map(f => f.path);
    const status = await verifyAndProcessPothole(filePaths, userId, tableName);
    // Clean up uploaded files
    filePaths.forEach(fp => fs.unlink(fp, () => {}));
    return res.json({ status });
  } catch (err) {
    console.error('API Error:', err); // Print error to terminal
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
