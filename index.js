const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = express.Router();
var appRoutes = require("./route")(router);
const cors = require('cors')
var jwt = require('jsonwebtoken');


const DB ="mongodb+srv://krunalrudra:krunal0997@cluster0.c9t3e.mongodb.net/Rudra?retryWrites=true&w=majority";
mongoose.connect(DB)
// mongoose.connect('mongodb://localhost:27017/Sunil')

const conn = mongoose.connection
console.log('connection Succesfully');

const app = express('');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use('/',appRoutes);


// app.use('/uploads',express.static('uploads'));

app.listen(7037,function(req,res){
    console.log('port is running')
})