
require(CodePiece);
declare(PUVs);

var PUVs = {};

PUVs.id = "uvs";
PUVs.includes = {a_coord:1, v_coord: 1};
PUVs.already_included = false; // TODO add multiple times same line

PUVs.getVertexCode = function (output, input) {
    return "v_coord = a_coord;\n";
}

PUVs.getFragmentCode = function (output, input) {
    return "";
}


PUVs.getCode = function (output, input) {
    var fragment = new CodePiece();
    fragment.setIncludes(PUVs.includes);

    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(output, input));
    vertex.setIncludes(PUVs.includes);

    return new ShaderCode(vertex, fragment, "v_coord");
}
