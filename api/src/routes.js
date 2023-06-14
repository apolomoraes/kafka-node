import { Router } from 'express';
import { CompressionTypes } from 'kafkajs'

const routes = Router();

routes.post('/certifications', async (req, res) => {
  //chamar microservice
  // const { name, course, duration } = req.body

  const message = JSON.stringify({
    user: { id: 1, name: "Apolo" },
    course: 'kafka with NodeJS',
    duration: '1 year',
    grade: 5
  })

  await req.producer.send({
    topic: 'issue-certificate',
    compression: CompressionTypes.GZIP,
    messages: [
      { value: message }
    ]
  });

  return res.json({ ok: "certificate generated successfully" });
});

export default routes;