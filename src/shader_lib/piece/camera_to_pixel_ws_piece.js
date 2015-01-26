
require(CodePiece);
declare(PCameraToPixelWS);

var PCameraToPixelWS = {};

PCameraToPixelWS.id = "cameratopixelws";
PCameraToPixelWS.includes = {v_pos:1, u_eye: 1};
PCameraToPixelWS.already_included = false; // TODO add multiple times same line

PCameraToPixelWS.getVertexCode = function (output, input) {
    return "";
}

PCameraToPixelWS.getFragmentCode = function (output, input) {
    return "vec3 camera_to_pixel_ws = normalize(v_pos - u_eye); \n\
            ";
}


PCameraToPixelWS.getCode = function (output, input) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(output, input));
    vertex.setIncludes(PCameraToPixelWS.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output, input));
    fragment.setIncludes(PCameraToPixelWS.includes);
    fragment.setOutputVar("camera_to_pixel_ws");

    PCameraToPixelWS.already_included = true;

    return [vertex, fragment];
}
