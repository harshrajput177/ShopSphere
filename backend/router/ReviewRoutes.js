const express = require('express');
const { upload, compressImages } = require("../MiddleWare/Multer-2");
const { getAllReviews, createReview } = require('../Controller/ReveiwController');
// const protect = require('../MiddleWare/MiddleWare'); 


const router = express.Router();

router.get('/get-reviews/:productId', getAllReviews); // 👈 Add :productId

router.post('/create-reviews',upload.single('image'),compressImages, createReview);



module.exports = router;

