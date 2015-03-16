var ShaderConstructor = {};


// codes it's [vertex, fragment]
ShaderConstructor.createShader = function (albedo,normal,emission,specular,gloss,alpha,offset) {


    var vertex_code = this.createVertexCode(albedo,normal,emission,specular,gloss,alpha,offset);
    var fragment_code = this.createFragmentCode(albedo,normal,emission,specular,gloss,alpha,offset);

    var shader = {};
    shader.vertex_code = vertex_code;
    shader.fragment_code = fragment_code;
    return shader;



}

ShaderConstructor.createVertexCode = function (albedo,normal,emission,specular,gloss,alpha,offset) {

    var includes = {};
    for (var line in albedo.fragment.includes) { includes[line] = 1; }
    for (var line in normal.fragment.includes) { includes[line] = 1; }
    for (var line in emission.fragment.includes) { includes[line] = 1; }
    for (var line in specular.fragment.includes) { includes[line] = 1; }
    for (var line in gloss.fragment.includes) { includes[line] = 1; }
    for (var line in alpha.fragment.includes) { includes[line] = 1; }
    for (var line in offset.fragment.includes) { includes[line] = 1; }

    // header
    var r = "precision highp float;\n"+
        "attribute vec3 a_vertex;\n"+
        "attribute vec3 a_normal;\n"+
        "attribute vec2 a_coord;\n";
    if (includes["v_coord"])
        r += "varying vec2 v_coord;\n";
    //if (includes["v_normal"] || normal != LiteGraph.EMPTY_CODE)
        r += "varying vec3 v_normal;\n";
    if (includes["v_pos"])
        r += "varying vec3 v_pos;\n";
    if (includes["u_time"])
        r += "uniform float u_time;\n";
    if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n";
    r += "uniform mat4 u_mvp;\n"+
         "uniform mat4 u_model;\n";

    for(var k in albedo.vertex.getHeader())
        r += k;

    // body
    r += "void main() {\n";
    if (includes["v_pos"])
        r += "      v_pos = (u_model * vec4(a_vertex,1.0)).xyz;\n";
    if (includes["v_coord"])
        r += "      v_coord = a_coord;\n";
    r += "      v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\n";


    var ids = albedo.vertex.getBodyIds();
    var body_hash = albedo.vertex.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    r += "      gl_Position = u_mvp * vec4(a_vertex,1.0);\n"+
        "}\n";

    return r;
}

ShaderConstructor.createFragmentCode = function (albedo,normal,emission,specular,gloss,alpha,offset) {

    var includes = {};
    for (var line in albedo.fragment.includes) { includes[line] = 1; }
    for (var line in normal.fragment.includes) { includes[line] = 1; }
    for (var line in emission.fragment.includes) { includes[line] = 1; }
    for (var line in specular.fragment.includes) { includes[line] = 1; }
    for (var line in gloss.fragment.includes) { includes[line] = 1; }
    for (var line in alpha.fragment.includes) { includes[line] = 1; }
    for (var line in offset.fragment.includes) { includes[line] = 1; }



    // header
    var r = "precision highp float;\n";
    if (includes["v_coord"])
        r += "varying vec2 v_coord;\n";
    //if (includes["v_normal"] || normal != LiteGraph.EMPTY_CODE )
        r += "varying vec3 v_normal;\n";
    if (includes["v_pos"])
        r += "varying vec3 v_pos;\n";
    if (includes["u_time"])
        r += "uniform float u_time;\n";
    if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n";
    r += "uniform vec4 u_color;\n";
    for(var k in albedo.fragment.getHeader())
        r += k;
    for(var k in normal.fragment.getHeader())
        r += k;
    // body
    r += "void main() {\n";
    r += "      vec3 normal = v_normal;\n";
    var ids = normal.fragment.getBodyIds();
    var body_hash = normal.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;

    }
    if(normal.getOutputVar())
        r += "      normal = "+normal.getOutputVar()+".xyz;\n";

    ids = albedo.fragment.getBodyIds();
    body_hash = albedo.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }


    r +="      float ambient_color = 0.1;\n" +
        "      vec3 light_dir = normalize(vec3(0.5,0.5,0.5));\n" +
        "      float lambertian = max(dot(light_dir,normal), 0.0);\n" +
        "      gl_FragColor = vec4(ambient_color*("+albedo.getOutputVar()+").xyz + lambertian*("+albedo.getOutputVar()+").xyz, 1.0);\n" +
        "}";

    return r;
}


