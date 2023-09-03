const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieparser = require('cookie-parser');
 require('dotenv').config();

const Quiz =   require('./model/quiz');
const User =   require('./model/user');

const morgan = require('morgan');

const quizrouter = require('./routes/quizes');
const userrouter = require('./routes/users');
const user = require('./model/user');
const { config } = require('dotenv');

const app =  express();

app.use(express.json());
app.use(cookieparser());
app.use(express.static('build'));

// connecting with mongodb..........................

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://vidit:DnvW542y0z7OV6Bt@cluster0.y8iqm8c.mongodb.net/quizy?retryWrites=true&w=majority');
  console.log("Database Connected");
}


app.use(cors())
app.use(morgan('tiny'));

const auth = (req,res,next) => {
 try {
  const {token} = req.cookies;
  if(token){
   const user = jwt.verify(token,process.env.SECRETKEY);
   req.userID = user.id;
   req.mail = user.email;
   
  next();
  }

  else{
    res.status(201).json({message: "Kindly login first, to continue!"});
  }

  
 } catch (error) {
  console.log(error);
  res.send("something went wrong on authorizing user");
 }
  
}

// rest apis for quiz...........................

app.post('/api/quiz',auth, async (req,res)=>{
  try {
    const quizData = req.body; // Assuming the request body contains quiz data
    const newQuiz = await Quiz.create(quizData);
    res.status(201).json(newQuiz);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the quiz.' });
  }   

})

app.get('/api/quiz/',auth, async (req,res)=>{

  const code = req.params.code;

  try {
    const allData = await Quiz.find(); // Retrieve all documents from the collection
    res.json(allData);
   
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 

})

app.get('/api/quiz/:code',auth, async (req,res)=>{

  const code = req.params.code;

  try {
    const allData = await Quiz.findOne({joincode: code}); // Retrieve all documents from the collection
    res.json(allData);
    console.log(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 

})

app.patch('/api/quiz/:code', auth, async (req,res) =>{

  const code = req.params.code;

  try {
    const doc = await Quiz.findOneAndUpdate({joincode: code}, req.body,{new: true})
    res.status(201).json(doc);
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
})

app.put('/api/quiz/:code', auth, async (req,res) =>{

  const code = req.params.code;

  try {
    const doc = await Quiz.findOneAndReplace({joincode: code}, req.body,{new: true})
    res.status(201).json(doc);
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }

})

app.delete('/api/quiz/:code',auth,  async (req,res) =>{

  const code = req.params.code;

  try {
    const doc = await Quiz.findOneAndDelete({joincode: code})
    res.status(201).json(doc);
   
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }

})


//user rest apis...........................................

//api for registration

app.post('/api/user/register', async (req,res)=>{
  try {
    const {email , username , password} = req.body;
    const existuser = await User.findOne({email});

   if(!(email && username && password)){
    res.status(200).json({message:"All the fields are required!"});

   }

   
   else if(existuser){
     res.status(200).json({message:"User already exists!"});
   }

   else{

     
     const encrypt = await bcrypt.hash(password,10);

     const token = jwt.sign(
      {id: User._id, email},
      process.env.SECRETKEY,
      {
        expiresIn: "3h"
      }
      )
      
     
     
    const user = await User.create({
       email,
       username,
       password: encrypt,
       
      })
      
    
       
        user.password = undefined;
        user.token = token;
        res.status(201).json({user: user, message: "Account created successfuly!, Login to continue."});
        
      }



  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }   

})


//api for login

app.post('/api/user/login', async (req,res) => {
  try {

    const {email , password} = req.body;
    const user = await User.findOne({email});
    console.log(user);

    if(!(email && password)){
      res.status(200).json({message:"All the fields are required!"});
  
     }

     else if (!user){
      res.status(200).json({message:"User not found !"});
     }

     else{
      if(user && (await bcrypt.compare(password, user.password))){

        const token = jwt.sign(
          {id: user._id, email},
          process.env.SECRETKEY,
          {
            expiresIn: "3h"
          }
          )

          user.token = token;
          user.password = undefined;

          const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true
          }

          res.status(200).cookie("token" , token, options).json({
            success: true,
            token,
            user,
            message: "Logged In Successfully !"
          })
      }

      else{
        res.json({message: "Invalid email or password !"});
      }



     }


  


    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging the user.' });
  }
})

app.get('/api/user/', auth, async (req,res)=>{

  

  try {
    const allData = await User.find(); // Retrieve all documents from the collection
    res.json(allData);
    console.log(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 

})

app.get('/api/user/:mail',auth, async (req,res)=>{

  const email = req.mail;


  try {
    const allData = await User.findOne({email: email}); // Retrieve all documents from the collection
    res.json(allData);
    console.log(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
 

})

app.patch('/api/user/pass/:mail',auth, async (req,res) =>{

  const code = req.mail;
  const { password } = req.body;

  const encrypt = await bcrypt.hash(password,10);
  
  // await bcrypt.compare(password, user.password)

  try {
    
    const doc = await User.findOneAndUpdate({email: code}, {password: encrypt},{new: true})
    res.status(201).json({doc,message: "Password changed successfully !"});
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
})

app.patch('/api/user/email/:mail', auth, async (req,res) =>{

  const code = req.mail;
 
  try {
    
    const doc = await User.findOneAndUpdate({email: code},req.body,{new: true})
    res.status(201).json({doc,message: "Email updated successfully !"});
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
})

app.patch('/api/user/username/:mail', auth, async (req,res) =>{

  const code = req.mail;
 
  try {
    
    const doc = await User.findOneAndUpdate({email: code},req.body,{new: true})
    res.status(201).json({doc,message: "Username updated successfully !"});
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
})

app.post('/api/user/marks/:mail', auth, async (req,res) =>{

  const code = req.mail;
 
  try {
    
    const user = await User.findOneAndUpdate({email: code},{ $push: { qgiven: req.body },},{new: true});
    res.json({user, message:"marks uploaded!"})
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
})

app.post('/api/user/buildq/:mail', auth, async (req,res) =>{

  const code = req.mail;
 
  try {
    
    const user = await User.findOneAndUpdate({email: code},{ $push: { qbuild: req.body },},{new: true});
    res.json({user, message:"quiz uploaded!"})
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
})

app.post('/api/user/logout',auth, async (req, res)=>{
    try {

      res.clearCookie("token");
      res.json({ message: 'Logged out successfully !' });
      
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
})

app.delete('/api/user/:mail',auth, async (req,res) =>{

  const code = req.mail;

  try {
    const doc = await User.findOneAndDelete({email: code})
    res.status(201).json({doc, message: "Account deleted Successfully !"});
   
    
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }

})

app.use('/api/quiz',quizrouter.router);
app.use('/api/user',userrouter.router);




app.listen(8080 ,()=>{
    console.log("server started")
})