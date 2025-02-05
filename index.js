const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
app.use(cors({
  origin: ["http://localhost:5173","https://my-art-72b96.web.app"]
}))
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
    // await client.connect();

    const database = client.db("painting");
    const userCollection = database.collection("paints");
    const categoryCollection = database.collection('category')
    app.get('/paints',async(req,res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
     
    app.get('/paint/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query)
      res.send(result)
    })

  app.get('/paints/:email',async(req,res)=>{
    console.log(req.params.email)
    const result = await userCollection.find({email:req.params.email}).toArray()
    res.send(result)
})
    app.post('/addproduct',async(req,res)=>{
        const product = req.body;
        const result = await userCollection.insertOne(product);
        res.send(result)

    })
    app.post('/category',async(req,res)=>{
      const category = req.body;
      const result = await categoryCollection.insertOne(category);
      res.send(result)

  })
  app.get('/category',async(req,res)=>{
    const cursor = categoryCollection.find()
    const result = await cursor.toArray()
    res.send(result)
  })
    app.put('/paint/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedpaint = req.body
      const paint = {
        $set: {
          image : updatedpaint.image,
          item_name : updatedpaint.item_name,
          subCategory : updatedpaint.subCategory,
          description : updatedpaint.description,
          price : updatedpaint.price, 
          rating : updatedpaint.rating,
          customization : updatedpaint.customization,
          processing_time : updatedpaint.processing_time,
          StockStatus : updatedpaint.StockStatus
        }
      }
      const result = await userCollection.updateOne(filter,paint,options)
      res.send(result)
    })

    app.delete('/paints/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
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