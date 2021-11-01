const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId

const cors = require('cors')
const app= express();


const port= process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.16pzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
       await client.connect()
       const database = client.db('booking');
       const hotelCollection = database.collection('hotels')
       const bookingCollection= database.collection('bookings')
       const exploreCollection= database.collection('ExplorePlaces')

    // GET hotels API 
       app.get('/hotels',async(req,res)=>{
            const cursor = hotelCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
       })

    //    GET single Service 
    app.get('/hotels/:id', async(req , res)=>{
        const id= req.params.id;
        const query = {_id:ObjectId(id)}
        const service = await hotelCollection.findOne(query)
        res.json(service)
    });

    // POST Api 
    app.post('/hotels',async(req,res)=>{
            const hotel = req.body;
            const result = await hotelCollection.insertOne(hotel)
            res.json(result)
    })

    // booking POST api 
    app.post('/bookings',async(req,res)=>{
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings)
            res.json(result)
    })

    // GET booking API 
    app.get('/bookings',async(req, res)=>{
        const cursor= bookingCollection.find({})
        const bookings = await cursor.toArray();
        res.send(bookings)
    })

    // GET Explore Places API
    app.get('/places',async(req,res)=>{
        const cursor = exploreCollection.find({})
        const places = await cursor.toArray()
        res.send(places)
    })

    // GET Users Bookings APi
    app.get('/bookings/:email', async(req, res)=>{
        const id= req.params.email;
        const query= {email:id};
        const cursor = bookingCollection.find(query);
        const booking= await cursor.toArray()
        res.json(booking)

    })

    // DELETE Booking API
    app.delete('/bookings/:id', async(req,res)=>{
        const id = req.params.id;
        const query={_id:ObjectId(id)};
        const result =await bookingCollection.deleteOne(query)
        res.json(result)
        
    })


    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("welcome to node server")
})
app.listen(port,()=>{
    console.log("listening ",port)
})