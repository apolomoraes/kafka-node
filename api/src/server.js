import express from 'express';
import { Kafka, logLevel } from 'kafkajs';
import routes from './routes'
import { Partitioners } from 'kafkajs';
const { connectToDb, getDb } = require("./db");

const app = express();
app.use(express.json());

// faz conexão com o kafka
const kafka = new Kafka({
  clientId: 'api',
  brokers: ['localhost:9092'],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
const consumer = kafka.consumer({ groupId: 'certificate-group-receiver' });

//disponibiliza o producer para todas as rotas
app.use((req, res, next) => {
  req.producer = producer;

  return next();
});

// cadastra as rotas
app.use(routes);


let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("App listening on port 3000");
    })
    db = getDb();
  }
})

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: 'certification-response' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(String(message.value))
    }
  });
}

run().catch(console.error);