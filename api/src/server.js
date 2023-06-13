import express from 'express';
import { Kafka } from 'kafkajs';
import routes from './routes'
import { Partitioners } from 'kafkajs';

const app = express();

// faz conexão com o kafka
const kafka = new Kafka({
  clientId: 'api',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

//disponibiliza o producer para todas as rotas
app.use((req, res, next) => {
  req.producer = producer;

  return next();
});


// cadastra as rotas
app.use(routes);
async function run() {
  await producer.connect()

  app.listen(3333, () => {
    console.log('Server is running on port 3333');
  });
};

run().catch(console.error);