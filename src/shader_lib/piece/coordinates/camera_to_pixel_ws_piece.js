
require(CodePiece);
declare(PCameraToPixelWS);

var PCameraToPixelWS = {};

PCameraToPixelWS.id = "cameratopixelws";
PCameraToPixelWS.includes = {v_pos:1, u_eye: 1};

PCameraToPixelWS.getVertexCode = function (output, input) {
    var vertex = new CodePiece();
    vertex.setIncludes(PCameraToPixelWS.includes);
    return vertex;
}

PCameraToPixelWS.getFragmentCode = function (output, input) {
    var fragment = new CodePiece();
    fragment.setBody("vec3 camera_to_pixel_ws = normalize(v_pos - u_eye); \n\
            ");
    fragment.setIncludes(PCameraToPixelWS.includes);
    return fragment;
}


PCameraToPixelWS.getCode = function (output, input) {
    var fragment = this.getFragmentCode(output, input);
    var vertex = this.getVertexCode(output, input);

    return new ShaderCode(vertex, fragment, "camera_to_pixel_ws");
}
