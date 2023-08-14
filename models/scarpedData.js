const mongoose = require('mongoose')

const allDataSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    title:{
        type:String
    },
    price:{
        type:String
    },
    description:{
        type:String
    },
    mediaCount:{
        type:String
    },
    reviews:{
        type:String
    },
    ratings:{
        type:String
    },
});

module.exports= mongoose.model("Data",allDataSchema)