const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())





app.get('/',(req,res)=>{
    res.send('Painting is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zuwbcyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("painting");
    const userCollection = database.collection("paints");

    app.get('/paints',async(req,res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/addproduct',async(req,res)=>{
        const product = req.body;
        console.log("new user",product)
        const result = await userCollection.insertOne(product);
        res.send(result)

    })
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Simple Crud is running")
})

app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})