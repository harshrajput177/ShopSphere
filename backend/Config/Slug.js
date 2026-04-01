// slug.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('../models/ProductSchema'); // Apne product model ka sahi path do


// MongoDB se connect karo
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  updateSlugs(); // connection successful hone ke baad slug update karo
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Slug update karne wali function
async function updateSlugs() {
  try {
    // Un products ko dhundo jinke paas slug nahi hai
    const products = await Product.find({ slug: { $exists: false } });

    for (const product of products) {
      // Slug generate karo product name se
      product.slug = slugify(product.name, { lower: true, strict: true });
      await product.save();
      console.log(`Slug updated for: ${product.name}`);
    }

    console.log('Slug update complete');
    mongoose.disconnect(); // DB connection band karo
  } catch (error) {
    console.error('Error updating slugs:', error);
    mongoose.disconnect(); // DB connection band karo agar error aaye
  }
}

