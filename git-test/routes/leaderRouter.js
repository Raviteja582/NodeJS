const express = require('express');
const bodyParser =require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
 
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

const leaders = require('../models/leaders');

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    leaders.find(req.query)
    .then( (leaders) => {
        res.statusCode=200;
        res.contentType('Content-Type','application/json');
        res.json(leaders);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    leaders.create(req.body)
    .then( (leader) => {
        res.statusCode=200;
        res.contentType('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})

.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    leaders.remove({})
    .then((resp) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})


leaderRouter.route('/:leaderID')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    leaders.findById(req.params.leaderID)
    .then((leader) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err) );
})

.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leader/'+req.params.leaderID);
})

.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    leaders.findByIdAndUpdate(req.params.leaderID,{
        $set: req.body
    },{
        new: true
    })
    .then((leader) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err) );
})

.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    leaders.findByIdAndRemove(req.params.leaderID)
    .then((leader) => {
        res.statusCode=200
        res.setHeader('Content-type','application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err) );
});

module.exports =leaderRouter;