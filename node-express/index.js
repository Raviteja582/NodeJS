const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const dishRouter =require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');


const hostname= 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));  /*  So, this is the development version. So, it will print out additional information to the screen as required. */
app.use(bodyParser.json());

/* It handles Dishes and DishID end point in REST API */
app.use('/dishes',dishRouter);

/* It handles Promotions and PromotionsID end point in REST API */
app.use('/promotions',promoRouter);

/*  It handles Leaders and LeadersID end point in REST API */
app.use('/leaders',leaderRouter);


app.use(express.static(__dirname+ '/public'))     /* I'm going to declare up use and express static. This tells Express to serve up the static files from double underscore dirname. So, this says the root of this project and they will find those files in double_dirname, plus/ public. */

app.use((req,res,next) =>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>')
});


const server = http.createServer(app);

server.listen(port,hostname, () =>{
    console.log(`server running at http://${hostname}:${port}`);
})