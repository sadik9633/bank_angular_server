// imort dataservice file

const dataservice=require('./service/dataservice')

//import cors
const cors=require("cors")

//import json web token
const jwt=require('jsonwebtoken')

// import express
//---------------

const express=require("express")


// create app using express
//-------------------------

const app=express()

//connection string to frontend integration
app.use(cors({origin:'http://localhost:4200'}))

//to parse json data from requst body
app.use(express.json())

//middlewaer 
const jwtMiddleware=(req,res,next)=>{
  try { const token=req.headers['access_token']
    //verify token
    const data=jwt.verify(token,"superkey123")
    console.log(".....middleware....");
    console.log(data);
   
    next()
}
catch{
res.status(422).json({
    statusCode:422,
    status:false,
    message:'please login first'
})
}
}

//register - post
app.post('/register',(req,res)=>{

   dataservice.register(req.body.uname,req.body.acno,req.body.psw).then(result=>{
    res.status(result.statusCode).json(result)
   })
   //convert object to json and send as response
    //console.log(req.body);
    //res.send("success")
})
//login
app.post('/login',(req,res)=>{

    dataservice.login(req.body.acno,req.body.psw).then(result=>{
        //convert object to json and send
    res.status(result.statusCode).json(result) 
    })
})
//deposit
app.post('/deposit',jwtMiddleware,(req,res)=>{

    dataservice.deposit(req.body.acnum,req.body.password,req.body.amount).then(result=>{
           //convert object to json and send
    res.status(result.statusCode).json(result) 
    })
})
//withdraw
app.post('/withdraw',jwtMiddleware,(req,res)=>{

    dataservice.withdraw(req.body.acnum,req.body.password,req.body.amount).then(result=>{
//convert object to json and send
res.status(result.statusCode).json(result)
    
    })
    
 })
//getTransaction
app.post('/transaction',jwtMiddleware,(req,res)=>{

    dataservice.getTransaction(req.body.acno).then(result=>{
//convert object to json and send
res.status(result.statusCode).json(result)
    })
})
//delete
app.delete('/delete/:acno',jwtMiddleware,(req,res)=>{
   dataservice.deleteAc(req.params.acno).then(result=>{
    res.status(result.statusCode).json(result)
   }) 
})


//request
//---------
//app.get('/',(req,res)=>{res.send('get method.....123')})

// app.post('/',(req,res)=>{res.send('post method.....123')})

//app.put('/',(req,res)=>{res.send('put method.....123')})

//app.patch('/',(req,res)=>{res.send('patch method.....123')})

//app.delete('/',(req,res)=>{res.send('delete method.....123')})

// create port - to create running the app
//------------------------------------------

app.listen(3000,()=>{console.log("server started at port number 3000");})

