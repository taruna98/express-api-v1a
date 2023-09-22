const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const corsOptions = {
    origin: "*",
};

// register cors middleware
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const appRoute = require('./src/routes/route-profile');
app.use('/', appRoute);

let port = '8082';
app.listen(port, ()=>{
    console.log('Server Berjalan di Port : ' + port);
});
