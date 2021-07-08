const express = require('express'); //1
const app = express(); //1
const path = require('path'); //1
const mongoose = require('mongoose');

const Campground = require('./models/campground');
const methodOverride = require('method-override');
// const { truncate } = require('fs');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('we are connected!')
});


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

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
});


app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    // console.log(req.body);
    // res.send('PUT');
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.post('/campgrounds', async (req, res) => {
    // res.send(req.body) // create a path
    const newCampground = new Campground(req.body.campground)
    await newCampground.save();
    // console.log(newCampground)
    // res.send('making new product')
    res.redirect(`/campgrounds/${newCampground._id}`)
})


app.listen(3000, () => {//1
    console.log('APP LISTENING ON PORT 3000')//1
})