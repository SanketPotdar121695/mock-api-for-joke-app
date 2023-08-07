require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_ENDPOINT = process.env.OPENAI_API_ENDPOINT; // API Endpoint

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send('<h1>Hello World !!!</h1>');
});

app.get('/quote', async (req, res) => {
  const { topic } = req.query;

  try {
    if (topic) {
      const response = await axios.post(
        OPENAI_API_ENDPOINT,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Tell me a quote on '${topic}' by some great philosophers. Return me the output in the following parsable json format:
    
              { "English": "English translation of the quote", "Hindi": "Hindi translation of the quote", "Author": "author of the quote" }
    
              Also, please avoid the introductory message.`
            }
          ],
          max_tokens: 250,
          temperature: 1,
          n: 1
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
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
