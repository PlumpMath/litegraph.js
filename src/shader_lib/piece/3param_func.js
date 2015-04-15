require(CodePiece);
declare(P3ParamFunc);


// object representing glsl 2 param function
function P3ParamFunc (type, name) {
    this.type = type;
    this.name = name;
    this.id = "3paramfunc";
    this.includes = {};
}

P3ParamFunc.prototype.getVertexCode = function (out_var, a, b, c, scope, out_type) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+this.name+"("+a+","+b+","+c+");\n";
        return code;
    }
    return "";
}

P3ParamFunc.prototype.getFragmentCode = function (out_var, a, b, c, scope, out_type) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+this.name+"("+a+","+b+","+c+");\n";
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
P3ParamFunc.prototype.getCode = function (params) {
    var out_var = params.out_var;
    var a = params.a;
    var b = params.b;
    var c = params.c;
    var scope = params.scope;
    var out_type = params.out_type;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_var, a, b, c, scope, out_type));
    vertex.setIncludesFromMap(this.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_var, a, b, c, scope, out_type));
    fragment.setIncludesFromMap(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}

// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
// undefined means T
LiteGraph.CodeLib["distance"] = new P3ParamFunc ("float", "distance");
LiteGraph.CodeLib["refract"] = new P3ParamFunc (undefined, "refract");
LiteGraph.CodeLib["mix"] = new P3ParamFunc (undefined, "mix");
LiteGraph.CodeLib["smoothstep"] = new P3ParamFunc (undefined, "smoothstep");
LiteGraph.CodeLib["clamp"] = new P3ParamFunc (undefined, "clamp");



