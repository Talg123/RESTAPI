let response;

module.exports = class RestResponse{
    /**
     * 
     * @param {http.ServerResponse} res 
     */
    constructor(res){
        response = res;
    }

    /**
     * 
     * @param {JSON|Array} body 
     * @param {Number} statusCode - Default 200
     * @param {Number} code - default 0
     * @returns Return the Object\Array as JSON with Status and Code
     */
    returnJson(body,statusCode=200,code=0){
        
        if(typeof body == "object" || body instanceof Array){
            response.statusCode = statusCode;
            let obj = {code,data:body,statusCode};
            response.write(JSON.stringify(obj));
        }else{
            throw new Error("Body Data not typeof Object/Array");
        }
    }
}