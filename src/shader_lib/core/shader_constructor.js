var ShaderConstructor = {};


// codes it's [vertex, fragment]
ShaderConstructor.createShader = function (properties , albedo,normal,emission,specular,gloss,alpha,offset) {


    var vertex_code = this.createVertexCode(properties ,albedo,normal,emission,specular,gloss,alpha,offset);
    var fragment_code = this.createFragmentCode(properties ,albedo,normal,emission,specular,gloss,alpha,offset);

    var shader = {};
    shader.vertex_code = vertex_code;
    shader.fragment_code = fragment_code;
    return shader;



}

ShaderConstructor.createVertexCode = function (properties ,albedo,normal,emission,specular,gloss,alpha,offset) {

    var displacement_factor = properties.displacement_factor.toFixed(4);

    var includes = {};
    for (var line in albedo.vertex.includes) { includes[line] = 1; }
    for (var line in normal.vertex.includes) { includes[line] = 1; }
    for (var line in emission.vertex.includes) { includes[line] = 1; }
    for (var line in specular.vertex.includes) { includes[line] = 1; }
    for (var line in gloss.vertex.includes) { includes[line] = 1; }
    for (var line in alpha.vertex.includes) { includes[line] = 1; }
    for (var line in offset.vertex.includes) { includes[line] = 1; }

    // header
    var r = "precision highp float;\n"+
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
    for(var k in offset.vertex.getHeader())
        r += k;


    // body
    r += "void main() {\n";
    if (includes["v_coord"])
        r += "      v_coord = a_coord;\n";
    r += "      v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\n";
    r += "      vec3 pos = a_vertex;\n";

    var ids = offset.vertex.getBodyIds();
    var body_hash = offset.vertex.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;

    }
    if(ids.length > 0){
        r += "      pos += a_normal * "+offset.getOutputVar()+".x * "+displacement_factor+";\n";
    }

    var ids = albedo.vertex.getBodyIds();
    var body_hash = albedo.vertex.getBody();
    for (var i = 0, l = ids.length; i < l; i++) {
        r += "      "+body_hash[ids[i]].str;
    }
    //if (includes["v_pos"])
    r += "      v_pos = (u_model * vec4(pos,1.0)).xyz;\n";
    r += "      gl_Position = u_mvp * vec4(pos,1.0);\n"+
        "}\n";

    return r;
}

ShaderConstructor.createFragmentCode = function (properties, albedo,normal,emission,specular,gloss,alpha,offset) {


    var has_gloss = gloss.fragment.getBodyIds().length  > 0;
    var has_albedo = albedo.fragment.getBodyIds().length  > 0;
    var has_normal = normal.fragment.getBodyIds().length  > 0;
    var has_specular = specular.fragment.getBodyIds().length  > 0;
    var has_gloss = gloss.fragment.getBodyIds().length  > 0;
    var has_alpha = alpha.fragment.getBodyIds().length  > 0;

    if(has_albedo && has_normal) albedo.fragment.setBody("normal = normalize("+normal.getOutputVar()+".xyz);\n");
   //else normal.fragment.setBody("normal = normalize("+normal.getOutputVar()+".xyz);\n");

    albedo.merge(normal);
    albedo.merge(emission);
    albedo.merge(specular);
    albedo.merge(gloss);
    albedo.merge(alpha);
//    this.options = {
//        gloss:{step:0.01},
//        displacement_factor:{step:0.01},
//        light_dir_x:{min:0, max:1, step:0.01},
//        light_dir_y:{min:0, max:1, step:0.01},
//        light_dir_z:{min:0, max:1, step:0.01}
//    };

    var color = LiteGraph.hexToColor(properties.color);
    var light_dir = "vec3("+properties.light_dir_x+","+properties.light_dir_y+","+properties.light_dir_z+")";
    var gloss_prop = properties.gloss.toFixed(4);


    var includes = {};
    for (var line in albedo.fragment.includes) { includes[line] = 1; }
    for (var line in normal.fragment.includes) { includes[line] = 1; }
    for (var line in emission.fragment.includes) { includes[line] = 1; }
    for (var line in specular.fragment.includes) { includes[line] = 1; }
    for (var line in gloss.fragment.includes) { includes[line] = 1; }
    for (var line in alpha.fragment.includes) { includes[line] = 1; }
    for (var line in offset.fragment.includes) { includes[line] = 1; }

    var header = {};
    for (var line in albedo.fragment.getHeader()) { header[line] = 1; }
    for (var line in normal.fragment.getHeader()) { header[line] = 1; }
    for (var line in specular.fragment.getHeader()) { header[line] = 1; }
    for (var line in gloss.fragment.getHeader()) { header[line] = 1; }

    // header
    var r = "precision highp float;\n"+
     "#extension GL_OES_standard_derivatives : enable\n";
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
    for(var i in header)
        r += i;
//    for(var k in offset.fragment.getHeader())
//        r += k;
    // body
    r += "void main() {\n";
    r += "      vec3 normal = normalize(v_normal);\n";

    //if (includes["camera_to_pixel_ws"])
        r += "      vec3 camera_to_pixel_ws = normalize(v_pos - u_eye);\n";


    var ids = normal.fragment.getBodyIds();
    var body_hash = normal.fragment.getBody();
    if(has_normal){
        // http://www.thetenthplanet.de/archives/1180
        r+= "      vec3 dp1 = dFdx( v_pos );\n" +
            "      vec3 dp2 = dFdy( v_pos );\n" +
            "      vec2 duv1 = dFdx( v_coord );\n" +
            "      vec2 duv2 = dFdy( v_coord );\n" +
            "      vec3 dp2perp = cross( dp2, v_normal );\n" +
            "      vec3 dp1perp = cross( v_normal, dp1 );\n" +
            "      vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;\n" +
            "      vec3 binormal = dp2perp * duv1.y + dp1perp * duv2.y;\n" +
            "      float invmax = inversesqrt( max( dot(tangent,tangent), dot(binormal,binormal) ) );\n" +
            "      mat3 TBN = mat3( tangent * invmax, binormal * invmax, v_normal );\n";
    }


//    for (var i = 0, l = ids.length; i < l; i++) {
//        r += "      "+body_hash[ids[i]].str;
//    }
//    if(ids.length > 0)
//        r += "      normal = normalize("+normal.getOutputVar()+".xyz);\n";

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

//    ids = specular.fragment.getBodyIds();
//    body_hash = specular.fragment.getBody();
//    for (var i = 0, l = ids.length; i < l; i++) {
//        r += "      "+body_hash[ids[i]].str;
//    }
    if(!has_specular){
        r += "      float specular_intensity = 1.0;\n";
    } else{
        r +="      float specular_intensity = "+specular.getOutputVar()+";\n";
    }

//    ids = gloss.fragment.getBodyIds();
//    body_hash = gloss.fragment.getBody();
//    for (var i = 0, l = ids.length; i < l; i++) {
//        r += "      "+body_hash[ids[i]].str;
//    }
    if( !has_gloss){
        r += "      float gloss = "+gloss_prop+";\n";
    } else{
        r +="      float gloss = "+gloss.getOutputVar()+";\n";
    }

//    ids = normal.fragment.getBodyIds();
//    if(ids.length > 0)
//        r += "      normal = normalize("+normal.getOutputVar()+".xyz);\n";
    r +="      float ambient_color = 0.3;\n" +
        "      vec3 light_dir = normalize("+light_dir+");\n" +
        "      float lambertian = max(dot(light_dir,normal), 0.0);\n" +
        "      vec3 reflect_dir = reflect(light_dir, normal);\n" +
        "      float spec_angle = max(dot(reflect_dir, camera_to_pixel_ws), 0.0);\n" +
        "      float specular = pow(spec_angle, gloss);\n" +
        "      specular = specular * specular_intensity;\n";


    r +="      gl_FragColor = vec4(ambient_color*("+albedo.getOutputVar()+").xyz * "+color+" +" +
        "      lambertian *("+albedo.getOutputVar()+").xyz *  "+color+" +" +
        "       specular * vec3(1.0) " + // 1.0 means light color
        "      , 1.0);\n" +
        "}";

    return r;
}


