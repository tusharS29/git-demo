var express = require("express");
const http = require('http');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isBuffer } = require("util");
// const RegSchema = require("./models/RegSchema");
const Register = require("./models/RegSchema");
const addtocartSchema = require("./models/cartSchema");
mongoose.connect('mongodb://localhost:27017/sneakerreg');
var db = mongoose.connection;
db.on('error',()=>console.log("error in  connectivity"))
db.once('open',()=>console.log("connected success"))


const app =  express()
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))


app.post("/sign_up",async  (req,res)=>{
    try{
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        
        const registerUser = new Register({
            fullname:name,
            email:email,
            password:password
        })

        const registered = await registerUser.save();
        res.redirect('index.html');

    }catch (error){
        res.status(400).send(400);
    }
})


// login check
app.post("/login",async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});
        
        const isMatch = await bcrypt.compare(password,useremail.password);        
        if(isMatch){
            res.status(201).redirect("home.html");
        }else{
            res.redirect("index.html");
        }

    }catch (error){
        res.status(400).send("invalid login details")  
    }
})


// add to cart


// const jwt = require("jsonwebtoken");

// const createToken = async() => {git 
//     const token = await jwt.sign({_id:"61deb1756ebb1f75c9b8c548"},"hjdkjshjhskhkskhskjhkskksksjsasas")
//     console.log(token);

//     const userVer = await jwt.verify(token,"hjdkjshjhskhkskhskjhkskksksjsasas")
//     console.log(userVer);
// }



// createToken();


// server host
const server = http.createServer(app);
server.listen(3000, () =>
  console.log('Visit http://127.0.0.1:3000')
);


