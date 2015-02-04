
require(CodePiece);
declare(PVertexPosWS);

var PVertexPosWS = {};

PVertexPosWS.id = "cameratopixelws";
PVertexPosWS.includes = {v_pos:1, u_eye: 1};
PVertexPosWS.already_included = false; // TODO add multiple times same line

PVertexPosWS.getVertexCode = function (output, input) {
    var vertex = new CodePiece();
    vertex.setIncludes(PCameraToPixelWS.includes);
    vertex.setOutputVar("v_pos");
    return vertex;
}

PVertexPosWS.getFragmentCode = function (output, input) {
    var fragment = new CodePiece();
    fragment.setIncludes(PVertexPosWS.includes);
    return fragment;
}


PVertexPosWS.getCode = function (output, input) {
    var fragment = this.getFragmentCode(output, input);
    var vertex = this.getVertexCode(output, input);

    PVertexPosWS.already_included = true;

    return [vertex, fragment];
}
