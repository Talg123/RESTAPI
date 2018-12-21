const {Server,Router} = require("./RESTModule");
const routes = require("./router");

const app = Server;
app.port = 3000;

app.add("test",(res,req)=>{
    
    return true;
})

app.runServer();