import cloudinary from "./CloudConfig.js";
import fs from "fs";
import path from "path";

const folderPath = "../uploads"; // jahan images padi hain

const uploadImages = async () => {

  const files = fs.readdirSync(folderPath);

  for (const file of files) {

    const filePath = path.join(folderPath, file);

    try {

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "products"
      });

      console.log("Uploaded:", result.secure_url);

    } catch (error) {

      console.log("Error:", error);

    }

  }

};

uploadImages();