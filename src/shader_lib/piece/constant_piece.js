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
    var is_global = params.hasOwnProperty("is_global") ? params.is_global : false;
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var vertex = new CodePiece(order);
    var fragment = new CodePiece(order);
    if(!is_global){
        vertex.setBody(this.getVertexCode(out_var, a, scope));
        fragment.setBody(this.getFragmentCode(out_var, a, scope));
    } else {
        var id = {};
        var s = "uniform "+this.type+" " +out_var+";\n";
        id[s] = 1;
        vertex.setHeaderFromMap(id);
        fragment.setHeaderFromMap(id);
    }
    fragment.setIncludesFromMap(this.includes );
    vertex.setIncludesFromMap(this.includes);

    return new ShaderCode(vertex, fragment, out_var);
}

PConstant.prototype.setType = function (t) {
    this.type = t;
}

