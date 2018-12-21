const router = require("./RESTModule").Router;

router.get("/test",(res,req)=>{
    res.write("Ss");
})