let response;

module.exports = class RestResponse{
    /**
     * @param {number} statusCode
     * @param {http.ServerResponse} res 
     */
    constructor(res,statusCode){
        response = res;
        this.statusCode = statuscode;
    }

    /**
     * 
     * @param {JSON|Array} body 
     * @param {string} message
     * @param {Number} statusCode - Default 200
     * @param {Number} code - default 0
     * @returns Return the Object\Array as JSON with Status and Code
     */
    returnJson(body,message,statusCode=null,code=0){
        
        if(typeof body == "object" || body instanceof Array){
            if(statusCode != null){
                response.statusCode = statusCode;
            }else if(this.statusCode != null){
                statusCode = this.statusCode;
            }else{
                statusCode = 200;
            }
            let obj = {code,data:body,message};
            response.write(JSON.stringify(obj));
        }else{
            throw new Error("Body Data not typeof Object/Array");
        }
    }
}