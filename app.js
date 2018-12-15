const http = require("http");
const extra = require("./extra");
const routes = [];

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
                let params = extra.getParamas(route,currentRoute,req);
                let bodyParamas = await extra.getBodyParams(req);
                route.callBack(res,req,params,bodyParamas);
            }else{
                res.write(JSON.stringify({error:"No Such Endpoint"}));
            }
            res.end();
        }).listen(this.port,this.hostname,()=>console.log("Server is runnign on port:"+this.port,routes));
    };

    /**
     * adding route if not exists
     * @param {*} method 
     * @param {string} url 
     * @param {Function} callBack 
     */
    register(method,url,callBack){
        let newUrl = this.splitUrl(url);
        if(routes.length > 0){
            let res = routes.find(route=>extra.findRoute(route,{newUrl,method}));
            if(typeof res == "undefined"){
                routes.push({method,url:newUrl,callBack});
            }else{
                throw Error("Route with method:"+method + " already exists");
            }
        }else{
            routes.push({method,url:newUrl,callBack});
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
     * @param {string} url 
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    get(url,callBack){
        try{
            this.register("GET",url,callBack);
        }catch(e){
            throw new Error(e);
        }
    }

    /**
     * 
     * @param {string} url 
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    post(url,callBack){
        try{
            this.register("POST",url,callBack);
        }catch(e){
            throw new Error(e);
        }
    }
    /**
     * 
     * @param {string} url 
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    put(url,callBack){
        try{
            this.register("PUT",url,callBack);
        }catch(e){
            throw new Error(e);
        }
    }
    /**
     * 
     * @param {string} url 
     * @param {(response:Response,request:Request,headerParams,bodyParamas)=>void} callBack: (response,request,headerParams,bodyParams) - return callBak 
     */
    delete(url,callBack){
        try{
            this.register("DELETE",url,callBack);
        }catch(e){
            throw new Error(e);
        }
    }
    
 }

 module.exports = servMe;