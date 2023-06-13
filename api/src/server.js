import express from 'express';
import { Kafka } from 'kafkajs';

const app = express();

app.post('/certifications', (req, res) => {
  //chamar microservice

  return res.json({ ok: "certificate generated successfully" });
})

app.listen(3333, () => {
  console.log('Server is running on port 3333');
})