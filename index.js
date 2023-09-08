const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api-ccb/word', async (req, res) => {
    const { book, chapter } = req.body;
    const url = `https://www.abibliadigital.com.br/api/verses/acf/${book}/${chapter}`;
    let responseStatus = 500; 

    while (responseStatus === 500) {
        try {
            const response = await axios.get(url);
            responseStatus = response.status; 

            if (responseStatus === 200) {
                const hymn1 = getHymn(1, 480);
                const hymn2 = getHymn(1, 480);
                const hymn3 = getHymn(1, 480);
                const finalHymn = getHymn(1, 480);

                const word = getWord(response.data, hymn1, hymn2, hymn3, finalHymn);

                return res.status(200).json(word); 
            }
        } catch (error) {
            console.error('Error:', error);
            console.error('Request URL:', url);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(500).json({ error: 'Internal server error' }); 
});

function getHymn(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getWord(data, hymn1, hymn2, hymn3, finalHymn) {
    const bookInfo = data.book;
    const chapterInfo = data.chapter;
    const verses = data.verses;

    let word = ''; 

    for (const verse of verses) {
        word += verse.text + ' ';
    }

    word = {
        "primeiro hino": hymn1,
        "segundo hino": hymn2,
        "terceiro hino": hymn3,
        "oracao": getOurFather(),
        palavra: {
            livro: bookInfo.name,
            capitulo: chapterInfo.number,
            versos: word.trim(),
        },   
        "hino de encerramento": finalHymn
    };

    return word;
}

function getOurFather() {
    return `Pai nosso, que estás nos céus, santificado seja o teu nome. Venha o teu reino, seja feita a tua vontade, assim na terra como no céu. O pão nosso de cada dia nos dá hoje. E perdoa-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores. E não nos conduzas à tentação; mas livra-nos do mal; porque teu é o reino, e o poder, e a glória, para sempre. Amém.`;
}

const port = 5500;

app.listen(port, () => {
    console.log("Server is active on port", port);
});
