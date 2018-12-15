const app = require("./app");

const myApp = new app();

myApp.port = 3000;

myApp.get("/test/:number",(res,req)=>{

})

myApp.get("/test/:numdsadasber/sadas",(res,req,hp,bp)=>{
    res.write(JSON.stringify(hp));
})

myApp.post("/test/:number",(res,req,hp,bp)=>{
    res.write(JSON.stringify(hp));
})
myApp.server();