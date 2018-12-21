# RESTAPI
My own REST API framework.

First Install the module
```bash
npm install rest-api-module 
```

then simply use it.

##Usage
```javascript
const {Server,Router} = require("rest-api-module");

server.port = 3000;

Router.get("/home",(response,request,headerParams,bodyParamas)=>{
    res.write("Hello World");
})
```