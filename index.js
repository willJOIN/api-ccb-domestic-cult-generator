const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.post('/api-ccb/word', (req, res) => {
    const { book, chapter } = req.body;
    const url = `https://www.abibliadigital.com.br/api/verses/acf/${book}/${chapter}`;

    axios.get(url)
        .then(response => {
            const hymn1 = getHymn(1, 480)
            const hymn2 = getHymn(1, 480)
            const hymn3 = getHymn(1, 480)
            const finalHymn = getHymn(1, 480)

            const word = getWord(response.data, hymn1, hymn2, hymn3, finalHymn)

            res.status(200).json(word);
        })
        .catch(error => {
            console.error('Error:', error);
            console.error('Request URL:', url); 
            res.status(500).json({ error: 'Internal server error' });
        });
});

function getHymn(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getWord(data, hymn1, hymn2, hymn3, finalHymn) {
    const bookInfo = data.book;
    const chapterInfo = data.chapter;
    const verses = data.verses;

    let word = ''; // Inicialize 'word' como uma string vazia

    for (const verse of verses) {
        word += verse.text + ' ';
    }

    word = {
        palavra: {
            "primeiro hino": hymn1,
            "segundo hino": hymn2,
            "terceiro hino": hymn3,
            livro: bookInfo.name,
            capitulo: chapterInfo.number,
            versos: word.trim(),
            "oracao": getOurFather(),
            "hino de encerramento": finalHymn
        }
    };

    return word;
}


function getOurFather() {
    return `Pai nosso, que estás nos céus, santificado seja o teu nome. Venha o teu reino, seja feita a tua vontade, assim na terra como no céu. O pão nosso de cada dia nos dá hoje. E perdoa-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores. E não nos conduzas à tentação; mas livra-nos do mal; porque teu é o reino, e o poder, e a glória, para sempre. Amém.`;
}

const port = 3333;

app.listen(port, () => {
    console.log("Server is active on port", port);
});
