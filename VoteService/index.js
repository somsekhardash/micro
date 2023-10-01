const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require('cors')
const axios = require('axios');
app.use(cors());
app.use(bodyParser.json());

const port = 4001;

let votes = [];

app.get("/votes", (req, res) => {
  res.send(votes);
});

app.get("/matches/:id/votes", (req, res) => {
  const id = req.params.id;
  const fVotes = votes.filter((node) => node.matchID === id);
  res.send(fVotes);
});

app.post("/matches/:id/votes", async (req, res) => {
  const vote = {
    id: randomBytes(4).toString("hex"),
    ...req.body,
  };

  votes = [...votes, vote];

  await axios.post('http://localhost:4005/event', {
    type: 'VOTE_CREATED',
    data:vote
  });

  res.send(votes);
});

app.post("/event", (req, res) => {
 console.log(`Message Received: ${req.body.type}`);
 console.log(`Data Received: ${JSON.stringify(req.body)}`);
 res.send({})
});


app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
