require(CodePiece);
declare(PConstant);

PConstant.VERTEX = 1;
PConstant.FRAGMENT = 2;
PConstant.BOTH = 3;

function PConstant (type, name) {
    this.type = type;
    this.name = name;
    this.id = "constant";
    this.includes = {u_model: 1, a_normal: 1, v_normal: 1};
}

PConstant.prototype.getVertexCode = function (output_var, value, scope) {
    if(scope == PConstant.VERTEX || scope == PConstant.BOTH){
        var code = this.type+" " +output_var+" = "+value+";\n\
                ";
        return code;
    }
    return "";
}

PConstant.prototype.getFragmentCode = function (output_var, value, scope) {
    if(scope == PConstant.FRAGMENT || scope == PConstant.BOTH){
        var code = this.type+" " +output_var+" = "+value+";\n\
                ";
        return code;
    }
    return "";
}


PConstant.prototype.getCode = function (output_var, value, scope) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(output_var, value, scope));
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output_var, value, scope));
    fragment.setIncludes(this.includes );
    fragment.setOutputVar(output_var);


    return [vertex, fragment];
}
