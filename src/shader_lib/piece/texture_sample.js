var texture_sample = {};

texture_sample.id = "texture_sample";
texture_sample.includes = {v_coord: 1};

texture_sample.getVertexCode = function (output, input) {
    return "";
}

texture_sample.getFragmentCode = function (output, input, texture_id) {
    input = input || "v_coord";
    var code = "vec4 " + output + " = texture2D(" + texture_id + ", " + input + ");\
        ";
    return code;
}



