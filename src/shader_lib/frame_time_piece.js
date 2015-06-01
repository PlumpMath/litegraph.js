require(ShaderCode);
require(CodePiece);
declare(PFrameTime);

var PFrameTime = {};

PFrameTime.id = "frame_time";
PFrameTime.includes = {u_frame_time:1};


PFrameTime.getVertexCode = function () {
    return "";
}

PFrameTime.getFragmentCode = function () {
    return "";
}


PFrameTime.getCode = function (params) {
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;

    var fragment = new CodePiece(order);
    fragment.setIncludesFromMap(PFrameTime.includes);

    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode());
    vertex.setIncludesFromMap(PFrameTime.includes);

    return new ShaderCode(vertex, fragment, "u_frame_time");
}
