
require(CodePiece);
declare(PVertexPosWS);

var PVertexPosWS = {};

PVertexPosWS.id = "cameratopixelws";
PVertexPosWS.includes = {v_pos:1, u_eye: 1};
PVertexPosWS.already_included = false; // TODO add multiple times same line

PVertexPosWS.getVertexCode = function (order) {
    var vertex = new CodePiece(order);
    vertex.setIncludesFromMap(PVertexPosWS.includes);
    return vertex;
}

PVertexPosWS.getFragmentCode = function (order) {
    var fragment = new CodePiece(order);
    fragment.setIncludesFromMap(PVertexPosWS.includes);
    return fragment;
}

PVertexPosWS.getCode = function (params) {
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;
    var fragment = this.getFragmentCode(order);
    var vertex = this.getVertexCode(order);
    return new ShaderCode(vertex, fragment, "v_pos");
}
