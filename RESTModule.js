/*!
 * rest-api-module
 * Copyright(c) 22018 Tal Goldberg <tal-vr@hotmail.com>
 */

const http = require("http");
const register = Symbol('register');
const extra = require("./extra");
const classes = require("./Response");
const parameters = require("./Parameters");
const routes = [];
const middlewares = {};

class Server{
    
    constructor(port,hostname="127.0.0.1"){
        this.port = port;
        this.hostname = hostname
    };

    /**
     * runs the server
     */
    runServer(){
        
        http.createServer(async (req,res)=>{
            // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);           
            res.setHeader("Content-type","application/json");
            let currentRoute = {url:req.url, method:req.method};
            let route = routes.find(route=>extra.findRouteToServe(route,currentRoute))
            if(route){
                //get the header parameters if there are any
                let params = extra.getParamas(route,currentRoute,req);
                //get the body parameters if there are any
                let bodyParams = await extra.getBodyParams(req,route.uploadDir);

                let jsonResponse = new classes(res,null,params,bodyParams);
                //check if there are middlewares to run over to check
                if(route.middlewaresArr){
                    let response = extra.checkAllMiddlewares(route.middlewaresArr,middlewares,jsonResponse,req);
                    if(response.error){
                        jsonResponse.returnJson(response.message,"Error",404,99)
                    }else{
                        route.callBack(jsonResponse,req);
                    }
                }else{
                    route.callBack(jsonResponse,req,params,bodyParams);
                }
            }else{
                 new classes(res,null,null,null).returnJson({error:"No Such Endpoint"},"NoEndPoint",303,99);
                
            }
        }).listen(this.port,this.hostname,()=>console.log("Server is runnign on port:"+this.port));
    };

    /**
     * adding route if not exists
     * @param {*} method 
     * @param {string} url 
     * @param {Function} callBack 
     * @param {Array<string>} middlewaresArr
     */
    [register](method,url,callBack,middlewaresArr,uploadDir){
        let newUrl = extra.splitUrl(url);
        if(routes.length > 0){
            let res = routes.find(route=>extra.findRoute(route,{newUrl,method}));
            if(typeof res == "undefined"){
                routes.push({method,url:newUrl,callBack,middlewaresArr});
            }else{
                throw Error("Route with method:"+method + " already exists");
            }
        }else{
            routes.push({method,url:newUrl,callBack,middlewaresArr,uploadDir});
        }
    }



    /**
     * 
     * @param {*} res 
     * @param {*} req 
     * @param {(response:classes,request:Request)=>void} callBack: (response,request) - return callBak      
     */
    add(name,callBack){
        if(middlewares[name]){
            throw new Error("Middleware with that name already exists");
        }
        middlewares[name] = callBack;
    }
    
 }

 exports.Server = new Server();

 //class just to add new routes
 class Router{
     
    constructor(){
    
    }

    /**
     * adding route if not exists
     * @param {*} method 
     * @param {string} url 
     * @param {Function} callBack 
     * @param {Array<string>} middlewaresArr
     * @param {string} uploadDir
     */
    [register](method,url,callBack,middlewaresArr,uploadDir){
        let newUrl = extra.splitUrl(url);
        if(routes.length > 0){
            let res = routes.find(route=>extra.findRoute(route,{newUrl,method}));
            if(typeof res == "undefined"){
                routes.push({method,url:newUrl,callBack,middlewaresArr,uploadDir});
            }else{
                throw Error("Route with method:"+method + " already exists");
            }
        }else{
            routes.push({method,url:newUrl,callBack,middlewaresArr,uploadDir});
        }
    }

  /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:classes,request:Request)=>void} callBack: (response,request) - return callBak 
     */
    get(url,callBack,middlewaresArr=null){
        try{
            this[register]("GET",url,callBack,middlewaresArr);
        }catch(e){
            throw new Error(e);
        }
    }

    /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:classes,request:Request)=>void} callBack: (response,request) - return callBak
     * @param {string} uploadDir - the upload dir
     */
    post(url,callBack,middlewaresArr=null,uploadDir=null){
        try{
            this[register]("POST",url,callBack,middlewaresArr,uploadDir);
        }catch(e){
            throw new Error(e);
        }
    }
        /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:classes,request:Request)=>void} callBack: (response,request) - return callBak 
     */
    delete(url,callBack,middlewaresArr=null){
        try{
            this[register]("DELETE",url,callBack,middlewaresArr);
        }catch(e){
            throw new Error(e);
        }
    }
        /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:classes,request:Request)=>void} callBack: (response,request) - return callBak 
     * @param {string} uploadDir - the upload dir 
     */
    put(url,callBack,middlewaresArr=null,uploadDir=null){
        try{
            this[register]("PUT",url,callBack,middlewaresArr,uploadDir);
        }catch(e){
            throw new Error(e);
        }
    }
     
 }

 exports.Router = new Router()