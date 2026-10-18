import express from "express";
import { connectToMongoDB } from "./db.js";

const app = express();

app.get("/q1", async (req, res) => {
  const client = await connectToMongoDB();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  const data = await movies
    .find({
      year: 2015,
      genres: "Action",
      runtime: { $gt: 120 },
    })
    .toArray();
  res.json(data);
});
app.get("/q2", async (req, res) => {
  const client = await connectToMongoDB();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  const data = await movies
    .find(
      {
        directors: "Christopher Nolan",
      },
      { projection: { _id: 0, title: 1, year: 1, runtime: 1 } },
    )
    .sort({ year: -1 })
    .toArray();
  res.json(data);
});
app.get("/q3", async (req, res) => {
  const client = await connectToMongoDB();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  await movies.insertOne({
    title: "Avenger:Dooms Day",
    year: 2026,
    runtime: 160,
    rated: "PG-13",
    type: "movie",
    genres: ["Action", "Adventure"],
  });

  const data = await movies.find(
    {
      year: 2026,
    },
    { projection: { _id: 0, title: 1, year: 1, runtime: 1 } },
  ).toArray();
  res.json(data);
});

app.get("/q4", async (req, res) => {
  const client = await connectToMongoDB();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  await movies.updateMany(
    {
      year: 2014,
      num_mflix_comments: { $gt: 5 },
    },
    {
      $set: { isPopuler: true },
      $inc: { num_mflix_comments: 1 },
    },
  );

  const data = await movies
    .find(
      {
        year: 2014,
      },
      { projection: { _id: 0, title: 1, isPopuler: 1, num_mflix_comments: 1 } },
    )
    .toArray();
  res.json(data);
});
app.get("/q5", async (req, res) => {
  const client = await connectToMongoDB();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  await movies.deleteMany({
    year: { $lt: 1920 },
    runtime: { $lt: 30 },
  });

  const data = await movies
    .find({
      year: { $lt: 1920 },
      runtime: { $lt: 30 },
    })
    .toArray();
  //انا مرجع بتاعة فاضية عشان اتاكد انهم اتمسحو
  res.json(data);
});
app.get("/q6", async (req, res) => {
  const client = await connectToMongoDB();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  const data = await movies
    .aggregate([
      { $match: { year: { $gt: 2010 } } },
      {
        $group: {
          _id: "$year",
          totalmovies: { $sum: 1 },
          avgRuntime: { $avg: "$runtime" },
        },
      },
      { $sort: { _id: -1 } },
    ])
    .toArray();

  res.json(data);
});

app.get("/test", async (req, res) => {
  const client = await connectToMongoDB();
  const db = client.db("sample_mflix");
  const movies = db.collection("movies");

  const data = await movies
    .find(
      { year: 2026 },
      {
        projection: { title: 2026 },
      },
    )
    .toArray();

  res.json(data);
});

app.listen(3000, () => {
  console.log("Connected On port 3000");
});
