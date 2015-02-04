
require(CodePiece);
declare(PTime);

var PTime = {};

PTime.id = "uvs";
PTime.includes = {u_time:1};


PTime.getVertexCode = function () {
    return "";
}

PTime.getFragmentCode = function () {
    return "";
}


PTime.getCode = function () {
    var fragment = new CodePiece();
    fragment.setIncludes(PTime.includes);
    fragment.setOutputVar("u_time");

    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode());
    vertex.setIncludes(PTime.includes);
    vertex.setOutputVar("u_time");

    return [vertex, fragment];
}
