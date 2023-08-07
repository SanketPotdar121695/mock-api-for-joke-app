require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/joke', async (req, res) => {
  const { topic } = req.query;
  const config = new Configuration({
    apiKey: OPENAI_API_KEY
  });

  const openai = new OpenAIApi(config);

  try {
    if (topic) {
      const response = await openai.createChatCompletion(
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Tell me a joke on '${topic}'. Return me the output in the following parsable json format:
    
              {"English": "English translation of the joke", "Hindi": "Hindi translation of the joke"}
    
              Also, please avoid the introductory message.`
            }
          ],
          max_tokens: 100,
          temperature: 0.4,
          n: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      const final_response = {
        joke: JSON.parse(response.data.choices[0].message.content.trim()),
        usage: response.data.usage
      };

      return res.status(200).send(final_response);
    }

    return res.status(400).send({ message: 'Please provide a topic name.' });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
