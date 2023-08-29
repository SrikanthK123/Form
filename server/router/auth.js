const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/authenticate')

require('../db/conn');
const User = require('../model/userSchema')

router.get('/',(req,res)=>{
    res.send('Hello this is HomePage router')
})
/* using promises
   *****  Register*****
router.post('/register',async (req,res)=>{

const {name,email,number,work,password,cpassword} = req.body
if(!name|| !email|| !number|| !work|| !password|| !cpassword){
    return res.status(422).json({error:'please fill the form'})
}
User.findOne({email:email}) 
.then((userExist)=>{
    if(userExist){
        return res.status(422).json({error:"Email already exists"})
    }
    const user = new User({name,email,number,work,password,cpassword})
    user.save().then(()=>{
        res.status(201).json({message:'user register successfully'})
    }).catch((err)=>res.status(500).json({error:'failed to registered'}))
}).catch(err=>{console.log(err)})
   
})*/

   //  Async-Await   // 

router.post('/register',async(req,res)=>{

    const {name,email,number,password,cpassword} = req.body
    if(!name|| !email|| !number||  !password|| !cpassword){
        return res.status(422).json({error:'please fill the form'})
    }
    try{
       const userExist = await User.findOne({email:email}) ;
      
       if(userExist){
        return res.status(422).json({error:"Email already exists"})
    }
    else if(password != cpassword){
        return res.status(422).json({error:'password are not matching'})
    }
    else{
        const user = new User({name,email,number,password,cpassword});
     const userRegister = await  user.save();
     res.status(201).json({message:'user register successfully'});
    }
    
    
     
    }
    catch(err){
        console.log(err)
    }
    
       
    })
      
   // *****  Login  *****

   router.post('/signin',async(req,res)=>{

  

    try{
        
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({error:'Fill the form'})
        }
        const userLogin = await User.findOne({email:email})
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password)
             const token = await userLogin.generateAuthToken()
            // console.log(token)
             res.cookie('jwtoken',token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
             })
             
        if(isMatch){
            res.json({message:'user signin Successfully'})
        }
        else{
            res.status(400).json({error:'Invalid Info pass'})
        }
        }else{
            res.status(400).json({error:'Invalid Info'})
        }
        
       

    }
    catch(err){
        console.log(err)
    }

   })

   // About us Page //

   router.get('/about',authenticate,(req,res)=>{
   // console.log('Hello this is AboutPage ')
    res.send(req.rootUser)
})

// Get UserData from Contact//
router.get('/getdata',authenticate,(req,res)=>{
    res.send(req.rootUser)
})

// Contact Page

router.post('/contact',authenticate,async(req,res)=>{
    try{
        const {name,email,message}=req.body
        if(!name || !email || !message){
            console.log("Error in contact form")
            return res.json({err:'Fill the Contact Fields'})
        }

        const userContact = await User.findOne({_id:req.userID})
        if(userContact){
            const userMessage = await userContact.addMessage(name,email,message)
            await userContact.save()
            res.status(201).json({message:"user  contact successfully"})
        }

    }catch(err){
        console.log(err)
    }
})
  
// Logout Page

router.get('/logout',(req,res)=>{
     console.log('Hello this is LogoutPage ')
     res.clearCookie('jwtoken',{path:'/'})
     res.status(200).send('User Successfully Logout')
 })



module.exports = router