// receber mensagens do kafka
import { Kafka } from 'kafkajs';
import { Partitioners } from 'kafkajs';


const kafka = new Kafka({
  brokers: ['localhost:9092'],
  clientId: 'certificate',
})

const topic = 'issue-certificate'
const consumer = kafka.consumer({ groupId: 'certificate-group' })

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

async function run() {
  await consumer.connect()
  await consumer.subscribe({ topic })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)

      await producer.connect();
      const payload = JSON.parse(message.value);
      producer.send({
        topic: 'certification-response',
        messages: [
          { value: `Certificado do usuário ${payload.user} do curso ${payload.course} gerado, com duração de ${payload.duration}!` }
        ]
      });
    },
  })
}

run().catch(console.error)