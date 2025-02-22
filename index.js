require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
// const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-management-applicat-7620d.web.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5lka3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://task-management-applicat-7620d.web.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const userCollection = client.db("taskDB").collection("users");
    const taskCollection = client.db("taskDB").collection("task");
    const activityLogCollection = client.db("taskDB").collection("activity");

    app.post("/users", async (req, res) => {
      const { email, name, photoURL, userId } = req.body;
      const existingUser = await userCollection.findOne({ email });

      if (existingUser) {
        return res.send({ message: "User exists" });
      }

      const newUser = { email, name, photoURL, userId };
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      io.emit("taskAdded", task);
      res.send(result);
    });

    // app.get("/taskAdded", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //   const result = await taskCollection.find(query).toArray();
    //   res.send(result);
    // });
    app.get("/taskAdded", async (req, res) => {
      const email = req.query.email; // Accept email as query param
      if (!email) return res.status(400).json({ message: "Email is required" });

      try {
        const query = { email: email };
        const result = await taskCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedTask }
      );

      io.emit("taskUpdated", { _id: id, ...updatedTask });
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
      io.emit("taskDeleted", id);
      res.send(result);
    });

    app.get("/", (req, res) => {
      res.send("Task Manager is on work");
    });

    io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

server.listen(port, () => {
  console.log(`Task Manager is working in port: ${port}`);
});
