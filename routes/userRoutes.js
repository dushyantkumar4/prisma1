import {Router} from "express";
const router =Router();
import {createUser} from "../controller/UserController.js";

router.post("/",createUser);

export default router;