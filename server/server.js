const express = require('express')
const cors = require('cors')

const app = express()

// Middleware
app.use(express.json());
app.use(cors());

const port = 5000;

app.listen(port, () => console.log(`Server stated on port ${port}`));