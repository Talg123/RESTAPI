/*!
 * rest-api-module
 * Copyright(c) 22018 Tal Goldberg <tal-vr@hotmail.com>
 */

class HeaderParamas {
    constructor(routeParamas, otherParamas) {
        this.routerParamas = routeParamas;
        this.otherParamas = otherParamas;
    }
}

class BodyParamas {
    constructor(bodyParamas) {
        this.bodyParamas = bodyParamas;
    }
}