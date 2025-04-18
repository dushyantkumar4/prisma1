const express = require("express");
const router = express.Router();
const userController=require("../controller/userController.js");

router.get("/",userController.getUser);
router.post("/",userController.createUser);

module.exports=router;