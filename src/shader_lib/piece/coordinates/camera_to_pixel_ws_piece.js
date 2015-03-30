
require(CodePiece);
declare(PCameraToPixelWS);

var PCameraToPixelWS = {};

PCameraToPixelWS.id = "cameratopixelws";
PCameraToPixelWS.includes = {v_pos:1, u_eye: 1, camera_to_pixel_ws:1};

PCameraToPixelWS.getVertexCode = function (order) {
    var vertex = new CodePiece(order);
    vertex.setIncludes(PCameraToPixelWS.includes);
    return vertex;
}

PCameraToPixelWS.getFragmentCode = function (order) {
    var fragment = new CodePiece(order);
    fragment.setBody("");
    fragment.setIncludes(PCameraToPixelWS.includes);
    return fragment;
}


PCameraToPixelWS.getCode = function (params) {
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;
    var fragment = this.getFragmentCode(order);
    var vertex = this.getVertexCode(order);

    return new ShaderCode(vertex, fragment, "camera_to_pixel_ws");
}
