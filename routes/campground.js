const express = require('express');
const router = express.Router()
const catchAsync = require('../Utilities/catchAsync');
const campgrounds = require('../controllers/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post( 
    //     isLoggedIn, 
    //     validateCampground, 
    //     catchAsync(campgrounds.createCampground));
    .post(upload.single('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send('Yay :3');
    })

router.get('/new', 
    isLoggedIn, 
    campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn, 
        isAuthor, 
        validateCampground, 
        catchAsync(campgrounds.updateCampground))
    .delete( 
        isLoggedIn, 
        isAuthor, 
        catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', 
    isLoggedIn, 
    isAuthor, 
    catchAsync(campgrounds.renderEditForm));

module.exports = router;