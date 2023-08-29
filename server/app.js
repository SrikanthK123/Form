const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express();
const cookieParser = require('cookie-parser');

require('./db/conn')


const User = require('./model/userSchema');



app.use(express.json())
app.use(cookieParser());

// Linking Router
app.use(require('./router/auth'))



// Middleware

/* const middleware =(req,res,next)=>{
    console.log('this is middleware')
    next();
}

/*app.get('/',(req,res)=>{
    res.send('Hello this is HomePage app.js')
})*/

/*app.get('/about',middleware,(req,res)=>{
    res.send('Hello this is AboutPage ')
})*/

/*app.get('/contact',(req,res)=>{
    res.send('Hello this is ContactPage ')
})*/

app.get('/signin',(req,res)=>{
   // res.cookie('testing','testingvalue')
    res.send('Hello this is SigninPage ')
    
})

app.get('/signup',(req,res)=>{
    res.send('Hello this is SignupPage ')
})

app.listen(5000,()=>{
    console.log('server is running at port 5000')
})