const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
const port = 4000;

let matches = [];

app.get("/matches", (req, res) => {
  res.send(matches);
});

app.get("/matches/:id", (req, res) => {
  const id = req.params.id;
  const match = matches.filter((node) => node.id === id);
  res.send(match[0]);
});

app.post("/matches", async (req, res) => {
  const lMatches = req.body.map((match) => ({
    ...match,
    id: randomBytes(4).toString("hex"),
  }));
  matches = [...matches, ...lMatches];

  await axios
    .post("http://localhost:4005/event", {
      type: "MATCH_CREATED",
      data: lMatches
    });

  res.send(matches);
});

app.post("/event", (req, res) => {
    console.log(`Message Received: ${req.body.type}`);
    console.log(`Data Received: ${JSON.stringify(req.body)}`);
    res.send({});
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
