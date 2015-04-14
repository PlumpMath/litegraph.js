
require(CodePiece);
declare(PDepth);

var PDepth = {};

PDepth.id = "depth";
PDepth.includes = {depth:1, v_pos:1};
PDepth.already_included = false; // TODO add multiple times same line

PDepth.getVertexCode = function (order) {
    var vertex = new CodePiece(order);
    vertex.setIncludes(PDepth.includes);
    return vertex;
}

PDepth.getFragmentCode = function (order) {
    var fragment = new CodePiece(order);
    fragment.setIncludes(PDepth.includes);
    return fragment;
}

PDepth.getCode = function (params) {
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;
    var fragment = this.getFragmentCode(order);
    var vertex = this.getVertexCode(order);
    return new ShaderCode(vertex, fragment, "depth");
}
