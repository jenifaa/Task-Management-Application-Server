require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5lka3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("taskDB").collection("users");
    const taskCollection = client.db("taskDB").collection("task");
    app.post("/users", async (req, res) => {
      const { email, name, photoURL } = req.body;

      const existingUser = await userCollection.findOne({ email });

      if (existingUser) {
        return res.send({ message: "User exists" });
      }

      const newUser = {
        email,
        name,
        photoURL,
      };

      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    app.post("/task", async (req, res) => {
      const task = req.body;

      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Manager is on work");
});
app.listen(port, () => {
  console.log(`Task Manager  is working in port : ${port}`);
});
