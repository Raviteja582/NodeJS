const express = require('express');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const favorite =require('../models/favorite');
const cors =require('./cors');
 
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    favorite.findOne({author:req.user._id})
    .populate('author')
    .populate('dishes')
    .exec( (err, favorites) => {
        if (err) next(err);
        res.json(favorites);
    })
    /* .then((dishes) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(dishes);
    }, (err) => next(err)) */
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    favorite.findOne({author: req.user._id})
    .then( (dish) => {
        if(dish == null){
            favorite.create({author: req.user._id})
            .then( (dish) => {
                for(var i=0;i<req.body.length;i++){
                    if(dish.dishes.indexOf(req.body[i]["_id"]) === -1) 
                        dish.dishes.push(req.body[i]["_id"]);
                }
                dish.save()
                .then( (dish) => {
                    favorite.findById(dish._id)
                    .populate('author')
                    .populate('dishes')
                    .then( (dish) => {
                        res.statusCode=200
                        res.setHeader('Content-type','application/json');
                        res.json(dish);
                    })
                }, (err) => next(err))
                .catch((err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err) )
        }
        else{
            for(var i=0;i<req.body.length;i++){
                if(dish.dishes.indexOf(req.body[i]["_id"]) === -1) 
                    dish.dishes.push(req.body[i]["_id"]);
            }
            //dish.dishes.push(req.body);
            dish.save()
            .then( (dish) => {
                favorite.findById(dish._id)
                .populate('author')
                .populate('dishes')
                .then( (dish) => {
                    res.statusCode=200
                    res.setHeader('Content-type','application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/ID');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    favorite.findOne({author: req.user._id})
    .then( (dish) => {
        while(dish.dishes.length){
            dish.dishes.remove(dish.dishes[0]);
        }
        dish.save()
        .then( (dish) => {
            favorite.findById(dish._id)
            .populate('author')
            .populate('dishes')
            .then( (dish) => {
                res.statusCode=200
                res.setHeader('Content-type','application/json');
                res.json(dish);
            })
        }, (err) => next(err))
            .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    favorite.findOne({author: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    console.log(req.params.dishId);
    favorite.findOne({author: req.user._id})
    .then( (dish) => {
        if(dish == null){
            favorite.create({author: req.user._id})
            .then( (dish) => {
                if(dish.dishes.indexOf(req.params.dishId) === -1) 
                    dish.dishes.push(req.params.dishId);
                dish.save()
                .then( (dish) => {
                    favorite.findById(dish._id)
                    .populate('author')
                    .populate('dishes')
                    .then( (dish) => {
                        res.statusCode=200
                        res.setHeader('Content-type','application/json');
                        res.json(dish);
                    })
                }, (err) => next(err))
                .catch((err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err) )
        }
        else{
            if(dish.dishes.indexOf(req.params.dishId) === -1) 
                dish.dishes.push(req.params.dishId);
            dish.save()
            .then( (dish) => {
                favorite.findById(dish._id)
                .populate('author')
                .populate('dishes')
                .then( (dish) => {
                    res.statusCode=200
                    res.setHeader('Content-type','application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/ID');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    favorite.findOne({author: req.user._id})
    .then( (dish) => {
        if(dish.dishes.indexOf(req.params.dishId) !== -1) {
            dish.dishes.remove(req.params.dishId);
            dish.save()
            .then( (dish) => {
                favorite.findById(dish._id)
                .populate('author')
                .populate('dishes')
                .then( (dish) => {
                    res.statusCode=200
                    res.setHeader('Content-type','application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
            .catch((err) => next(err))
        }
        else{
            res.statusCode=200
            res.end("Not Found");
        }
    }, (err) => next(err))
    .catch((err) => next(err))
});
module.exports =favoriteRouter;