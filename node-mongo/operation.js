exports.insertDocument =( db, document, collection, callback) => {

    const coll =db.collection(collection);
    coll.insert(document, (err,result) => {

        if(err) throw err;
        console.log('Inserted' + result.result.n + "Documents into Collection " + collection);
        callback(result);
    });


};


exports.findDocuments =( db, collection, callback) => {

    const coll =db.collection(collection);
    coll.find({}).toArray((err,docs) => {

        if(err) throw err;
        callback(docs);
        
    });

};


exports.removeDocument =( db, document, collection, callback) => {
    
    const coll =db.collection(collection);
    coll.deleteOne(document,(err,result) => {

        if(err) throw err;
        console.log("Removed the document " + document);
        callback(result);

    });

};

exports.updateDocument =( db, document, update, collection, callback) => {

    const coll =db.collection(collection);
    coll.updateOne(document, {$set: update}, null, (err,result) => {

        if(err) throw err;
        console.log("Update the Document with ",update);
        callback(result);

    });


};

