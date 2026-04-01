import cloudinary from "./CloudConfig.js";

const deleteAllImages = async () => {

  try {

    const result = await cloudinary.api.delete_resources_by_prefix("products");

    console.log("Deleted:", result);

  } catch (error) {

    console.log(error);

  }

};

deleteAllImages();