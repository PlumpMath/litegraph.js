require(ShaderCode);
require(CodePiece);
declare(PTime);

var PTime = {};

PTime.id = "time";
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

    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode());
    vertex.setIncludes(PTime.includes);

    return new ShaderCode(vertex, fragment, "u_time");
}
