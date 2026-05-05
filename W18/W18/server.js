const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;

// MongoDB connection
const url = "mongodb://localhost:27017";
const dbName = "music"; // (a) Database called music
const collectionName = "songdetails"; // (b) Collection called song details

let db, collection;

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─────────── Connect to MongoDB & seed data ───────────
async function connectDB() {
  try {
    const client = await MongoClient.connect(url);
    console.log("Connected to MongoDB successfully!");

    db = client.db(dbName); // (a) Create / use 'music' database
    collection = db.collection(collectionName); // (b) Create / use 'songdetails' collection

    // (c) Insert array of 5 song documents if collection is empty
    const count = await collection.countDocuments();
    if (count === 0) {
      const songs = [
        {
          Songname: "Tum Hi Ho",
          Film: "Aashiqui 2",
          Music_director: "Mithun",
          Singer: "Arijit Singh",
        },
        {
          Songname: "Channa Mereya",
          Film: "Ae Dil Hai Mushkil",
          Music_director: "Pritam",
          Singer: "Arijit Singh",
        },
        {
          Songname: "Kal Ho Naa Ho",
          Film: "Kal Ho Naa Ho",
          Music_director: "Shankar Ehsaan Loy",
          Singer: "Sonu Nigam",
        },
        {
          Songname: "Chaiyya Chaiyya",
          Film: "Dil Se",
          Music_director: "A.R. Rahman",
          Singer: "Sukhwinder Singh",
        },
        {
          Songname: "Kun Faya Kun",
          Film: "Rockstar",
          Music_director: "A.R. Rahman",
          Singer: "A.R. Rahman",
        },
      ];
      await collection.insertMany(songs);
      console.log("Inserted 5 song documents into songdetails collection.");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// ──────────────────────── ROUTES ────────────────────────

// (d) Display total count of documents & list all documents
app.get("/", async (req, res) => {
  const songs = await collection.find().toArray();
  const totalCount = await collection.countDocuments();
  res.render("index", {
    songs,
    totalCount,
    message: req.query.message || null,
  });
});

// (e) List specified Music Director songs
app.get("/by-director", async (req, res) => {
  const director = req.query.director || "";
  let songs = [];
  if (director) {
    songs = await collection
      .find({ Music_director: { $regex: director, $options: "i" } })
      .toArray();
  }
  res.render("byDirector", { songs, director });
});

// (f) List specified Music Director songs sung by specified Singer
app.get("/by-director-singer", async (req, res) => {
  const director = req.query.director || "";
  const singer = req.query.singer || "";
  let songs = [];
  if (director && singer) {
    songs = await collection
      .find({
        Music_director: { $regex: director, $options: "i" },
        Singer: { $regex: singer, $options: "i" },
      })
      .toArray();
  }
  res.render("byDirectorSinger", { songs, director, singer });
});

// (g) Delete the song which you don't like
app.post("/delete/:id", async (req, res) => {
  await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/?message=Song deleted successfully!");
});

// (h) Add new song which is your favourite
app.get("/add", (req, res) => {
  res.render("addSong");
});

app.post("/add", async (req, res) => {
  const { Songname, Film, Music_director, Singer } = req.body;
  await collection.insertOne({ Songname, Film, Music_director, Singer });
  res.redirect("/?message=New favourite song added successfully!");
});

// (i) List Songs sung by Specified Singer from specified film
app.get("/by-singer-film", async (req, res) => {
  const singer = req.query.singer || "";
  const film = req.query.film || "";
  let songs = [];
  if (singer && film) {
    songs = await collection
      .find({
        Singer: { $regex: singer, $options: "i" },
        Film: { $regex: film, $options: "i" },
      })
      .toArray();
  }
  res.render("bySingerFilm", { songs, singer, film });
});

// (j) Update the document by adding Actor and Actress name
app.get("/update/:id", async (req, res) => {
  const song = await collection.findOne({ _id: new ObjectId(req.params.id) });
  res.render("updateSong", { song });
});

app.post("/update/:id", async (req, res) => {
  const { Actor, Actress } = req.body;
  await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { Actor, Actress } }
  );
  res.redirect("/?message=Song updated with Actor and Actress!");
});

// ──────────────────── Start Server ────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
