require(CodePiece);
declare(PPixelNormalWS);


var PPixelNormalWS = {};

PPixelNormalWS.id = "pixel_normal_ws";
PPixelNormalWS.includes = {u_model: 1, a_normal: 1, v_normal: 1};

PPixelNormalWS.getVertexCode = function () {
    return "";
}

PPixelNormalWS.getFragmentCode = function () {
    var code = "vec3 pixel_normal_ws = normal;\n";
    return code;
}


PPixelNormalWS.getCode = function (params) {
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;
    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode());
    vertex.setIncludes(PPixelNormalWS.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode());
    fragment.setIncludes(PPixelNormalWS.includes);

    return new ShaderCode(vertex, fragment, "pixel_normal_ws");
}
