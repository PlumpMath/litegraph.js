require(CodePiece);
declare(PPixelNormalWS);


var PPixelNormalWS = {};

PPixelNormalWS.id = "pixel_normal_ws";
PPixelNormalWS.includes = {u_model: 1, a_normal: 1, v_normal: 1};
PPixelNormalWS.already_included = false;

PPixelNormalWS.getVertexCode = function (output, input) {
        var code = "v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\n\
                ";
    return code;
}

PPixelNormalWS.getFragmentCode = function (output, input) {
        var code = "vec3 pixel_normal_ws = v_normal;\n\
            ";

    return code;
}


PPixelNormalWS.getCode = function (output, input) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(output, input));
    vertex.setIncludes(PPixelNormalWS.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output, input));
    fragment.setIncludes(PPixelNormalWS.includes);
    fragment.setOutputVar("pixel_normal_ws");

    PPixelNormalWS.already_included = true;

    return [vertex, fragment];
}
