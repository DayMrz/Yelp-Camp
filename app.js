const express = require('express'); //1
const app = express(); //1
const path = require('path'); //1
const mongoose = require('mongoose');

const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!')
});



// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => { //1
    // console.log('HOLI FROM YELP CAMP!')
    res.render('Home')//1
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'Cheap Camping'});
    await camp.save();
    res.send(camp)
})


app.listen(3000, () => {//1
    console.log('APP LISTENING ON PORT 3000')//1
})