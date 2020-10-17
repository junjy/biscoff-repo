const mongoose = require('mongoose')

const productRatingSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    product_slug: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        max: 300
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const ProductRatingModel = mongoose.model('Product_Rating', productRatingSchema)

module.exports = ProductRatingModel
