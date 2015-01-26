var ShaderConstructor = {};


// codes it's [vertex, fragment]
ShaderConstructor.createShader = function (codes) {

    var vertex = codes[0];
    var fragment = codes[1];

    var vertex_code = this.createVertexCode(vertex);
    var fragment_code = this.createFragmentCode(fragment);
    console.log("vertex:");
    console.log(vertex_code);
    console.log("fragment:");
    console.log(fragment_code);
    return new GL.Shader(vertex_code,fragment_code);
}

ShaderConstructor.createVertexCode = function (code, uniforms) {

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
    if (includes["v_pos"])
        r += "varying vec3 v_pos;\n\
            ";
    if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n\
            ";
    r += "uniform mat4 u_mvp;\n\
		    uniform mat4 u_model;\n";

    for(var k in code.getHeader())
        r += k;

    // body
    r += "void main() {\n\
            ";
    if (includes["v_pos"])
        r += "v_pos = (u_model * vec4(a_vertex,1.0)).xyz;\n\
            ";
    r += code.getBody();
    r += "gl_Position = u_mvp * vec4(a_vertex,1.0);\n\
            }\n\
			";
    return r;


}

ShaderConstructor.createFragmentCode = function (code) {
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
    if (includes["v_pos"])
        r += "varying vec3 v_pos;\n\
            ";
    if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n\
            ";
    for(var k in code.getHeader())
        r += k;
    // body
    r += "void main() {\n\
            ";
    r += code.getBody();
    r += "gl_FragColor = "+code.getOutputVar()+";\n";

    r += "\n}\n\
			";

    return r;


}


