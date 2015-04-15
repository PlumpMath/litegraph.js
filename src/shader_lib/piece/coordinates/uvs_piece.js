
require(CodePiece);
declare(PUVs);

var PUVs = {};

PUVs.id = "uvs";
PUVs.includes = { v_coord: 1};
PUVs.already_included = false; // TODO add multiple times same line

PUVs.getVertexCode = function (out_var, utiling, vtiling, scope) {
    if(scope == CodePiece.VERTEX || scope == CodePiece.BOTH) {
        return "vec2 " + out_var + " = v_coord * vec2(" + utiling + "," + vtiling + ");\n";
    }
    return "";
}

PUVs.getFragmentCode = function (out_var, utiling, vtiling, scope) {
    if(scope == CodePiece.FRAGMENT || scope == CodePiece.BOTH) {
        return "vec2 " + out_var + " = v_coord * vec2(" + utiling + "," + vtiling + ");\n";
    }
    return "";
}


PUVs.getCode = function (params) {
    var out_var = params.out_var;
    var utiling = params.utiling || "1.000";
    var vtiling = params.vtiling || "1.000";
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var uvs_modified = (utiling !== "1.000" ||  vtiling !== "1.000");

    var fragment = new CodePiece(order);
    if(uvs_modified)
        fragment.setBody(this.getFragmentCode(out_var, utiling, vtiling, scope));
    fragment.setIncludes(PUVs.includes);

    var vertex = new CodePiece(order);
    if(uvs_modified)
        vertex.setBody(this.getVertexCode(out_var, utiling, vtiling, scope));
    vertex.setIncludes(PUVs.includes);


    return new ShaderCode(vertex, fragment, uvs_modified ? out_var : "v_coord");
}
