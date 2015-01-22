var PTextureSample = {};

PTextureSample.id = "texture_sample";
PTextureSample.includes = {};

PTextureSample.getVertexCode = function (output, input, texture_id) {
    return "";
}

PTextureSample.getFragmentCode = function (output, input, texture_id) {
    input = input || "v_coord";
    var code = "vec4 " + output + " = texture2D(" + texture_id + ", " + input + ");\n\
                ";
    return code;
}


PTextureSample.getCode = function (output, input, texture_id) {
    var c = {};
    c.fragment ={};
    c.vertex ={};
    c.vertex.uniforms = "";
    c.fragment.uniforms = "uniform sampler2D "+texture_id+";\n      ";
    c.vertex.body = this.getVertexCode(output, input, texture_id);
    c.fragment.body = this.getFragmentCode(output, input, texture_id);
    c.includes = PTextureSample.includes ;
    c.output_var = output;
    return c;
}



