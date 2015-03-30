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
    var code = "vec4 " + output + " = textureCube(" + texture_id + ", " + input + ");\n";
    return code;
}


PTextureSampleCube.getCode = function (params) {
    var out_var = params.out_var;
    var input = params.input;
    var texture_id = params.texture_id;
    var scope = params.scope;
    var order = params.hasOwnProperty("order") ? params.order : Number.MAX_VALUE;
    var vertex = new CodePiece(order);
    vertex.setBody(this.getVertexCode(out_var, input, texture_id, scope));
    vertex.setIncludes(PTextureSampleCube.includes);

    var fragment = new CodePiece(order);
    fragment.setBody(this.getFragmentCode(out_var, input, texture_id, scope));
    fragment.addHeaderLine("uniform samplerCube "+texture_id+";\n");
    fragment.setIncludes(PTextureSampleCube.includes);

    return new ShaderCode(vertex, fragment, out_var);
}



