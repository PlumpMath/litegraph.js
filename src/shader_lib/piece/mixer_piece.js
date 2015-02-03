
require(CodePiece);
declare(PMixer);

var PMixer = {};

PMixer.id = "mixer";
PMixer.includes = {v_pos:1, u_eye: 1};
PMixer.already_included = false; // TODO add multiple times same line

PMixer.getVertexCode = function (output, tex1, tex2, alpha) {
    return "";
}

PMixer.getFragmentCode = function (output, tex1, tex2, alpha) {
    return "vec4 "+output+" = mix("+tex1+","+tex2+","+alpha+"); \n\
            ";
}


PMixer.getCode = function (output, tex1, tex2, alpha) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(output, tex1, tex2, alpha));
    vertex.setIncludes(PMixer.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output, tex1, tex2, alpha));
    fragment.setIncludes(PMixer.includes);
    fragment.setOutputVar(output);

    PMixer.already_included = true;

    return [vertex, fragment];
}
