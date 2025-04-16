import {Router} from "express";
const router = Router();
import {} from "./userRoutes.js";

router.use("/api/user",userRouter);

export default router