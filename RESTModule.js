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
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);            
            res.setHeader("Content-type","application/json");
            let currentRoute = {url:req.url, method:req.method};
            let route = routes.find(route=>extra.findRouteToServe(route,currentRoute))
            if(route){
                //get the header parameters if there are any
                let params = extra.getParamas(route,currentRoute,req);
                //get the body parameters if there are any
                let bodyParamas = await extra.getBodyParams(req);

                let jsonResponse = new classes(res,null,params,bodyParamas);
                //check if there are middlewares to run over to check
                if(route.middlewaresArr){
                    let response = extra.checkAllMiddlewares(route.middlewaresArr,middlewares,jsonResponse,req);
                    if(response.error){
                        res.write(response.message)
                    }else{
                        route.callBack(jsonResponse,req);
                    }
                }else{
                    route.callBack(jsonResponse,req,params,bodyParamas);
                }
            }else{
                res.write(JSON.stringify({error:"No Such Endpoint"}));
            }
            res.end();
        }).listen(this.port,this.hostname,()=>console.log("Server is runnign on port:"+this.port));
    };

    /**
     * adding route if not exists
     * @param {*} method 
     * @param {string} url 
     * @param {Function} callBack 
     * @param {Array<string>} middlewaresArr
     */
    [register](method,url,callBack,middlewaresArr){
        let newUrl = extra.splitUrl(url);
        if(routes.length > 0){
            let res = routes.find(route=>extra.findRoute(route,{newUrl,method}));
            if(typeof res == "undefined"){
                routes.push({method,url:newUrl,callBack,middlewaresArr});
            }else{
                throw Error("Route with method:"+method + " already exists");
            }
        }else{
            routes.push({method,url:newUrl,callBack,middlewaresArr});
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
     */
    [register](method,url,callBack,middlewaresArr){
        let newUrl = extra.splitUrl(url);
        if(routes.length > 0){
            let res = routes.find(route=>extra.findRoute(route,{newUrl,method}));
            if(typeof res == "undefined"){
                routes.push({method,url:newUrl,callBack,middlewaresArr});
            }else{
                throw Error("Route with method:"+method + " already exists");
            }
        }else{
            routes.push({method,url:newUrl,callBack,middlewaresArr});
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
     */
    post(url,callBack,middlewaresArr=null){
        try{
            this[register]("POST",url,callBack,middlewaresArr);
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
     */
    put(url,callBack,middlewaresArr=null){
        try{
            this[register]("PUT",url,callBack,middlewaresArr);
        }catch(e){
            throw new Error(e);
        }
    }
     
 }

 exports.Router = new Router()