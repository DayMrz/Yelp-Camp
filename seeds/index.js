const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const Campground = require('../models/campground');


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

// const seedDB = async() => {
//     await Campground.deleteMany({});
//     const c = new Campground({title: 'purple field'})
//     await c.save();
// } //first
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61664b061ddd963c346e05cd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa accusamus error corrupti magnam? In aspernatur nam, rem possimus mollitia velit explicabo eum eos tempora sunt accusantium. Enim voluptas incidunt li',
            price,
            geometry: {
            type: "Point",
            coordinates:[ -113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/daymrz/image/upload/v1635982764/YelpCamp/b7z78ygpmgjiqxcfbwyu.jpg',
                    filename: 'YelpCamp/bkmpebsa27tshvly1hve'
                },
                {
                    url: 'https://res.cloudinary.com/daymrz/image/upload/v1635982764/YelpCamp/wlnvv9luuubfrt9p5ot3.jpg',
                    filename: 'YelpCamp/xvntwh2p973xfzkk2gwl'
                }
            ] 
        })
        await camp.save()
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})

