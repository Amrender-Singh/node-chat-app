const express = require('express');
const path = require('path');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT;
var app = express();
//middleware for geting all the static files
app.use(express.static(publicPath));
app.listen(3000, ()=>{
    console.log(`Server is up at ${port}`);
});