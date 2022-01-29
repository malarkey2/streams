// Importing modules 
const express = require('express'); 
const router = express.Router(); 

// Importing User Schema 
const User = require('../model/user'); 

// User login api 
router.post('/login', (req, res) => { 

    // Find user with requested email 
    User.findOne({ email : req.body.email }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                message : "User not found."
            }); 
        } 
        else { 
            if (user.validPassword(req.body.password)) { 
                
                return res.status(201).send({ 
                    token: user.firstName,
                }) 
            } 
            else { 
                return res.status(400).send({ 
                    message : "Wrong Password"
                }); 
            } 
        } 
    }); 
}); 

router.post('/fetch-security-question', (req, res)=>{
    
    User.findOne({email:req.body.email}, function (err, user){
        if (!user){
            res.status(400).send({
                message : "User not found."
            })
        }
        else{
            
            return res.status(201).send({ 
                securityQuestion: user.securityQuestion,
            }) 
        }
    })
    
})

router.post('/login/security-question', (req, res)=>{

    const securityAns = req.body.securityAnswer;
    
    //find user with email again 
    User.findOne({email:req.body.email}, function (err, user){
        if (!user){
            res.status(400).send({
                message : "User not found."
            })
        }
        else{
             
            if (securityAns === user.securityAnswer){
                return res.status(201).send({ 
                    token: user.firstName,
                }) 
            }
            else{
                return res.status(400).send({ 
                    message : "Wrong Password"
                }); 

              }
        }
    })
})

// User signup api 
router.post('/signup', (req, res, next) => { 


// Creating empty user object 
    let newUser = new User(); 

    // Initialize newUser object with request data 
   
    newUser.name = req.body.name,

    newUser.email = req.body.email,
    newUser.organization=req.body.organization;

                    // Call setPassword function to hash password 
                    newUser.setPassword(req.body.password); 

    // Save newUser object to database 
    newUser.save((err, User) => { 
        if (err) { 
            return res.status(400).send({ 
                message : "Failed to add user."
            }); 
        } 
        else { 
            return res.status(201).send({ 
                message : "user-added"
            }); 
        } 
    }); 
}); 
// Export module to allow it to be imported in other files 
module.exports = router; 