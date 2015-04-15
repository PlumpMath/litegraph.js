require(CodePiece);
declare(PPanner);



function PPanner () {
    this.id = "panner";
    this.includes = {u_time:1};
}

PPanner.prototype.getVertexCode = function (out_var, input, time, dx, dy, scope, out_type) {
    var time = time == "" ? "u_time" : time;
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var code = out_type+" " +out_var+" = "+input+";\n" +
            "      "+out_var+".x += "+dx+" * "+time+";\n" +
            "      "+out_var+".y += "+dy+" * "+time+";\n";// +
            //"      "+out_var+" = fract("+out_var+");\n";
        return code;
    }
    return "";
}

PPanner.prototype.getFragmentCode = function (out_var, input, time, dx, dy, scope, out_type) {
    var time = time == "" ? "u_time" : time;
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = out_type+" " +out_var+" = "+input+";\n" +
            "      "+out_var+".x += "+dx+" * "+time+";\n" +
            "      "+out_var+".y += "+dy+" * "+time+";\n";// +
            //"      "+out_var+" = fract("+out_var+");\n";
        return code;
    }
    return "";
}



PPanner.prototype.getCode = function ( params) {
    //out_var, input, time, dx, dy, scope, out_type
    var out_var = params.out_var;
    var input = params.input;
    var time = params.time;
    var dx = params.dx;
    var dy = params.dy;
    var scope = params.scope;
    var out_type = params.out_type;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_var, input, time, dx, dy, scope, out_type));
    vertex.setIncludesFromMap(this.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_var, input, time, dx, dy, scope, out_type));
    fragment.setIncludesFromMap(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}

