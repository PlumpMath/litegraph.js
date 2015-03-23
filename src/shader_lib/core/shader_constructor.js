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
    //if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n";
    r += "uniform mat4 u_mvp;\n"+
         "uniform mat4 u_model;\n" +
        "uniform mat4 u_viewprojection;\n";

    for(var k in albedo.vertex.getHeader())
        r += k;
    for(var k in normal.vertex.getHeader())
        r += k;
    for(var k in offset.fragment.getHeader())
        r += k;


    // body
    r += "void main() {\n";
    if (includes["v_coord"])
        r += "      v_coord = a_coord;\n";
    r += "      v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\n";
    r += "      vec3 pos = a_vertex;\n";

    var ids = offset.fragment.getBodyIds();
    var body_hash = offset.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;

    }
    if(ids.length > 0){
        r += "      pos += a_normal * "+offset.getOutputVar()+".x * 0.3;\n";
    }

    var ids = albedo.vertex.getBodyIds();
    var body_hash = albedo.vertex.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    if (includes["v_pos"])
        r += "      v_pos = (u_model * vec4(pos,1.0)).xyz;\n";
    r += "      gl_Position = u_mvp * vec4(pos,1.0);\n"+
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
    //if (includes["v_pos"])
        r += "varying vec3 v_pos;\n";
    if (includes["u_time"])
        r += "uniform float u_time;\n";
    //if (includes["u_eye"])
        r += "uniform vec3 u_eye;\n";
    r += "uniform vec4 u_color;\n";
    for(var k in albedo.fragment.getHeader())
        r += k;
    for(var k in normal.fragment.getHeader())
        r += k;
    for(var k in specular.fragment.getHeader())
        r += k;
    for(var k in gloss.fragment.getHeader())
        r += k;
//    for(var k in offset.fragment.getHeader())
//        r += k;
    // body
    r += "void main() {\n";
    r += "      vec3 normal = normalize(v_normal);\n";

    //if (includes["camera_to_pixel_ws"])
        r += "      vec3 camera_to_pixel_ws = normalize(v_pos - u_eye);\n";


    var ids = normal.fragment.getBodyIds();
    var body_hash = normal.fragment.getBody();
    if(ids.length > 0){
        // http://www.thetenthplanet.de/archives/1180
        r+= "      vec3 dp1 = dFdx( v_pos );\n" +
            "      vec3 dp2 = dFdy( v_pos );\n" +
            "      vec2 duv1 = dFdx( v_coord );\n" +
            "      vec2 duv2 = dFdy( v_coord );\n" +
            "      vec3 dp2perp = cross( dp2, v_normal );\n" +
            "      vec3 dp1perp = cross( v_normal, dp1 );\n" +
            "      vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;\n" +
            "      vec3 bitangent = dp2perp * duv1.y + dp1perp * duv2.y;\n" +
            "      float invmax = inversesqrt( max( dot(tangent,tangent), dot(bitangent,bitangent) ) );\n" +
            "      mat3 TBN = mat3( tangent * invmax, bitangent * invmax, v_normal );\n";
    }


    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    if(ids.length > 0)
        r += "      normal = normalize("+normal.getOutputVar()+".xyz);\n";

//    ids = offset.fragment.getBodyIds();
//    body_hash = offset.fragment.getBody();
//    for (var i = 0, l = ids.length; i < l; i++) {
//        r += "      "+body_hash[ids[i]].str;
//    }
//    if(ids.length > 0)
//        r += "      normal = normalize("+offset.getOutputVar()+".xyz);\n";

    ids = albedo.fragment.getBodyIds();
    body_hash = albedo.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }

    ids = specular.fragment.getBodyIds();
    body_hash = specular.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    if(ids.length == 0){
        r += "      float specular_intensity = 1.0;\n";
    } else{
        r +="      float specular_intensity = "+specular.getOutputVar()+";\n";
    }

    ids = gloss.fragment.getBodyIds();
    body_hash = gloss.fragment.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    if(ids.length == 0){
        r += "      float gloss = 4.0;\n";
    } else{
        r +="      float gloss = "+gloss.getOutputVar()+";\n";
    }

    r +="      float ambient_color = 0.3;\n" +
        "      vec3 light_dir = normalize(vec3(0.5,0.5,0.5));\n" +
        "      float lambertian = max(dot(light_dir,normal), 0.0);\n" +
        "      vec3 reflect_dir = reflect(light_dir, normal);\n" +
        "      float spec_angle = max(dot(reflect_dir, camera_to_pixel_ws), 0.0);\n" +
        "      float specular = pow(spec_angle, gloss);\n" +
        "      specular = specular * specular_intensity;\n";


    r +="      gl_FragColor = vec4(ambient_color*("+albedo.getOutputVar()+").xyz +" +
        "      lambertian*("+albedo.getOutputVar()+").xyz +" +
        "      lambertian * specular * vec3(1.0)" +
        "      , 1.0);\n" +
        "}";

    return r;
}


