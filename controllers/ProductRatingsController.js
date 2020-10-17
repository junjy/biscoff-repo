const ProductModel = require('../models/products')
const ProductRatingModel = require('../models/product_ratings')

const controllers = {

    newProductRatingForm: (req, res) => {
        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                if (!result) {
                    res.redirect('/products')
                }
                res.render('product-ratings/new', {
                    pageTitle: "New Rating",
                    product: result
                })
            })
            .catch(err => {
                res.redirect('/products')
            })
    },

    createProductRating: (req, res) => {

        // find product from DB
        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                if (!result) {
                    res.redirect('/products')
                    return
                }
                
                ProductRatingModel.create({
                    product_id: result._id.toString(),
                    product_slug: result.slug,
                    rating: req.body.rating,
                    comment: req.body.comment
                })
                    .then(prCreateResult => {
                        res.redirect('/products/' + req.params.slug)
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/products')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/products')
            })

    }

}

module.exports = controllers
