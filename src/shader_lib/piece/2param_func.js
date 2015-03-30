require(CodePiece);
declare(P2ParamFunc);


// object representing glsl 2 param function
function P2ParamFunc (type, name) {
    this.type = type;
    this.name = name;
    this.id = "2paramfunc";
    this.includes = {};
}

P2ParamFunc.prototype.getVertexCode = function (out_var, a, b, scope, out_type) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+this.name+"("+a+","+b+");\n";
        return code;
    }
    return "";
}

P2ParamFunc.prototype.getFragmentCode = function (out_var, a, b, scope, out_type) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+this.name+"("+a+","+b+");\n";
        return code;
    }
    return "";
}

/**
 * Run N steps (cycles) of the graph
 * @param {out_var} name of the output var
 *  @param {a} value a in the function
 *  @param {b} value a in the function
 *  @param {scope} either CodePiece.BOTH CodePiece.FRAGMENT CodePiece.VERTEX
 *  @param {out_type} in case the output var type has to be defined in run time example "vec3"
 */
P2ParamFunc.prototype.getCode = function (params) {
    var out_var = params.out_var;
    var a = params.a;
    var b = params.b;
    var scope = params.scope;
    var out_type = params.out_type;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_var, a, b, scope, out_type));
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_var, a, b, scope, out_type));
    fragment.setIncludes(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}

// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
// undefined means T
LiteGraph.CodeLib["distance"] = new P2ParamFunc ("float", "distance");
LiteGraph.CodeLib["dot"] = new P2ParamFunc ("float", "dot");
LiteGraph.CodeLib["cross"] = new P2ParamFunc ("vec3", "cross");
LiteGraph.CodeLib["reflect"] = new P2ParamFunc (undefined, "reflect");
LiteGraph.CodeLib["mod"] = new P2ParamFunc (undefined, "mod");
LiteGraph.CodeLib["min"] = new P2ParamFunc (undefined, "min");
LiteGraph.CodeLib["max"] = new P2ParamFunc (undefined, "max");
LiteGraph.CodeLib["step"] = new P2ParamFunc (undefined, "step");
LiteGraph.CodeLib["pow"] = new P2ParamFunc (undefined, "pow");

