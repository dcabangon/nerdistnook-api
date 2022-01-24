// IMPORT PACKAGES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

// IMPORT MONGOUTIL OBJ
const MongoUtil = require('./MongoUtil');
const { ObjectId } = require('mongodb');

let app = express();
app.use(express.json());

// ENABLE CORS
app.use(cors());


// ROUTES
async function main() {

    await MongoUtil.connect(process.env.MONGO_URI, "Comic_Collection")

    app.get('/', function (req, res) {
        res.json({
            "message": "Hello from my API "
        })
    })

    app.post('/item_entry', async function (req, res) {
        const db = MongoUtil.getDB();

        let bookName = req.body.bookName;
        let issueNumber = req.body.issueNumber;
        let publisher = req.body.publisher;
        let writer = req.body.writer;
        let imageLink = req.body.imageLink;
        let review = req.body.review;
        let rating = req.body.rating;
        

        try {
            let result = await db.collection('Comic').insertOne({
                'bookName': bookName,
                'issueNumber': issueNumber,
                'publisher': publisher,
                'writer': writer,
                'imageLink':imageLink,
                'review':review,
                'rating':rating
            })
            res.json(result)
        }
        catch (e) {
            res.status(500);
            // 500 = internal server error
            res.json({
                'error': "Failed to add entry"
            })
        }
    })

    // SEARCH - Endpoint
    app.get('/item_entry', async function (req, res) {
        const db = MongoUtil.getDB();
        // db.collection('Comic').find({

        console.log(req.query);

        let criteria = {};

        if (req.query.description) {
            criteria["bookName"] = {
                '$regex': req.query.description,
                '$options': 'i'
            }
        }


        if (req.query.description) {
            criteria["issueNumber"] = {
                '$regex': req.query.description,
                '$options': 'i'
            }
        }

        if (req.query.description) {
            criteria["publisher"] = {
                '$regex': req.query.description,
                '$options': 'i'
            }
        }

        if (req.query.description) {
            criteria["writer"] = {
                '$regex': req.query.description,
                '$options': 'i'
            }
        }

        if (req.query.description) {
            criteria["imageLink"] = {
                '$regex': req.query.description,
            }
        }

        if (req.query.description) {
            criteria["review"] = {
                '$regex': req.query.description,
                '$options': 'i'
            }
        }

        if (req.query.description) {
            criteria["rating"] = {
                '$regex': req.query.description,
                '$options': 'i'
            }
        }

        let results = await db.collection('Comic').find(criteria).toArray();
        res.json(results);
    })

    // UPDATE - Endpoint
    app.put('/item_entry/:id', async function (req, res) {
        try {
            await db.collection('Comic').updateOne({
                '_id': ObjectId(req.params.id)
            }, {
                'bookName' : req.body.bookName,
                'issueNumber' : req.body.issueNumber,
                'publisher' : req.body.publisher,
                'writer' : req.body.writer,
                'imageLink' : req.body.imageLink,
                'review' : req.body.review,
                'rating' : req.body.rating
            })
            res.json({
                'message': "Success"
            })
        }
        catch (e) {
            res.status(500);
            res.json({
                'message': "Unable to update Entry"
            })
        }
    })

    // DELETE - Endpoint
    app.delete('/item_entry/:id', async function(req,res){
        const db = MongoUtil.getDB();
        await db.collection('Comic').remove({
            '_id':ObjectId(req.params.id)
        })
        res.json({
            'message':"Entry has been deleted"
        })
    })
}
main();
 
    // START SERVER
    app.listen(3000, function (req, res) {
        console.log("Server Started")
    })