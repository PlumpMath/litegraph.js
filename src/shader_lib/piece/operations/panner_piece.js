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
            "      "+out_var+".y += "+dy+" * "+time+";\n" +
            "      "+out_var+" = fract("+out_var+");\n";
        return code;
    }
    return "";
}

PPanner.prototype.getFragmentCode = function (out_var, input, time, dx, dy, scope, out_type) {
    var time = time == "" ? "u_time" : time;
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var code = out_type+" " +out_var+" = "+input+";\n" +
            "      "+out_var+".x += "+dx+" * "+time+";\n" +
            "      "+out_var+".y += "+dy+" * "+time+";\n" +
            "      "+out_var+" = fract("+out_var+");\n";
        return code;
    }
    return "";
}



PPanner.prototype.getCode = function (out_var, input, time, dx, dy, scope, out_type) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(out_var, input, time, dx, dy, scope, out_type));
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(out_var, input, time, dx, dy, scope, out_type));
    fragment.setIncludes(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}

