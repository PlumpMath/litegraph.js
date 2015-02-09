require(CodePiece);
declare(PTextureSample);

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
    var vertex = new CodePiece();
    vertex.setIncludes(PTextureSample.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output, input, texture_id));
    fragment.addHeaderLine("uniform sampler2D "+texture_id+";\n      ");
    fragment.setIncludes(PTextureSample.includes);

    return new ShaderCode(vertex, fragment, output);
}



