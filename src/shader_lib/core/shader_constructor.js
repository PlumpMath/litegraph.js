var ShaderConstructor = {};


// codes it's [vertex, fragment]
ShaderConstructor.createShader = function (color_code, normal_code, world_offset_code) {


    var vertex_code = this.createVertexCode(color_code, normal_code, world_offset_code);
    var fragment_code = this.createFragmentCode(color_code, normal_code, world_offset_code);

    var shader = {};
    shader.vertex_code = vertex_code;
    shader.fragment_code = fragment_code;
    return shader;



}

ShaderConstructor.createVertexCode = function (code, normal,offset) {

    var includes = {};
    for (var line in code.vertex.includes) { includes[line] = 1; }
    for (var line in normal.vertex.includes) { includes[line] = 1; }
    for (var line in offset.vertex.includes) { includes[line] = 1; }
    // header
    var r = "precision highp float;\n"+
        "attribute vec3 a_vertex;\n"+
        "attribute vec3 a_normal;\n"+
        "attribute vec2 a_coord;\n";
    if (includes["v_coord"])
        r += "varying vec2 v_coord;\n";
    if (includes["v_normal"] || normal != LiteGraph.EMPTY_CODE)
        r += "varying vec3 v_normal;\n";
    if (includes["v_pos"])
        r += "varying vec3 v_pos;\n";
    if (includes["u_time"])
        r += "uniform float u_time;\n";
    if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n";
    r += "uniform mat4 u_mvp;\n"+
         "uniform mat4 u_model;\n";

    for(var k in code.vertex.getHeader())
        r += k;

    // body
    r += "void main() {\n";
    if (includes["v_pos"])
        r += "      v_pos = (u_model * vec4(a_vertex,1.0)).xyz;\n";
    var ids = code.vertex.getBodyIds();
    var body_hash = code.vertex.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    r += "      gl_Position = u_mvp * vec4(a_vertex,1.0);\n"+
        "}\n";

    return r;
}

ShaderConstructor.createFragmentCode = function (code,normal,offset) {

    var includes = {};
    for (var line in code.fragment.includes) { includes[line] = 1; }
    for (var line in normal.fragment.includes) { includes[line] = 1; }
    for (var line in offset.fragment.includes) { includes[line] = 1; }
    // header
    var r = "precision highp float;\n";
    if (includes["v_coord"])
        r += "varying vec2 v_coord;\n";
    if (includes["v_normal"] || normal != LiteGraph.EMPTY_CODE )
        r += "varying vec3 v_normal;\n";
    if (includes["v_pos"])
        r += "varying vec3 v_pos;\n";
    if (includes["u_time"])
        r += "uniform float u_time;\n";
    if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n";
    r += "uniform vec4 u_color;\n";
    for(var k in code.fragment.getHeader())
        r += k;
    for(var k in normal.fragment.getHeader())
        r += k;
    // body
    r += "void main() {\n";
    if (includes["v_normal"] || normal.getOutputVar())
        r += "      vec3 normal = v_normal;\n";
    var ids = normal.fragment.getBodyIds();
    var body_hash = normal.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;

    }
    if(normal.getOutputVar())
        r += "      normal = "+normal.getOutputVar()+".xyz;\n";

    ids = code.fragment.getBodyIds();
    body_hash = code.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }

    r += "       gl_FragColor = "+code.getOutputVar()+";\n"+
        "}";

    return r;
}


