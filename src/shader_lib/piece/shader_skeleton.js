var shader_skeleton = {};




shader_skeleton.getShaderCode = function (code, includes, uniforms) {

    var vertex_code = getVertexCode(code.vertex, includes, uniforms);
    var fragment_code = getFragmentCode(code.fragment, includes, uniforms);

}

shader_skeleton.getVertexCode = function (vertex_code, includes, uniforms) {

    // header
    var code = "\
            precision highp float;\
			attribute vec3 a_vertex;\
			attribute vec3 a_normal;\
			attribute vec2 a_coord;\
			";
    if (includes["v_coord"])
        code += "varying vec2 v_coord;\
        ";
    if (includes["v_normal"])
        code += "varying vec3 v_normal;\
        ";
    code += "uniform mat4 u_mvp;\
			uniform mat4 u_model;";
    code += uniforms.vertex;

    // body
    code += "void main() {\n\
    ";
    code += vertex_code;
    code += "}\
			'";

    return code;


}

shader_skeleton.getFragmentCode = function (fragment_code, includes, uniforms) {

    // header
    var code = "\
            precision highp float;\
			";
    if (includes["v_coord"])
        code += "varying vec2 v_coord;\
        ";
    if (includes["v_normal"])
        code += "varying vec3 v_normal;\
        ";
    code += uniforms.fragment;

    // body
    code += "void main() {\n\
    ";
    code += fragment_code;
    code += "}\
			'";

    return code;


}


