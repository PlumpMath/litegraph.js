require(CodePiece);
declare(POperation);


// object representing glsl 2 param function
function POperation (type, op) {
    this.type = type;
    this.op = op;
    this.id = "operation";
    this.includes = {};
}

POperation.prototype.getVertexCode = function (out_var, a, b, scope, out_type) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+a+" "+this.op+" "+b+";\n";
        return code;
    }
    return "";
}

POperation.prototype.getFragmentCode = function (out_var, a, b, scope, out_type) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = (out_type || this.type)+" " +out_var+" = "+a+" "+this.op+" "+b+";\n";
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
POperation.prototype.getCode = function (out_var, a, b, scope, out_type) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(out_var, a, b, scope, out_type));
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(out_var, a, b, scope, out_type));
    fragment.setIncludes(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}

// https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf
// undefined means T
LiteGraph.CodeLib["add"] = new POperation (undefined, "+");
LiteGraph.CodeLib["sub"] = new POperation (undefined, "-");
LiteGraph.CodeLib["mul"] = new POperation (undefined, "*");
LiteGraph.CodeLib["div"] = new POperation (undefined, "/");


