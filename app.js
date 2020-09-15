//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("database connection successfull!");
    }
});

const userSchema = new mongoose.Schema ({

    email: String,
    password: String
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);




const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.listen(3000, function() {
    console.log("server started listening on 3000!");

});


app.get("/", (req, res) => {

    res.render("home", {});
});

app.get("/login", (req, res) => {

    res.render("login", {});
});

app.get("/register", (req, res) => {

    res.render("register", {});

});

app.post("/register", (req, res) => {
    var email = req.body.username;
    var password = req.body.password;

   
    const user1 = new User ({
        email: email,
        password: password

    });

    user1.save(function(err) {
        if(!err)
        {
            res.render("secrets", {});
        }
    });

});

app.post("/login", (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({email: username}, function(err, foundUser) {

        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundUser)
            {
                if(foundUser.password === password)
                {
                    console.log(password);
                    res.render("secrets", {});
                }

            }
        }
    });
    
});





