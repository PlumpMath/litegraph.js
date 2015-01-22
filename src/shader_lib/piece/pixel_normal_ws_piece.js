var PPixelNormalWS = {};

PPixelNormalWS.id = "pixel_normal_ws";
PPixelNormalWS.includes = {u_model: 1, a_normal: 1, v_normal: 1};
PPixelNormalWS.already_included = false;

PPixelNormalWS.getVertexCode = function (output, input) {
    if(!PPixelNormalWS.already_included )
        var code = "v_normal = u_model * vec4(a_normal, 0.0);\
                ";
    return code;
}

PPixelNormalWS.getFragmentCode = function (output, input) {
    if(!PPixelNormalWS.already_included )
        var code = "vec3 pixel_normal_ws = v_normal;\n\
            ";

    return code;
}


PPixelNormalWS.getCode = function (output, input) {
    var c = {};
    c.fragment ={};
    c.vertex ={};
    c.vertex.uniforms = "";
    c.fragment.uniforms = "";
    c.vertex.body = this.getVertexCode(output, input);
    c.fragment.body = this.getFragmentCode(output, input);
    PPixelNormalWS.already_included =  true;
    c.includes = {u_model: 1, a_normal: 1, v_normal: 1};
    return c;
}
