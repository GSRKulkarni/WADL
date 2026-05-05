const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const sampleStudents = require("../models/studentData");
const { renderTemplate, buildTableRows, buildNameRows, buildOptions } = require("../views/helpers");

const router = express.Router();
const collectionName = "studentmarks";

// Helper to get collection
function getCollection() {
  return getDB().collection(collectionName);
}

// ═══════════════════════════════════════
// (a)(b)(c) — Home: seed database & show status
// ═══════════════════════════════════════
router.get("/", async (req, res) => {
  const collection = getCollection();
  const count = await collection.countDocuments();
  let seedMsg = "";

  if (count === 0) {
    await collection.insertMany(sampleStudents);
    seedMsg = `<div class="msg-success">✅ Database <b>student</b> created, collection <b>studentmarks</b> created, and ${sampleStudents.length} sample documents inserted successfully!</div>`;
  }

  const totalCount = await collection.countDocuments();

  const html = renderTemplate("home.html", {
    TITLE: "Home",
    SEED_MSG: seedMsg,
    COUNT: totalCount,
  });
  res.send(html);
});

// ═══════════════════════════════════════
// (d)(j) — Display total count + list all documents in tabular format
// ═══════════════════════════════════════
router.get("/students", async (req, res) => {
  const collection = getCollection();
  const students = await collection.find({}).toArray();

  const html = renderTemplate("students.html", {
    TITLE: "All Students",
    COUNT: students.length,
    TABLE_ROWS: buildTableRows(students, true),
  });
  res.send(html);
});

// ═══════════════════════════════════════
// (e) — Students who got more than 20 marks in DSBDA
// ═══════════════════════════════════════
router.get("/students/dsbda-above-20", async (req, res) => {
  const collection = getCollection();
  const students = await collection.find({ DSBDA_Marks: { $gt: 20 } }).toArray();

  const html = renderTemplate("dsbda.html", {
    TITLE: "DSBDA > 20",
    COUNT: students.length,
    TABLE_ROWS: buildTableRows(students),
  });
  res.send(html);
});

// ═══════════════════════════════════════
// (f) — Update marks of a specified student by 10 (GET form)
// ═══════════════════════════════════════
router.get("/students/update", async (req, res) => {
  const collection = getCollection();
  const students = await collection.find({}).toArray();
  const msg = req.query.msg || "";

  const html = renderTemplate("update.html", {
    TITLE: "Update Marks",
    MSG: msg ? `<div class="msg-success">${msg}</div>` : "",
    OPTIONS: buildOptions(students),
    TABLE_ROWS: buildTableRows(students),
  });
  res.send(html);
});

// ═══════════════════════════════════════
// (f) — POST: update marks by +10
// ═══════════════════════════════════════
router.post("/students/update", async (req, res) => {
  const collection = getCollection();
  const { studentId } = req.body;
  await collection.updateOne({ _id: new ObjectId(studentId) }, {
    $inc: {
      WAD_Marks: 10,
      DSBDA_Marks: 10,
      CNS_Marks: 10,
      CC_Marks: 10,
      AI_Marks: 10,
    },
  });
  res.redirect("/students/update?msg=Marks updated successfully (+10 to all subjects)!");
});

// ═══════════════════════════════════════
// (g) — Students who got more than 25 marks in ALL subjects
// ═══════════════════════════════════════
router.get("/students/all-above-25", async (req, res) => {
  const collection = getCollection();
  const students = await collection.find({
    WAD_Marks: { $gt: 25 },
    DSBDA_Marks: { $gt: 25 },
    CNS_Marks: { $gt: 25 },
    CC_Marks: { $gt: 25 },
    AI_Marks: { $gt: 25 },
  }).toArray();

  const html = renderTemplate("allAbove25.html", {
    TITLE: "All Subjects > 25",
    COUNT: students.length,
    NAME_ROWS: buildNameRows(students),
  });
  res.send(html);
});

// ═══════════════════════════════════════
// (h) — Students who got less than 40 in both WAD and CC
// ═══════════════════════════════════════
router.get("/students/wad-cc-below-40", async (req, res) => {
  const collection = getCollection();
  const students = await collection.find({
    WAD_Marks: { $lt: 40 },
    CC_Marks: { $lt: 40 },
  }).toArray();

  const html = renderTemplate("wadCcBelow40.html", {
    TITLE: "WAD & CC < 40",
    COUNT: students.length,
    NAME_ROWS: buildNameRows(students),
  });
  res.send(html);
});

// ═══════════════════════════════════════
// (i) — Delete student (GET form)
// ═══════════════════════════════════════
router.get("/students/delete", async (req, res) => {
  const collection = getCollection();
  const students = await collection.find({}).toArray();
  const msg = req.query.msg || "";

  const html = renderTemplate("delete.html", {
    TITLE: "Delete Student",
    MSG: msg ? `<div class="msg-success">${msg}</div>` : "",
    OPTIONS: buildOptions(students),
    TABLE_ROWS: buildTableRows(students, true),
  });
  res.send(html);
});

// ═══════════════════════════════════════
// (i) — POST: delete student
// ═══════════════════════════════════════
router.post("/students/delete", async (req, res) => {
  const collection = getCollection();
  const { studentId } = req.body;
  const student = await collection.findOne({ _id: new ObjectId(studentId) });
  await collection.deleteOne({ _id: new ObjectId(studentId) });
  res.redirect(`/students/delete?msg=Student "${student?.Name}" deleted successfully!`);
});

// ═══════════════════════════════════════
// (i) — Direct delete via link (from All Students table)
// ═══════════════════════════════════════
router.get("/students/delete/:id", async (req, res) => {
  const collection = getCollection();
  const student = await collection.findOne({ _id: new ObjectId(req.params.id) });
  await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect(`/students?msg=Student "${student?.Name}" deleted successfully!`);
});

module.exports = router;
