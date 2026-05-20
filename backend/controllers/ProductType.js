const ProductType = require("../models/ProductType");
const cloudinary = require("cloudinary").v2;
// CREATE PRODUCT TYPE
const createProductType = async (req, res) => {
  try {
    const { name, subCategory, group } = req.body;

    if (!name || !subCategory || !group) {
      return res.status(400).json({
        success: false,
        message: "Name, SubCategory and Group are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    const productType = await ProductType.create({
      name,
      subCategory,
      group,
      image: req.file.path
    });

    res.status(201).json({
      success: true,
      message: "Product Type Created Successfully ✅",
      productType
    });

  } catch (error) {
    console.log("CREATE PRODUCT TYPE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL PRODUCT TYPES
const getAllProductTypes = async (req, res) => {
  try {
    const { gender } = req.query;

    let productTypes = await ProductType.find()
      .populate({
        path: "subCategory",
        select: "name gender category",
        populate: [
          {
            path: "gender",
            select: "name image"
          },
          {
            path: "category",
            select: "name"
          }
        ]
      });

    // 🔥 FILTER BY GENDER (IMPORTANT)
    if (gender) {
      productTypes = productTypes.filter(
        (pt) =>
          pt.subCategory?.gender?.name?.toLowerCase() === gender.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      productTypes
    });

  } catch (error) {
    console.log("GET ALL PRODUCT TYPES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET PRODUCT TYPES BY SUBCATEGORY
const getProductTypesBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const productTypes = await ProductType.find({
      subCategory: subCategoryId
    })
      .populate({
        path: "subCategory",
        select: "name gender category",
        populate: [
          {
            path: "gender",
            select: "name image"
          },
          {
            path: "category",
            select: "name"
          }
        ]
      });

    res.status(200).json({
      success: true,
      productTypes
    });

  } catch (error) {
    console.log("GET PRODUCT TYPE BY SUBCATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subCategory, group } = req.body;

    const productType = await ProductType.findById(id);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found"
      });
    }

    // update basic fields
    productType.name = name || productType.name;
    productType.subCategory = subCategory || productType.subCategory;
    productType.group = group || productType.group;

    // 🔥 if new image uploaded
    if (req.file) {

      // OLD IMAGE DELETE FROM CLOUDINARY
      if (productType.image) {
        const oldImageUrl = productType.image;

        // extract public_id from cloudinary url
        const urlParts = oldImageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = "products/" + fileName.split(".")[0];

        try {
          await cloudinary.uploader.destroy(publicId);
          console.log("Old image deleted from Cloudinary ✅");
        } catch (deleteErr) {
          console.log("Cloudinary delete error:", deleteErr);
        }
      }

      // SAVE NEW IMAGE
      productType.image = req.file.path;
    }

    await productType.save();

    const updatedProductType = await ProductType.findById(id)
      .populate({
        path: "subCategory",
        select: "name gender category",
        populate: [
          {
            path: "gender",
            select: "name image"
          },
          {
            path: "category",
            select: "name"
          }
        ]
      });

    res.status(200).json({
      success: true,
      message: "Product Type Updated Successfully ✅",
      productType: updatedProductType
    });

  } catch (error) {
    console.log("UPDATE PRODUCT TYPE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE PRODUCT TYPE
const deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProductType.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Type deleted successfully ✅"
    });

  } catch (error) {
    console.log("DELETE PRODUCT TYPE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createProductType,
  getAllProductTypes,
  getProductTypesBySubCategory,
  updateProductType,
  deleteProductType
};