const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

SECRET_KEY= 'srikanthismynamesrikanthismyname'


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
   
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    message:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            message:{
                type:String,
                required:true
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})





// we are hashing the password

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
        this.cpassword = await bcrypt.hash(this.cpassword,12)
    }
    next( )

})
// Generating Token

userSchema.methods.generateAuthToken = async function(){
    try{
        let token =jwt.sign({ _id : this._id},SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token 
    }
    catch(err){
        console.log(err);
    }
}

// Store the Message

userSchema.methods.addMessage = async function(name,email,message){
    try{
        this.message = this.message.concat({name,email,message})
        await this.save()
        return this.message
    }catch(err){
        console.log(err)
    }
}

const User = mongoose.model('USER',userSchema)

module.exports = User