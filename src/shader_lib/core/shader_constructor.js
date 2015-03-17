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
    var r = "#extension GL_OES_standard_derivatives : enable\n" +
        "precision highp float;\n"+
        "attribute vec3 a_vertex;\n"+
        "attribute vec3 a_normal;\n"+
        "attribute vec2 a_coord;\n";
    if (includes["v_coord"])
        r += "varying vec2 v_coord;\n";
    //if (includes["v_normal"] || normal != LiteGraph.EMPTY_CODE)
        r += "varying vec3 v_normal;\n";

    r += "varying vec3 v_pos;\n";
    if (includes["u_time"])
        r += "uniform float u_time;\n";
    if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n";
    r += "uniform mat4 u_mvp;\n"+
         "uniform mat4 u_model;\n" +
        "uniform mat4 u_viewprojection;\n";

    for(var k in albedo.vertex.getHeader())
        r += k;
    for(var k in normal.vertex.getHeader())
        r += k;
    for(var k in offset.vertex.getHeader())
        r += k;


    // body
    r += "void main() {\n";
    if (includes["v_pos"])
        r += "      v_pos = (u_model * vec4(a_vertex,1.0)).xyz;\n";
    if (includes["v_coord"])
        r += "      v_coord = a_coord;\n";
    r += "      v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\n";

    var ids = offset.vertex.getBodyIds();
    var body_hash = offset.vertex.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;

    }


    var ids = albedo.vertex.getBodyIds();
    var body_hash = albedo.vertex.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    r += "      gl_Position = u_viewprojection * vec4(v_pos.xyz,1.0);\n"+
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
    var r = "#extension GL_OES_standard_derivatives : enable\n" +
        "precision highp float;\n";
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
    r += "      vec3 normal = normalize(v_normal);\n";

    var ids = normal.fragment.getBodyIds();
    var body_hash = normal.fragment.getBody();
    if(ids.length > 0){
        //https://www.opengl.org/discussion_boards/showthread.php/162857-Computing-the-tangent-space-in-the-fragment-shader
        r +="      vec3 Q1 = dFdx(v_pos);\n" +
            "      vec3 Q2 = dFdy(v_pos);\n" +
            "      vec2 st1 = dFdx(v_coord);\n" +
            "      vec2 st2 = dFdy(v_coord);\n" +
            "      vec3 T = normalize(Q1*st2.t - Q2*st1.t);\n" +
            "      vec3 B = normalize(-Q1*st2.s + Q2*st1.s);\n" +
            "      mat3 TBN = mat3(T, B, v_normal);\n";
    }


    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;

    }
    if(ids.length > 0)
        r += "      normal = "+normal.getOutputVar()+".xyz * TBN;\n" +
             "      normal = normalize(normal);\n";

    ids = albedo.fragment.getBodyIds();
    body_hash = albedo.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }


    r +="      float ambient_color = 0.3;\n" +
        "      vec3 light_dir = normalize(vec3(0.5,0.5,0.5));\n" +
        "      float lambertian = max(dot(light_dir,normal), 0.0);\n" +
        "      gl_FragColor = vec4(ambient_color*("+albedo.getOutputVar()+").xyz + lambertian*("+albedo.getOutputVar()+").xyz, 1.0);\n" +
        "}";

    return r;
}


