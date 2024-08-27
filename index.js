const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numberWindow = [];
app.use(express.json());
app.post('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;
    let url = '';
    switch (numberId) {
        case 'p':
            url = 'https://example.com/prime'; 
            break;
        case 'f':
            url = 'https://example.com/fibonacci';
            break;
        case 'e':
            url = 'https://example.com/even';
            break;
        case 'r':
            url = 'https://example.com/random';
            break;
        default:
            return res.status(400).json({ error: 'Invalid number ID' });
    }
    try {
        const startTime = Date.now();
        const response = await axios.get(url, { timeout: 500 });
        const newNumbers = response.data.numbers;
        newNumbers.forEach((num) => {
            if (!numberWindow.includes(num)) {
                if (numberWindow.length >= WINDOW_SIZE) {
                    numberWindow.shift();
                }
                numberWindow.push(num);
            }
        });
        const avg = numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length;
        res.status(200).json({
            windowPrevState: numberWindow.slice(0, -newNumbers.length),
            windowCurrState: numberWindow,
            numbers: newNumbers,
            avg: parseFloat(avg.toFixed(2))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch numbers' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});