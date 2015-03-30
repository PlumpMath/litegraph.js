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


PTime.getCode = function (params) {
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var fragment = new CodePiece(order);
    fragment.setIncludes(PTime.includes);

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode());
    vertex.setIncludes(PTime.includes);

    return new ShaderCode(vertex, fragment, "u_time");
}
