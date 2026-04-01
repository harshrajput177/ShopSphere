// const fs = require("fs");
// const path = require("path");
// const sharp = require("sharp");

// const inputFolder = path.join(__dirname, "uploads");

// fs.readdir(inputFolder, (err, files) => {
//   if (err) return console.error("❌ Error reading folder:", err);

//   files.forEach(async (file) => {
//     const ext = path.extname(file).toLowerCase();
//     const baseName = path.basename(file, ext);

//     // Skip if already webp
//     if (ext === ".webp") return;

//     const inputPath = path.join(inputFolder, file);
//     const outputPath = path.join(inputFolder, `${baseName}.webp`);

//     try {
//       await sharp(inputPath)
//         .resize({ width: 800 }) // Optional: Resize for compression
//         .webp({ quality: 70 })  // Compression quality
//         .toFile(outputPath);

//       console.log(`✅ Converted: ${file} → ${baseName}.webp`);
//     } catch (e) {
//       console.error(`❌ Failed to convert ${file}:`, e);
//     }
//   });
// });


const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const folderPath = './uploads';

fs.readdir(folderPath, async (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    // Skip non-image files
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;

    try {
      const buffer = await sharp(filePath)
        .resize({ width: 1000 })
        .jpeg({ quality: 65 })
        .toBuffer();

      fs.writeFileSync(filePath, buffer);
      console.log(`Compressed: ${file}`);
    } catch (error) {
      console.error(`Compression error (${file}):`, error.message);
    }
  }
});








// const imagemin = require('imagemin');
// const webp = require('imagemin-webp');
// const svgo = require('imagemin-svgo');

// (async () => {
//   await imagemin(['images/*.svg'], {
//     destination: 'output',
//     plugins: [
//       svgo(),
//       webp({ quality: 90 })
//     ]
//   });

//   console.log("✅ Done with CommonJS (require)");
// })();


