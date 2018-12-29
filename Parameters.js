/*!
 * rest-api-module
 * Copyright(c) 22018 Tal Goldberg <tal-vr@hotmail.com>
 */

class HeaderParams {
    constructor(routeParamas, otherParamas) {
        this.routerParams = routeParamas;
        this.otherParams = otherParamas;
    }
}

class BodyParams {
    constructor(bodyParamas) {
        this.bodyParams = bodyParamas;
    }
}