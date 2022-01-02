const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const db = require('./models/index');
require('dotenv').config();   //to read the .env file
// require('dotenv').config({path: __dirname + '/.env'});
const userRouter = require('./routes/router');
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, './server.bundle.js')));
app.use(express.static(path.join(__dirname, './paper')));
app.use(express.static(path.join(__dirname, './answer')));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// const server = require('http').createServer(app);

app.use('/api/user', userRouter)

if ( process.env.NODE_ENV == "production"){ 
  app.use(express.static("client/build")); 
  const path = require("path"); 
  app.get("*", (req, res) => { 
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
 }
)};

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});