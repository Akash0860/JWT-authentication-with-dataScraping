
const {signup,signin,scrape} = require('./controllers/userController')
const express = require('express');
const app =express();
const mongoose = require('mongoose');
const auth = require('./middelwares/auth');

app.use(express.json())
app.post("/signup",signup)
app.post("/signin",signin)
app.post("/scrape",auth,scrape)

app.get("/",(req,res)=>{
    res.send("Hii");
})

mongoose.connect("mongodb+srv://Akash:12344321@api1.ha7itai.mongodb.net/?retryWrites=true&w=majority")
    .then(()=>{
        app.listen(5000,()=>{
            console.log("Server Started in port 5000");
        })
    })
    .catch((error)=>{
        console.log(error)
    })

