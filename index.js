

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {
    const { firstName, lastName, email, age } = req.body;

    if (!firstName || !lastName || !email || !age) {
        return res.status(400).json({ error: 'Invalid form data' });
    }

    const data = JSON.stringify(req.body) + '\n';

    let fileName;
    if (parseInt(age, 10) > 18) {
        fileName = 'greater18.txt';
    } else {
        fileName = 'less18.txt';
    }

    fs.appendFile(fileName, data, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json(req.body);
    });
});

app.get('/data/:ageGroup', (req, res) => {
    const { ageGroup } = req.params;
    let fileName;

    if (ageGroup === '18+') {
        fileName = 'greater18.txt';
    } else if (ageGroup === '18-') {
        fileName = 'less18.txt';
    } else {
        return res.status(400).json({ error: 'Invalid age group parameter' });
    }

    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }

        const dataArray = data.trim().split('\n').map((line) => JSON.parse(line));

        const tableRows = dataArray.map(data => `
            <tr>
                <td>${data.firstName}</td>
                <td>${data.lastName}</td>
                <td>${data.email}</td>
                <td>${data.age}</td>
            </tr>
        `).join('');

        const htmlTable = `
            <html>
            <head>
            <title>Data Table</title>
            </head>
            <body>

            <h1>Data Table</h1>
            <table border="1">
            <thead>
                <tr>
                <th>First Name</th>
                 <th>Last Name</th>
                 <th>Email</th>
                 <th>Age</th>

                 </tr>
                    </thead>
                    <tbody> ${tableRows} </tbody>
                </table>
            <a href="/">Back to form</a>
            </body>
            </html>
        `;

        res.send(htmlTable);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
