const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.post('/api-ccb/word', (req, res) => {
    const { book, chapter } = req.body;
    const url = `https://www.abibliadigital.com.br/api/verses/nvi/${book}/${chapter}`;

    axios.get(url)
        .then(response => {
            // todo cult simulator, 3 hymns + 1 word + 1 prayer + 1 final hymn
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
            console.error('Request URL:', url); // Log the request URL for debugging
            res.status(500).json({ error: 'Internal server error' });
        });
});

const port = 3000;

app.listen(port, () => {
    console.log("Server is active on port", port);
});
