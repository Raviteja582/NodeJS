const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/git-test';

const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('Connected Corretly to server');


    Dishes.create({
        name: 'Uthapizza',
        description: 'test'
    })
    .then((dish) =>{
        console.log(dish);

        return Dishes.findByIdAndUpdate(dish._id,{
            $set: {description: 'Updated Test'}
        },{
            new : true 
        }).exec();
    })
    .then((dish) => {
        console.log(dish);
        dish.comments.push({
            rating : 5,
            comment: 'Its nice to learning MongoDB',
            author: 'Ravi teja',
        });

        return dish.save();
    })
    .then((dish) =>{

        console.log(dish);
        return Dishes.remove({});

    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err)
    })
});