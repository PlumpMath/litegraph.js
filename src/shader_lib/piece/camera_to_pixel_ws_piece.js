
require(CodePiece);
declare(PCameraToPixelWS);

var PCameraToPixelWS = {};

PCameraToPixelWS.id = "cameratopixelws";
PCameraToPixelWS.includes = {v_pos:1, u_eye: 1};
PCameraToPixelWS.already_included = false; // TODO add multiple times same line

PCameraToPixelWS.getVertexCode = function (output, input) {
    var vertex = new CodePiece();
    vertex.setIncludes(PCameraToPixelWS.includes);
    return vertex;
}

PCameraToPixelWS.getFragmentCode = function (output, input) {
    var fragment = new CodePiece();
    fragment.setBodyHeader("vec3 camera_to_pixel_ws = normalize(v_pos - u_eye); \n\
            ");
    fragment.setIncludes(PCameraToPixelWS.includes);
    fragment.setOutputVar("camera_to_pixel_ws");
    return fragment;
}


PCameraToPixelWS.getCode = function (output, input) {
    var fragment = this.getFragmentCode(output, input);
    var vertex = this.getVertexCode(output, input);

    PCameraToPixelWS.already_included = true;

    return [vertex, fragment];
}
