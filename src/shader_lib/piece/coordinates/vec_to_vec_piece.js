require(CodePiece);
declare(PVecToVec);



function PVecToVec () {
    this.id = "vec_to_vec";
    this.includes = {};
}


PVecToVec.prototype.getCastedVar = function(output_var, out_type, in_type, value) {


    var out_vec =parseInt(out_type.slice(-1));
    var in_vec = parseInt(in_type.slice(-1));
    if( isNaN(out_vec))
        out_vec = 1;
    if( isNaN(in_vec))
        in_vec = 1;

    if(in_vec > out_vec){
        if(out_type == "float")
            return value +".x;\n";
        if(out_type == "vec2")
            return value +".xy;\n";
        if(out_type == "vec3")
            return value +".xyz;\n";
        if(out_type == "vec4")
            return value +".xyzw;\n";
    } else {
        var r = out_type +"("+value;
        for(var i = 0; i < in_vec - out_vec; ++i){
            r +=", 0.0";
        }
        r +=");\n";
        return r;
    }



}

PVecToVec.prototype.getVertexCode = function (output_var, out_type, in_type, value, scope) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = out_type+" " +output_var+" = " + this.getCastedVar(output_var, out_type, in_type, value);
        return code;
    }
    return "";
}

PVecToVec.prototype.getFragmentCode = function (output_var, out_type, in_type, value, scope) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = out_type+" " +output_var+" = " + this.getCastedVar(output_var, out_type, in_type, value);
        return code;
    }
    return "";
}


PVecToVec.prototype.getCode = function (params) {
    var out_var = params.out_var;
    var in_type = params.in_type;
    var out_type = params.out_type;
    var a = params.a;
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;


    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_var, out_type, in_type, a, scope));
    vertex.setIncludesFromMap(this.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_var, out_type, in_type, a, scope));
    fragment.setIncludesFromMap(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}



