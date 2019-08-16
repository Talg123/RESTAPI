# RESTAPI
REST API framework, Simple and tiny.
Return JSON for client.

First Install the module
```shell
$ npm install rest-api-module 
```
 
then simply use it.

## Usage
```javascript
const {Server,Router} = require("rest-api-module");

Server.port = 3000;

Router.get("/home",(response,request)=>{
    let obj = {message:"Hello world"}
    //Body , Message, StatusCode, Code
    res.returnJson(obj,"Success",200,0);
})

Server.runServer();
```


## Options

In the Router you can use:
GET POST DELETE PUT.

AT the callback you dont have to do much you already have the Body Paramaters and the Head paramaters
example:  
Lets say we have POST Request:  
localhost:3000/test/43?param1=1&param2=2  
and in the Body Paramaters we have:  
accessToken=blabla  

```javascript

router.get("/test/:id", (res, req) => {
    res.returnJson({
        header:res.getHeaderParams(),
        body:res.getBodyParams()
        },"Success",200,0);    
})
```
And in the response we will have:

```json
{
    "code": 0,
    "data": {
        "header": {
            "routerParams": {
                "id": "43"
            },
            "otherParams": {
                "param1": "1",
                "param2": "2"
            }
        },
        "body": {
            "bodyParams": {
                "accessToken": "blabla"
            }
        }
    },
    "message": "Success"
}
```

That way you save time in getting all the parameters were sent.

## Files

Now you can set file folders to upload to and if to save the original name of the  
file, simply as that!
While your uploading the files you will get the uploaded file in the  
bodyParamas, you will have the full content + the "link".

```javascript
Server.setFiles("uploads/",true);

```


## Response

| method | return | example  |
|---	|---	|---	|
| returnJson | return response object  	| {code:0,data:{msg:"hello"},message:"Success"}  	| 
| getBodyParams | return the body parameters  	|"bodyParams": {"accessToken": "blabla"}   	| 
| getHeaderParams  | return the header parameters| "routerParams": {"id": "43"},"otherParamas": {"param2": "2"}  	|

## Middlewares

All you have to do is to add middlewears as many as you want and just use 
them if you want

# example:

```javascript
 const {Server,Router} = require("rest-api-module");

Server.port = 3000;
//first you add the name of the middleware then you use the callBack function
Server.add("name",(response,request)=>{
    if(response.routerParams.name == "I am Cool"){
        return true;
    }
    return false;
});
// Assign the middlware
Router.get("/home",(response,request)=>{
    //Body , Message=null, StatusCode=200, Code=0
    response.returnJson({message:"Hello World"});
},['name']);

Server.runServer();
```

if the middlware passed it will continue else it will throw error that it not passed and tell you in which
middlware


Good Luck and Enjoy.