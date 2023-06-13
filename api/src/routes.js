import { Router } from 'express';

const routes = Router();

routes.post('/certifications', async (req, res) => {
  //chamar microservice
  const message = JSON.stringify({
    user: { id: 1, name: "João" },
    course: 'kafka with NodeJS',
    duration: '1 year',
    grade: 5
})

  await req.producer.send({
    topic: 'issue-certificate',
    messages: [
      { value: message }
    ]
  });

  return res.json({ ok: "certificate generated successfully" });
});

export default routes;