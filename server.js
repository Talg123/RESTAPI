const app = require("./app");

const myApp = new app();

myApp.port = 3000;

myApp.add("test",(res,req)=>{
    
    return false;
})

myApp.get("/test/:number",(res,req)=>{

},['test']);

myApp.get("/test",(res,req)=>{
    res.write("ss");
})

myApp.get("/test/:numdsadasber/sadas",(res,req,hp,bp)=>{
    res.write(JSON.stringify(hp));
})

myApp.post("/test/:number",(res,req,hp,bp)=>{
    res.write(JSON.stringify(bp));
})
myApp.server();