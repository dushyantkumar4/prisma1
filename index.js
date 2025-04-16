import "dotenv/config";
import express from "express";
const app = express();
const PORT =process.env.PORT||8080;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    res.send("this is root ");
});
import routes from "./routes/script.js";
app.use(routes);

app.listen(PORT,()=>{
    console.log(`server is runing ${PORT}`);
});
