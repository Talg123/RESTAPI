/*!
 * rest-api-module
 * Copyright(c) 22018 Tal Goldberg <tal-vr@hotmail.com>
 */

let response;
let headerParams;
let bodyParams;
let request;
let fileFolder;

module.exports = class RestResponse{
    /**
     * @param {number} statusCode
     * @param {http.ServerResponse} res 
     */
    constructor(res,statusCode=null,hp,bp,req,ff){
        response = res;
        this.statusCode = statusCode;
        headerParams = hp;
        bodyParams = bp;
        request = req;
        fileFolder = ff;
    }

    /**
     * 
     * @param {JSON|JSON} body 
     * @param {string} message
     * @param {Number} statusCode - Default 200
     * @param {Number} code - default 0
     * @returns Return the Object\Array as JSON with Status and Code
     */
    returnJson(body,message=null,statusCode=null,code=0){
                // Website you wish to allow to connect
                // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

                // // Request methods you wish to allow
                // response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                // // Request headers you wish to allow
                // response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

                // // Set to true if you need the website to include cookies in the requests sent
                // // to the API (e.g. in case you use sessions)
                response.setHeader('Access-Control-Allow-Credentials', true);
        
        if(typeof body == "object" || body instanceof Array){
            if(statusCode != null){
                response.statusCode = statusCode;
            }else if(this.statusCode != null){
                statusCode = this.statusCode;
            }else{
                statusCode = 200;
            }
            response.setHeader("Content-type","application/json");
            let obj = {code,data:body,message};
            response.write(JSON.stringify(obj));
            response.end();
        }else{
            throw new Error("Body Data not typeof Object/Array");
        }
    }

    /**
     * return the header parameters 
     * @returns {HeaderParams} - the header parameter object
     */
    getHeaderParams(){
        return headerParams;
    }
    
    /**
     * return the body parameters
     * @returns {BodyParams} - the body parameter object
     */
    getBodyParams(){
        return bodyParams;
    }

}