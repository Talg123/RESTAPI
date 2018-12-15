const http = require("http");
const routes = [];

class servMe{
    
    constructor(port,hostname="127.0.0.1"){
        this.port = port;
        this.hostname = hostname
    };

    server(){
        http.createServer(async (req,res)=>{
            
            res.setHeader("Content-type","application/json");
            let currentRoute = {url:req.url, method:req.method};
            let route = routes.find(route=>findRouteToServe(route,currentRoute))
            if(route){
                let params = getParamas(route,currentRoute,req);
                let bodyParamas = await getBodyParams(req);
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
            let res = routes.find(route=>findRoute(route,{newUrl,method}));
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

 /**
  * return true if any route of the routes are the same, and have the same method
  * @param route - the first route
  * @param url - the routes
  */
 findRoute = (route,url)=>{
    if(route.method == url.method){
        let routeUrl = route.url.url.split("/");
        let routeUrl2 = url.newUrl.url.split("/");
        if(routeUrl.length == routeUrl2.length){
            for(let i = 1; i<routeUrl.length;i++){
                if(routeUrl[i] == routeUrl2[i]){
                    if(i == routeUrl.length-1){
                        return true;
                    }
                }else if(routeUrl[i][0] == ":" && routeUrl2[i][0] == ":"){
                    if(i == routeUrl.length-1){
                        return true;
                    }
                }else{
                    return false
                }
            }
        }
    }
    return false;
 }

/**
 * finding the right route to serve to the user
 * @param route - the route from the routes list
 * @param currentRoute - the current route we served
 */
 findRouteToServe = (route,currentRoute) =>{
     if(route.method == currentRoute.method){
        let route1 = route.url.url.split("?")[0].split("/");
        let route2 = currentRoute.url.split("?")[0].split("/");
        if(route1.length == route2.length){
            for(let i = 1; i<route1.length;i++){
                if(route1[i] == route2[i] || route1[i][0] == ":"){
                    if(i == route1.length - 1){
                        return true;
                    }
                }else{
                    return false;
                }
            }
        }
     }else{
         return false;
     }
 }

 /**
  * return all the paramaters from the current route
  */
 getParamas = (route,currentRoute) => {
    let params = {};
    let headerParams = {};

    let route1 = route.url.url.split("/");
    let route2 = currentRoute.url.split("?");
    
    let firstParamas = route2[0].split("/");
    for(let i = 1; i<route1.length;i++){
        if(route1[i][0] == ":"){
            let param = route1[i].slice(1);
            params[param] = firstParamas[i];
        }
    }
    let secoundParamas = route2[1].split("&");
    
    secoundParamas.forEach(val=>{
        let param = val.split("=");
        headerParams[param[0]] = param[1];
    })
    
    return {params,headerParams};
}


getBodyParams = async (req) =>{
    let bodyParams="";
    let parsedParamas={};
    await req.on("data",data=>{
        bodyParams+=data.toString();
    });
    let arr = bodyParams.split("&");
    arr.forEach(val=>{
        let param = val.split("=");
        parsedParamas[param[0]] = param[1];
    })

    return parsedParamas;
}


 module.exports = servMe;