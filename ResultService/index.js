const express = require("express");
const app = express();
const cors = require("cors");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

const port = 4002;

let results = [];

app.get("/results", (req, res) => {
  res.send(results);
});

app.get("/results/:id", (req, res) => {
  const id = req.params.id;
  const results = results.filter((node) => node.id === id);
  res.send(results[0]);
});

app.post("/results", (req, res) => {
  const result = {
    id: randomBytes(4).toString("hex"),
    ...req.body,
  };
  results = [...results, result];
  res.send(results);
});

app.post("/event", (req, res) => {
  console.log(`Message Received: ${req.body.type}`);
  const {type, data} = req.body;
  if(type == 'MATCH_CREATED') {
    results.push(...req.body.data);
  } else if(type === 'VOTE_CREATED'){
    const match = results.find(node => node.id == data.matchID);
    if(!match) return res.send({message: 'Error'});
    if(!match['vote']) {
      match['vote'] = [];
      match['vote'].push(req.body.data) 
    } else {
      match['vote'].push(req.body.data) 
    }
  }

  console.log(results);
  res.send({});
});



app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
