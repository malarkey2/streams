const express = require("express")

const path = require('path')

const cors = require("cors")

const mongoose = require("mongoose")

require('dotenv').config()

const app = express()



//MIDDLEWARE

const whitelist = ["http://localhost:3000"]

const corsOptions = {

  origin: function (origin, callback) {

    if (!origin || whitelist.indexOf(origin) !== -1) {

      callback(null, true)

    } else {

      callback(new Error("Not allowed by CORS"))

    }

  },

  credentials: true,

}

app.use(cors())

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../stream-task-charting/build')))




const DB = 'mongodb+srv://admin-harsh:' + process.env.DB_PASS + '@cluster0.8y5it.mongodb.net/test-uploads?retryWrites=true&w=majority';

mongoose.connect('mongodb+srv://admin-harsh:7hoPUeNHT2b42upX@cluster0.8y5it.mongodb.net/Stream-Org?retryWrites=true&w=majority');


const organizationSchema = new mongoose.Schema({
  orgName: String,
  orgWeb: String, 
  orgDesc: String,
  
  leaders: [
    {
      name: String, 
      email: String, 
      position: String, 
      desc: String
    }
  ],

  teams: [{
    name: String, 
    desc: String, 
    color: String, 
    points: Number
  }],

  streams:[{
    name: String,
    firstNode:String, 
    structure: [Array], 
    descFull: String, 
    purpFull: String, 
    substream:[{
      desc: String, 
      
      leaderEmail: String,
      involvedEmail: Array,
      fromNode:String, 
      toNode:String
    }]
   
    
  }],

 

  members: [{
        name: String, 
        email: String, 
        team: String, 
        desc: String, 
        mainContribute: Boolean,

        tasks:[ {
          name: String,
          desc: String, 
          due: String, 
          admin:String,
          stream:String,
          completed: Boolean
        }],

        projects:[ {
          name: String,
          desc: String, 
          due: String
        }]
    
  }]


})

// Creating a Model from that Schema
const Organization = mongoose.model("Organization", organizationSchema);


//Handing DB Object Creation on request from server

  app.use("/new-org", function(req, res){

    console.log(req.body)
    
    const newOrg = new Organization({
    orgName: req.body.orgName,
    orgWeb: req.body.orgWeb, 
    orgDesc: req.body.orgDesc,

    leaders: req.body.orgLeaders

    
    });
    newOrg.save();

    res.send({
      status: 'submission-saved'
    })
    
  })

  app.use("/check-org", function(req, res){

    const orgExists = req.body.orgName;

        Organization.find({orgName:orgExists}, function(err, foundUser) {
                if (err) {
                  console.log(err);
                  console.log("Org doesn't exist or some error");
                  
                } 

                if (foundUser[0]){
                  res.send({
                    status:'found'
                  })
                } 
                else {
                  res.send({
                    status:'negative'
                })

             }
        }) 
  })

  app.use("/fetch-org-data", function(req, res){

    const orgExists = req.body.orgName;

        Organization.find({orgName:orgExists}, function(err, foundUser) {
                if (err) {
                  console.log(err);
                  console.log("Org doesn't exist or some error");
                  
                } 

                if (foundUser[0]){
                  res.send(
                    foundUser[0]
                  )
                } 
                else {
                  res.send({
                    status:'negative'
                })

             }
        }) 
  })

  // app.use("/fetch-member-data", function(req, res){

  //   const orgName = req.body.orgName;
  //   const userid = req.body.userid

  //       Organization.find({orgName: orgName}, 
  //       ]}, function(err, foundUser) {
  //               if (err) {
  //                 console.log(err);
  //                 console.log("Org doesn't exist or some error");
                  
  //               } 

  //               if (foundUser[0]){
  //                 console.log(foundUser[0])
  //                 res.send(
  //                   foundUser[0]
  //                 )
  //               } 
  //               else {
  //                 res.send({
  //                   status:'negative'
  //               })

  //            }
  //       }) 
  // })

  //UPDATING ORG DATA 
  
  app.use("/add-leader", function(req, res){

    const leaderAdd = req.body.leaderAdd;
    const orgName = req.body.orgName;

  



    Organization.findOneAndUpdate({orgName:orgName}, 
      {'$push': { "leaders": leaderAdd }}, { safe: true }, function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('fail');
      }
      else{
        res.send('success');
      }
    }).catch(function(err){ console.log(err)})
  
  })



  app.use("/delete-leader", function(req, res){

    const leaderDelete = req.body.leaderDelete;
    const orgName = req.body.orgName;
    Organization.findOneAndUpdate({orgName:orgName}, 
      {'$pull': { "leaders": { "email": leaderDelete } }}, { safe: true }, function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('fail');
      }
      else{
        res.send('success');
      }
    }).catch(function(err){ console.log(err)})
  })



  app.use("/add-team", function(req, res){

    const teamAdd = req.body.teamAdd;
    const orgName = req.body.orgName;


    Organization.findOneAndUpdate({orgName:orgName}, 
      {'$push': { "teams": teamAdd }}, { safe: true }, function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('fail');
      }
      else{
        res.send('success');
      }
    }).catch(function(err){ console.log(err)})
  
  })

  app.use("/delete-team", function(req, res){

    const teamDelete = req.body.teamDelete;
    const orgName = req.body.orgName;

    Organization.findOneAndUpdate({orgName:orgName}, 
     {'$pull': { "teams": { "name": teamDelete } }}, { safe: true, multi:true }, function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('fail');
      }
      else{
        res.send('success');
      }
    }).clone().catch(function(err){ console.log(err)})
  })

  app.use("/add-member", function(req, res){

    const memberAdd = req.body.memberAdd;
    const orgName = req.body.orgName;


    Organization.findOneAndUpdate({orgName:orgName}, 
      {'$push': { "members": memberAdd }}, { safe: true }, function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('fail');
      }
      else{
        res.send('success');
      }
    }).catch(function(err){ console.log(err)})
  
  })

  app.use("/delete-member", function(req, res){

    const memberDelete = req.body.memberDelete;
    const orgName = req.body.orgName;

    Organization.findOneAndUpdate({orgName:orgName}, 
     {'$pull': { "members": { "email": memberDelete } }}, { safe: true, multi:true }, function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('fail');
      }
      else{
        res.send('success');
      }
    }).clone().catch(function(err){ console.log(err)})
  })


 //FOR STREAMS AND SUBSTREAMS
 app.use("/add-stream", function(req, res){

  const streamAdd = req.body.streamAdd;
  //task to be added
  const orgName = req.body.orgName;
  //queries to search for the right obj


  Organization.findOneAndUpdate({orgName:orgName}, 
    {'$push': { "streams": streamAdd }}, { safe: true }, function(err, data){
    if(err){
      console.log(err);
      res.status(500).send('fail');
    }
    else{
      res.send('success');
    }
  }).catch(function(err){ console.log(err)})

})

app.use("/delete-stream", function(req, res){

  const streamDelete = req.body.streamDelete;
  const orgName = req.body.orgName;
  Organization.findOneAndUpdate({orgName:orgName}, 
    {'$pull': { "streams": { "name": streamDelete } }}, { safe: true }, function(err, data){
    if(err){
      console.log(err);
      res.status(500).send('fail');
    }
    else{
      res.send('success');
    }
  }).catch(function(err){ console.log(err)})
})




app.use("/add-substream", function(req, res){

  const subStreamAdd = req.body.subStreamAdd;
  //task to be added
  const orgName = req.body.orgName;
  const streamName = req.body.streamName;
  const streamStructure = req.body.streamStructure;
  //queries to search for the right obj

  console.log(streamName)
  Organization.findOneAndUpdate({orgName:orgName},{ $push: { "streams.$[e1].substream": subStreamAdd } },
  {
    arrayFilters: [
      { "e1.name": streamName },
      
    ]}, function(err, data){
    if(err){
      console.log(err);
      res.status(500).send('fail');
    }
    else{
      
    }
  }).catch(function(err){console.log(err)})

  Organization.findOneAndUpdate({orgName:orgName}, 
  { $push: { "streams.$[e1].structure": streamStructure } },
    {
      arrayFilters: [
        { "e1.name": streamName },
    ]},  function(err, data){
    if(err){
      console.log(err);
      res.status(500).send('fail');
    }
    else{
      res.send('success');
    }
  }).catch(function(err){console.log(err)})



})




  // FOR TASKS
  app.use("/add-task", function(req, res){

    const taskAdd = req.body.taskAdd;
    //task to be added
    const orgName = req.body.orgName;
    const memberEmail = req.body.memberEmail;
    //queries to search for the right obj

    

    Organization.findOneAndUpdate({orgName:orgName}, 
      { $push: { "members.$[e1].tasks": taskAdd } },
      {
        arrayFilters: [
          { "e1.email": memberEmail },
          
        ],
      }, function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('fail');
      }
      else{
        res.send('success');
      }
    }).catch(function(err){ console.log(err)})
  
  })


  // const Submission = mongoose.model("Submission", submissionSchema);


//Handing DB Object Creation on request from server

  // app.use("/submission", function(req, res){
    
  //   const newSubmission = new Submission(req.body);
  //   newSubmission.save();

  //   res.send({
  //     status: 'submission-saved'
  //   })
    
  // })



//handling auth - signing up users, signing them in, etc


const user = require('./route/user');
  
// Use user route when url matches /api/user/
app.use('/api/user', user);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../stream-task-charting/build', 'index.html'));
  // res.send("Welcome to InYPT Dev!")
  
});



//Start the server in port 8081

const PORT = process.env.PORT || 3002;

app.listen(PORT, function () {
  console.log(`App started at http://localhost:${PORT}`)

})