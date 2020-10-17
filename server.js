// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const productsController = require('./controllers/ProductsController')
const productsRatingsController = require('./controllers/ProductRatingsController')
const usersController = require('./controllers/UsersController')
const app = express();
const port = 5000;

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({
  extended: true
}))
// import session package
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))

// app.use(guestOnlyMiddleware)
app.use(setUserVarMiddleware)

// ====== PRODUCTS ROUTES ====== 
// index route
app.get('/products', productsController.listProducts)

// new route
app.get('/products/new', productsController.newProduct)

// show route
app.get('/products/:slug', productsController.showProduct)

// create route
app.post('/products', productsController.createProduct)

// edit route
app.get('/products/:slug/edit', productsController.showEditForm)

// update route
app.patch('/products/:slug', productsController.updateProduct)

// delete route
app.delete('/products/:slug', productsController.deleteProduct)

// ====== PRODUCT RATINGS ROUTES ====== 
// product rating new route
app.get('/products/:slug/ratings/new', productsRatingsController.newProductRatingForm)

// product rating create route
app.post('/products/:slug/ratings', productsRatingsController.createProductRating)

// ====== USER ON-BOARDING ROUTES ====== 
// apply guestOnlyMiddleware here

// user registration form route
app.get('/users/register', guestOnlyMiddleware, usersController.showRegistrationForm)

// user registration
app.post('/users/register', guestOnlyMiddleware, usersController.register)

// user login form route
app.get('/users/login', guestOnlyMiddleware, usersController.showLoginForm)

// user login route
app.post('/users/login', guestOnlyMiddleware, usersController.login)


// ====== USER-ONLY ROUTES ====== 

// user dashboard
// apply authenticatedMiddleware here
app.get('/users/dashboard', authenticatedOnlyMiddleware, usersController.dashboard)

// user logout
app.post('/users/logout', authenticatedOnlyMiddleware, usersController.logout)

// connect to DB, then inititate Express app
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    // DB connected successfully
    console.log('DB connection successful')

    app.listen(process.env.PORT || port, () => {
      console.log(`Biscoff Bakery app listening on port: ${port}`)
    })
  })
  .catch(err => {
    console.log(err)
  })

// middleware
function guestOnlyMiddleware(req, res, next) {
  // console.log('middle ware hit before hitting controller')
  // next()

    // check if user is logged in
    // If logged in, redirect back to dashboard
    if (req.session && req.session.user) {
        res.redirect('/users/dashboard')
        return
    }
    next()

    // console.log('stuck - no next request')

}


function authenticatedOnlyMiddleware(req, res, next) {
  if(! req.session || ! req.session.user) {
    res.redirect('/users/login')
    return
  }

  next()

}

// logout middleware
function setUserVarMiddleware(req, res, next) {
  // default user template var set to null
  res.locals.user = null

  // check if req.session.user is set
  // if set, template user var will be set as well
  if (req.session && req.session.user) {
    res.locals.user = req.session.user
  }

  next()
}