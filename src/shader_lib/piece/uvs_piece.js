var PUVs = {};

PUVs.id = "uvs";
PUVs.includes = {a_coord:1, v_coord: 1};
PUVs.already_included = false;

PUVs.getVertexCode = function (output, input) {
    return "v_coord = a_coord;\n\
            ";
}

PUVs.getFragmentCode = function (output, input) {
    return "";
}


PUVs.getCode = function (output, input) {
    var c = {};
    c.fragment ={};
    c.vertex ={};
    c.vertex.uniforms = "";
    c.fragment.uniforms = "";
    c.vertex.body = this.getVertexCode(output, input);
    c.fragment.body = this.getFragmentCode(output, input);
    c.includes = {a_coord: 1, v_coord: 1};
    c.output_var = "v_coord";
    return c;
}
