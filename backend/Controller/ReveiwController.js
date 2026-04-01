const mongoose = require('mongoose');
const Review = require('../models/ReviewModel');
const Product = require('../models/ProductSchema');  // Assuming you have a Product model for product validation

const getAllReviews = async (req, res) => {
  const { productId } = req.params;
  // console.log("➡️ API HIT: productId =", productId);
  try {
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (err) {
    console.log("❌ Error while fetching reviews", err);
    res.status(500).json({ error: 'Server error while fetching reviews' });
  }
};

// POST a new review
const createReview = async (req, res) => {
  try {

    // Destructuring the data from req.body
    const { rating, title, content, name, location, date, productId, userId } = req.body;

    // Step 1: Ensure productId is present and valid

    // console.log("Received productId from req.body:", productId);
    // console.log("Received userId from req.body:", userId);

    // console.log(req.body); 

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }
    

    // Step 2: Check if the product exists in the database
    const product = await Product.findById(productId);
    // console.log('Received productId from req.body:', productId);

    // If product not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Step 3: Create the new review document
    const review = new Review({
      rating,
      title,
      content,
      name,
      location,
      date,
      productId, // ✅ correct
      userId, 
      image: req.file?.filename || '', // If there's an image, save it, else save an empty string
    });

    // Step 4: Save the review to the database
    await review.save();

    // Return the success response with the created review
    res.status(201).json({ message: 'Review created successfully', review });

  } catch (err) {
    // Log the error and return a generic error message
    console.error('Error in createReview:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


module.exports = {
  getAllReviews,
  createReview,
};

