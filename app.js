const express = require('express'); //1
const app = express(); //1
const path = require('path'); //1
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas')

const Campground = require('./models/campground');
const methodOverride = require('method-override');
// const { truncate } = require('fs');
const ExpressError = require('./Utilities/ExpressError');
const catchAsync = require('./Utilities/catchAsync');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('we are connected!')
});


app.engine('ejs', ejsMate)
// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => { //1
    // console.log('HOLI FROM YELP CAMP!')
    res.render('Home')//1
});

// checking 
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'My Backyard', description: 'Cheap Camping' });
//     await camp.save();
//     res.send(camp)
// })

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    // console.log(result);
}


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // res.send(req.body) // create a path
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data')
    const newCampground = new Campground(req.body.campground)
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
    // res.send('making new product')
}))

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
}));


app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    // console.log(req.body);
    // res.send('PUT');
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    // res.send("404!!")
    next(new ExpressError('Page Not Found', 404))

})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    // res.send('Ohh no, Something Went Wrong!')
})


app.listen(3000, () => {//1
    console.log('APP LISTENING ON PORT 3000')//1
})