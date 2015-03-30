
require(CodePiece);
declare(PUVs);

var PUVs = {};

PUVs.id = "uvs";
PUVs.includes = { v_coord: 1};
PUVs.already_included = false; // TODO add multiple times same line

PUVs.getVertexCode = function () {
    return "";
}

PUVs.getFragmentCode = function () {
    return "";
}


PUVs.getCode = function (params) {
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;
    var fragment = new CodePiece(order);
    fragment.setIncludes(PUVs.includes);

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode());
    vertex.setIncludes(PUVs.includes);

    return new ShaderCode(vertex, fragment, "v_coord");
}
