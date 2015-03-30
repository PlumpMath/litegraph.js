require(CodePiece);
declare(PConstant);



function PConstant (type, name) {
    this.type = type;
    this.name = name;
    this.id = "constant";
    this.includes = {u_model: 1, a_normal: 1, v_normal: 1};
}

PConstant.prototype.getVertexCode = function (output_var, value, scope) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = this.type+" " +output_var+" = "+value+";\n";
        return code;
    }
    return "";
}

PConstant.prototype.getFragmentCode = function (output_var, value, scope) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = this.type+" " +output_var+" = "+value+";\n";
        return code;
    }
    return "";
}


PConstant.prototype.getCode = function (params) {
    var out_var = params.out_var;
    var a = params.a;
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_var, a, scope));
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_var, a, scope));
    fragment.setIncludes(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}
