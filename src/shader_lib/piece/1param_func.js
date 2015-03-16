require(CodePiece);
declare(P1ParamFunc);



function P1ParamFunc (type, name) {
    this.type = type;
    this.name = name;
    this.id = "1paramfunc";
    this.includes = {};
}

P1ParamFunc.prototype.getVertexCode = function (out_var, a, scope, out_type) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+this.name+"("+a+");\n";
        return code;
    }
    return "";
}

P1ParamFunc.prototype.getFragmentCode = function (out_var, a, scope, out_type) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+this.name+"("+a+");\n";
        return code;
    }
    return "";
}


/**
 * @param {out_var} name of the output var
 *  @param {a} value a in the function
 *  @param {b} value a in the function
 *  @param {scope} either CodePiece.BOTH CodePiece.FRAGMENT CodePiece.VERTEX
 *  @param {out_type} in case the output var type has to be defined in run time example "vec3"
 */
P1ParamFunc.prototype.getCode = function (out_var, a, scope, out_type) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(out_var, a, scope, out_type));
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(out_var, a, scope, out_type));
    fragment.setIncludes(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}

// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
// undefined means T
LiteGraph.CodeLib["length"] = new P1ParamFunc ("float", "length");
LiteGraph.CodeLib["sin"] = new P1ParamFunc (undefined, "sin");
LiteGraph.CodeLib["cos"] = new P1ParamFunc (undefined, "cos");
LiteGraph.CodeLib["tan"] = new P1ParamFunc (undefined, "tan");
LiteGraph.CodeLib["asin"] = new P1ParamFunc (undefined, "asin");
LiteGraph.CodeLib["acos"] = new P1ParamFunc (undefined, "acos");
LiteGraph.CodeLib["atan"] = new P1ParamFunc (undefined, "atan");
LiteGraph.CodeLib["abs"] = new P1ParamFunc (undefined, "abs");
LiteGraph.CodeLib["sign"] = new P1ParamFunc (undefined, "sign");
LiteGraph.CodeLib["floor"] = new P1ParamFunc (undefined, "floor");
LiteGraph.CodeLib["ceil"] = new P1ParamFunc (undefined, "ceil");
LiteGraph.CodeLib["fract"] = new P1ParamFunc (undefined, "fract");
