const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    console.log("LED")
});

app.listen(port, () => {

});