var ShaderConstructor = {};




ShaderConstructor.createShader = function (code, uniforms) {

    var vertex_code = this.getVertexCode(code,  uniforms);
    var fragment_code = this.getFragmentCode(code,  uniforms);
    console.log("vertex:");
    console.log(vertex_code);
    console.log("fragment:");
    console.log(fragment_code);
    return new GL.Shader(vertex_code,fragment_code);
}

ShaderConstructor.getVertexCode = function (code, uniforms) {
    var vertex_code = code.vertex.body;
    var includes = code.includes;
    // header
    var r = "\
            precision highp float;\n\
			attribute vec3 a_vertex;\n\
			attribute vec3 a_normal;\n\
			attribute vec2 a_coord;\n\
			";
    if (includes["v_coord"])
        r += "varying vec2 v_coord;\n\
            ";
    if (includes["v_normal"])
        r += "varying vec3 v_normal;\n\
            ";
    r += "uniform mat4 u_mvp;\n\
		    uniform mat4 u_model;\n";
    r += code.vertex.uniforms  || "\
            ";
    // body
    r += "void main() {\n\
            ";
    r += vertex_code;
    r += "gl_Position = u_mvp * vec4(a_vertex,1.0);\n\
            }\n\
			";
    return r;


}

ShaderConstructor.getFragmentCode = function (code,  uniforms) {
    var fragment_code = code.fragment.body;
    var includes = code.includes;
    // header
    var r = "\
            precision highp float;\n\
			";
    if (includes["v_coord"])
        r += "varying vec2 v_coord;\n\
            ";
    if (includes["v_normal"])
        r += "varying vec3 v_normal;\n\
            ";
    r += code.fragment.uniforms || "\
            ";
    // body
    r += "void main() {\n\
            ";
    r += fragment_code;
    r += "gl_FragColor = "+code.output_var+";\n";

    r += "\n}\n\
			";

    return r;


}


