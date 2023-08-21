const express = require('express');
const { link } = require('joi');

const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs');

let user = {
  id:"rtytuyyuuyu",
  email:"paras7394@gmail.com",
  password:"eretrtc;'rtygfgvc"
}


const JWT_SECRET = 'some super secrets...'

app.get('/',(req,res)=>{
  res.send('Hello world!')
})


app.get('/forgot-password',(req,res,next)=>{
  res.render('forgot-password');
  
})



app.post('/forgot-password',(req,res,next)=>{
  const {email} = req.body;
  // make sure user exist in database

  if(email!==user.email){
    res.send('User not registered')
    return;
  }

  // User exist and now create a one time link valid for 15mins
  const secret = JWT_SECRET + user.password
  const payload ={
    email : user.email,
    id: user.id
  }
  const token = jwt.sign(payload,secret,{expiresIn:'15m'})
  const link = `http://localhost:3000/reset-password/${user.id}/${token}`
  console.log(link)
  res.send('Password reset link has been sent to your email... ')
})



app.get('/reset-password/:id/:token',(req,res,next)=>{
  const {id,token} = req.params;
  

  // check if this id exist in database
  if (id!== user.id){
    res.send('Invalid id...')
    return;
  }
  // we have a valid id,and we have a valid user with this id
  const secret = JWT_SECRET + user.password
  try {
    const payload = jwt.verify(token,secret)
    res.render('reset-password',{email:user.email})
    
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});


app.post('/reset-password/:id/:token',(req,res,next)=>{
  const {id,token} = req.params;
  const {password,password2} = req.body;
   // check if this id exist in database
  if (id!== user.id){
    res.send('Invalid id...')
    return;
  }
  const secret = JWT_SECRET + user.password
  try {
    const payload = jwt.verify(token,secret)
    // validate password and password2 should match
    // we can simply find the user with the email and id and finally update with new password
    // Always hash the password before the saving
    user.password = password
    res.send(user)
    
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
  
})









app.listen(3000,()=>console.log(`https://localhost:${PORT}`))