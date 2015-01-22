var pixel_normal_ws = {};

pixel_normal_ws.id = "pixel_normal_ws";
pixel_normal_ws.includes = {u_model: 1, a_normal: 1, v_normal: 1};
pixel_normal_ws.already_included = false;

pixel_normal_ws.getVertexCode = function (output, input) {
    if(!pixel_normal_ws.already_included )
        var code = "v_normal = u_model * vec4(a_normal, 0.0);\
                ";
    pixel_normal_ws.already_included = true;
    return code;
}

pixel_normal_ws.getFragmentCode = function (output, input) {
    if(!pixel_normal_ws.already_included )
        var code = "vec3 pixel_normal_ws = v_normal;\n\
            ";
    pixel_normal_ws.already_included =  true;
    return code;
}



