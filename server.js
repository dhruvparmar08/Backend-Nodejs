var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var morgan = require("morgan");
const cors = require('cors')
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/api/api')(router);

const corsOptions = {
    origin: '*'
}

app.use(cors(corsOptions))
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.use('/api',appRoutes);
app.use('/upload',express.static('upload'));
app.use('/upload',express.static('/upload'));

mongoose.connect('mongodb+srv://mongodbuser:mongodbuser@cluster0-mvmyh.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true,  useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
var conn = mongoose.connection;

conn.on('connected', function(){
    console.log("Successfully connected !!!");
});
conn.on('disconnected', function(){
    console.log("Successfully disconnected !!!");
});
conn.on('error', console.error.bind(console, 'connection error:'));

app.listen(port, function(){
    console.log("connected "+port);
});