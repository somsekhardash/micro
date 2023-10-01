const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

const port = 4005;
app.get("/", (req, res) => {
  res.send("I am here");
});

app.post("/event", async (req, res) => {
  console.log("dashr", req.body.type);
  await axios({
    method: "post",
    url: "http://localhost:4000/event",
    data: { ...req.body },
  }).catch((err) => {
    console.log(err.message);
  });

  await axios({
    method: "post",
    url: "http://localhost:4001/event", 
    data: { ...req.body },
  }).catch((err) => {
    console.log(err.message);
  });

  await axios({
    method: "post",
    url: "http://localhost:4002/event",
    data: { ...req.body },
  }).catch((err) => {
    console.log(err.message);
    return err;
  });

  res.send({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
