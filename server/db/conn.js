const mongoose = require('mongoose')


const DB = 'mongodb://127.0.0.1:27017/sriDB'
mongoose.connect(DB),{
    useNewUrlParser:true,useUnifiedTopology:true
},(err)=>{
    if(err){
        console.log('no connection')
    }
    else{
        console.log('Successfully Database connected')
    }
}