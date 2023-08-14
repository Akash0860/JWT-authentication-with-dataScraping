const userModel = require("../models/user");
const jwt = require('jsonwebtoken')
const SECRET_KEY="RG4ERG" 
const axios = require('axios');
const cheerio = require('cheerio');
const scrapeDataModel = require("../models/scarpedData")

const signup = async(req,res)=>{
    const {email,password}=req.body;
 
    try {
        
        const existingUser =await userModel.findOne({email:email})
    
        if(existingUser){
           
            return res.status(400).json({message:"User already exists"})
        }

        const result = await userModel.create({
            email:email,
            password:password
        })
       
        const token = jwt.sign({email: result.email, id: result._id}, SECRET_KEY);
        res.status(201).json({user: result, token: token});


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong"});
    } 
}
const signin =async (req,res)=>{
    const {email,password}=req.body;
    try {
        
        const existingUser =await userModel.findOne({email:email})
        if(!existingUser){
            return res.status(404).json({message:"User not found"})
        }


        if(existingUser.password !== password){
            return res.status(400).json({message:"Invalid Credentials"});
        }


        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, SECRET_KEY);
        res.status(201).json({user: existingUser, token: token});


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong"});
    }
}

const scrape = async (req, res) => {
    try {
      if (req.user) {
        const email = req.user.email
        const password = req.user.password
        const { url } = req.body;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const title = $('meta[property="og:title"]').attr('content');
        const price = $('div._30jeq3._16Jk6d').text();
        const description = $('div._1mXcCf.RmoJUa').text();
        const mediaCount = $('div._3GAsG7').length;
        const reviews = $('span._2_R_DZ').text();
        const ratings = $('div._3LWZlK').first().text().trim();
        await scrapeDataModel.create({
            email:email,
            password:password,
            title:title,
            price:price,
            description:description,
            mediaCount:mediaCount,
            reviews:reviews,
            ratings:ratings
        })
        res.json({email,password, title, price, description, reviews, ratings, mediaCount });
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while scraping and saving data.' });
    }
  };
  


module.exports={signup,signin,scrape}