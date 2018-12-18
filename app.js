const http = require("http");
const extra = require("./extra");
const routes = [];
const middlewares = {};

class servMe{
    
    constructor(port,hostname="127.0.0.1"){
        this.port = port;
        this.hostname = hostname
    };

    /**
     * runs the server
     */
    server(){
        http.createServer(async (req,res)=>{
            
            res.setHeader("Content-type","application/json");
            let currentRoute = {url:req.url, method:req.method};
            let route = routes.find(route=>extra.findRouteToServe(route,currentRoute))
            if(route){
                //get the header parameters if there are any
                let params = extra.getParamas(route,currentRoute,req);
                //get the body parameters if there are any
                let bodyParamas = await extra.getBodyParams(req);
                //check if there are middlewares to run over to check
                if(route.middlewaresArr){
                    let response = extra.checkAllMiddlewares(route.middlewaresArr,middlewares,res,req,params,bodyParamas);
                    if(response.error){
                        res.write(response.message)
                    }else{
                        route.callBack(res,req,params,bodyParamas);
                    }
                }else{
                    route.callBack(res,req,params,bodyParamas);
                }
            }else{
                res.write(JSON.stringify({error:"No Such Endpoint"}));
            }
            res.end();
        }).listen(this.port,this.hostname,()=>console.log("Server is runnign on port:"+this.port,middlewares));
    };

    /**
     * adding route if not exists
     * @param {*} method 
     * @param {string} url 
     * @param {Function} callBack 
     * @param {Array<string>} middlewaresArr
     */
    register(method,url,callBack,middlewaresArr){
        let newUrl = this.splitUrl(url);
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
     * split up url and return it as object
     * @param {string} url 
     */
    splitUrl(url){
        let urlSplit = url;
        let k = urlSplit.split("/");
        let res = {url:"/",param:[],urlSplitted:"/"};
        let counter = 0;
        for(let i = 1; i<k.length;i++){
        if(k[i][0] == ":"){
            res.param.push(k[i])
            counter++;
        }else{
            res.urlSplitted+=""+k[i]+"/";
        }
            res.url+=""+k[i]+"/";
        }
        if(counter == 0){
            res.urlSplitted = "";
        }
        res.url = res.url.substring(0,res.url.length-1);
        return res;
    }

    /**
     * 
     * @param {*} res 
     * @param {*} req 
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak      
     */
    add(name,callBack){
        if(middlewares[name]){
            throw new Error("Middleware with that name already exists");
        }
        middlewares[name] = callBack;
    }

    /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    get(url,callBack,middlewaresArr=null){
        try{
            this.register("GET",url,callBack,middlewaresArr);
        }catch(e){
            throw new Error(e);
        }
    }

        /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    post(url,callBack,middlewaresArr=null){
        try{
            this.register("POST",url,callBack,middlewaresArr);
        }catch(e){
            throw new Error(e);
        }
    }
        /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    delete(url,callBack,middlewaresArr=null){
        try{
            this.register("DELETE",url,callBack,middlewaresArr);
        }catch(e){
            throw new Error(e);
        }
    }
        /**
     * 
     * @param {string} url 
     * @param {Array<string>?} middlewaresArr
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    put(url,callBack,middlewaresArr=null){
        try{
            this.register("PUT",url,callBack,middlewaresArr);
        }catch(e){
            throw new Error(e);
        }
    }
    
 }

 module.exports = servMe;