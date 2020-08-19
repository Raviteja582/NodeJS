const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { MongoClient } = require('mongodb');
const { debugPort } = require('process');

const url = 'mongodb://localhost:27017/';
const dbname ='git-test';

MongoClient.connect(url,  (err,client) => {

    assert.equal(err,null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);
    const collection = db.collection('dishes');

    collection.insertOne({ "name": "uthappizza", "description": "Test"}, (err,result) => {

        if(err) throw err;
        console.log('After Insert:\n');
        console.log(result.ops);

        collection.find({}).toArray((err,docs) => {

            if(err) throw err;
            console.log('Found: \n');
            console.log(docs);

            db.dropCollection('dishes', (err,result) => {
                if(err) throw err;
                client.close();
            });
        });

    });

});