var express = require("express");
const bodyParser = require("body-parser");
const dataresult = express.Router();

const {registration,login,postupdateuser,postdelete,getalluser} = require('../controller/user');

const{getMessage,sendMessage}=require('../controller/message')

const {authenticate}=require('../middleware/authenticate')
const{searchgroup}=require('../controller/group')


dataresult.post("/registration", registration);
dataresult.post("/login", login);
dataresult.get("/user",authenticate,getalluser)
  
  // dataresult.route("/user/:id/update").post(postupdateuser);
  // dataresult.route("/user/:id/delete").post(postdelete);

dataresult.get("/message/:userId",authenticate,getMessage)
dataresult.post("/message/send",authenticate,sendMessage)

  // dataresult.route("/group/search").get(searchgroup);

module.exports = dataresult;
