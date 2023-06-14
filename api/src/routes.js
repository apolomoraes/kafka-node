import { Router } from 'express';
import { CompressionTypes } from 'kafkajs'
import { connectToDb, getDb } from './db';
const { ObjectId } = require("mongodb");

const routes = Router();
let db;

routes.post('/certifications', async (req, res) => {
  //chamar microservice
  const certificate = req.body
  
  db = getDb();
  const information = await db.collection('certifications').insertOne(certificate)

  const certificationInformation = await db.collection('certifications').findOne({ _id: new ObjectId(information.insertedId) })

  const message = JSON.stringify({
    user: certificationInformation.name,
    course: certificationInformation.course,
    duration: certificationInformation.duration
  })

  await req.producer.send({
    topic: 'issue-certificate',
    compression: CompressionTypes.GZIP,
    messages: [
      { value: message }
    ]
  });

  res.status(201).json()
});

export default routes;