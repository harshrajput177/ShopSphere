import fs from "fs";
import path from "path";
import crypto from "crypto";

const folderPath = "../uploads";

const getFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(fileBuffer).digest("hex");
};

const removeDuplicates = () => {

  const files = fs.readdirSync(folderPath);
  const hashes = new Map();

  for (const file of files) {

    const filePath = path.join(folderPath, file);

    if (!fs.statSync(filePath).isFile()) continue;

    const hash = getFileHash(filePath);

    if (hashes.has(hash)) {

      console.log("Duplicate deleted:", file);
      fs.unlinkSync(filePath);

    } else {

      hashes.set(hash, file);

    }

  }

  console.log("Duplicate cleanup completed");

};

removeDuplicates();