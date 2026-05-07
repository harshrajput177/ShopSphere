const Banner = require("../models/BannerModel");

// ✅ CREATE BANNER (UPLOAD)
exports.createBanner = async (req, res) => {
  try {
    const image = req.file?.path;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const banner = await Banner.create({
      image,
      title: req.body.title || "",
      link: req.body.link || "",
    });

    res.status(201).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL BANNERS
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE BANNER
exports.updateBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;

    // Find existing banner
    let banner = await Banner.findById(bannerId);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // If new image uploaded, replace it
    if (req.file) {
      banner.image = req.file.path;
    }

    // Update other fields (optional)
    banner.title = req.body.title || banner.title;
    banner.link = req.body.link || banner.link;

    await banner.save();

    res.status(200).json({
      success: true,
      banner,
      message: "Banner updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE BANNER
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Banner deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};