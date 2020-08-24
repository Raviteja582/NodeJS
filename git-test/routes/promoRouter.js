const express = require('express');
const bodyParser =require('body-parser');
const authenticate = require('../authenticate');
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

const promos = require('../models/promo');

promoRouter.route('/')
.get((req,res,next) => {
    promos.find({})
    .then( (promos) => {
        res.statusCode=200;
        res.contentType('Content-Type','application/json');
        res.json(promos);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    promos.create(req.body)
    .then( (promo) => {
        res.statusCode=200;
        res.contentType('Content-Type','application/json');
        res.json(promo);
    },(err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    promos.remove({})
    .then((resp) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})


promoRouter.route('/:promoID')
.get((req,res,next) => {
    promos.findById(req.params.promoID)
    .then((promo) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err) );
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promo/'+req.params.promoID);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    promos.findByIdAndUpdate(req.params.promoID,{
        $set: req.body
    },{
        new: true
    })
    .then((promo) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err) );
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    promos.findByIdAndRemove(req.params.promoID)
    .then((promo) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err) );
});

module.exports =promoRouter;