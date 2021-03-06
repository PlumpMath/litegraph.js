

require(CodePiece);
declare(PFresnel);



function PFresnel () {
    this.id = "fresnel";
    this.includes = {u_model: 1, a_normal: 1, v_normal: 1, view_dir:1};
}

PFresnel.prototype.getVertexCode = function (output_var,  normal, exp, scope) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH){
        var normal = normal || "v_normal";
        var code = "float fresnel_"+output_var+" = dot("+normal+", -view_dir);\n" +
        "      float "+output_var+" = pow( 1.0 - clamp(fresnel_"+output_var+",0.0,1.0), "+exp+");\n";
        return code;
    }
    return "";
}

PFresnel.prototype.getFragmentCode = function (output_var,  normal, exp, scope) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH){
        var normal = normal || "normal";
        var code = "float fresnel_"+output_var+" = dot("+normal+", -view_dir);\n" +
            "      float "+output_var+" = pow( 1.0 - clamp(fresnel_"+output_var+",0.0,1.0), "+exp+");\n";
        return code;
    }
    return "";
}


PFresnel.prototype.getCode = function (params) {
    var out_var = params.out_var;
    var exp = params.exp || "1.0";
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;
    var normal = params.normal;

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_var,  normal, exp, scope));
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH)
        vertex.setIncludesFromMap(this.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_var,  normal, exp, scope));
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH)
        fragment.setIncludesFromMap(this.includes );

    return new ShaderCode(vertex, fragment, out_var);
}
