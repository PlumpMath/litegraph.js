require(CodePiece);
declare(PTextureSampleCube);

var PTextureSampleCube = {};

PTextureSampleCube.id = "texture_sample_cube";
PTextureSampleCube.includes = {};

PTextureSampleCube.getVertexCode = function (output, input, texture_id) {
    return "";
}

PTextureSampleCube.getFragmentCode = function (output, input, texture_id) {
    if(!input)
        throw("input for sample cube not defined")
    var code = "vec4 " + output + " = textureCube(" + texture_id + ", " + input + ");\n\
                ";
    return code;
}


PTextureSampleCube.getCode = function (output, input, texture_id) {

    var vertex = new CodePiece();
    vertex.setIncludes(PTextureSampleCube.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output, input, texture_id));
    fragment.addHeaderLine("uniform samplerCube "+texture_id+";\n      ");
    fragment.setIncludes(PTextureSampleCube.includes);
    fragment.setOutputVar(output);

    return [vertex, fragment];
}



