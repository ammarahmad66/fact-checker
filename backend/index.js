import express from 'express';
 import {  serpApi  } from './serpapi.js';
 import cors from 'cors';
 import dotenv from 'dotenv'

var corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"]
};

dotenv.config()

const app = express();
 app.use(cors(corsOptions))
const port = 4000;

app.get('/api/:query', async(req, res) => {
  await serpApi(req, res);
});

app.listen(port, async() => {
  console.log(`Example app listening at http://localhost:${port}`);
});