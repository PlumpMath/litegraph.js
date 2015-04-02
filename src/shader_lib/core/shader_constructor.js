var ShaderConstructor = {};

function sortMapByValue(map)
{
    var tupleArray = [];
    for (var key in map) tupleArray.push([key, map[key]]);
    tupleArray.sort(function (a, b) { return a[1].order - b[1].order });
    return tupleArray;
}

// codes it's [vertex, fragment]
ShaderConstructor.createShader = function (properties , albedo,normal,emission,specular,gloss,alpha,alphaclip,offset) {

    albedo.merge(normal);
    albedo.merge(emission);
    albedo.merge(specular);
    albedo.merge(gloss);
    albedo.merge(alpha);
    albedo.merge(alphaclip);
    albedo.merge(offset);


    var vertex_code = this.createVertexCode(properties ,albedo,normal,emission,specular,gloss,alpha,alphaclip,offset);
    var fragment_code = this.createFragmentCode(properties ,albedo,normal,emission,specular,gloss,alpha,alphaclip,offset);

    var shader = {};
    shader.vertex_code = vertex_code;
    shader.fragment_code = fragment_code;
    return shader;
}

ShaderConstructor.createVertexCode = function (properties ,albedo,normal,emission,specular,gloss,alpha,alphaclip,offset) {

    var displacement_factor = properties.displacement_factor.toFixed(4);

    var includes = {};
    for (var line in albedo.vertex.includes) { includes[line] = 1; }
    for (var line in normal.vertex.includes) { includes[line] = 1; }
    for (var line in emission.vertex.includes) { includes[line] = 1; }
    for (var line in specular.vertex.includes) { includes[line] = 1; }
    for (var line in gloss.vertex.includes) { includes[line] = 1; }
    for (var line in alpha.vertex.includes) { includes[line] = 1; }
    for (var line in alphaclip.vertex.includes) { includes[line] = 1; }
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



    // body
    r += "void main() {\n";
    if (includes["v_coord"])
        r += "      v_coord = a_coord;\n";
    r += "      v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\n";
    r += "      vec3 pos = a_vertex;\n";


    var ids = albedo.vertex.getBodyIds();
    var body_hash = albedo.vertex.getBody();
    var sorted_map = sortMapByValue(body_hash);
    for(var i in sorted_map){
        r += "      "+sorted_map[i][1].str;
        //console.log(sorted_map[i][1].str +" "+    sorted_map[i][1].order);
    }

    if(offset.getOutputVar()){
        r += "      pos += a_normal * "+offset.getOutputVar()+" * "+displacement_factor+";\n";
    }

    //if (includes["v_pos"])
    r += "      v_pos = (u_model * vec4(pos,1.0)).xyz;\n";
    r += "      gl_Position = u_mvp * vec4(pos,1.0);\n"+
        "}\n";

    return r;
}

ShaderConstructor.createFragmentCode = function (properties, albedo,normal,emission,specular,gloss,alpha,alphaclip, offset) {


    var has_gloss = gloss.fragment.getBodyIds().length  > 0;
    var has_albedo = albedo.fragment.getBodyIds().length  > 0;
    var has_normal = normal.fragment.getBodyIds().length  > 0;
    var has_specular = specular.fragment.getBodyIds().length  > 0;
    var has_emission = emission.fragment.getBodyIds().length  > 0;
    var has_gloss = gloss.fragment.getBodyIds().length  > 0;
    var has_alpha = alpha.fragment.getBodyIds().length  > 0;
    var has_alphaclip = alphaclip.fragment.getBodyIds().length  > 0;



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
    albedo.fragment.addHeaderLine("uniform samplerCube u_cube_default_texture;\n");



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
    for(var i in albedo.fragment.getHeader())
        r += i;

    // http://www.thetenthplanet.de/archives/1180
    if(has_normal) {
        r+= "\nmat3 computeTBN(){\n" +
            "      vec3 dp1 = dFdx( v_pos );\n" +
            "      vec3 dp2 = dFdy( v_pos );\n" +
            "      vec2 duv1 = dFdx( v_coord );\n" +
            "      vec2 duv2 = dFdy( v_coord );\n" +
            "      vec3 dp2perp = cross( dp2, v_normal );\n" +
            "      vec3 dp1perp = cross( v_normal, dp1 );\n" +
            "      vec3 tangent = dp2perp * duv1.x + dp1perp * duv2.x;\n" +
            "      vec3 binormal = dp2perp * duv1.y + dp1perp * duv2.y;\n" +
            "      float invmax = inversesqrt( max( dot(tangent,tangent), dot(binormal,binormal) ) );\n" +
            "      return mat3( tangent * invmax, binormal * invmax, v_normal );\n" +
            "}\n\n";
    }

    r += "void main() {\n";
    r += "      vec3 normal = normalize(v_normal);\n";

    //if (includes["view_dir"])
        r += "      vec3 view_dir = normalize(v_pos - u_eye);\n" +
            "      vec3 light_dir = normalize("+light_dir+");\n" +
            "      vec3 half_dir = normalize(view_dir + light_dir);\n";


    var ids = normal.fragment.getBodyIds();
    var body_hash = normal.fragment.getBody();
    if(has_normal){
        // http://www.thetenthplanet.de/archives/1180
        r+= "      mat3 TBN = computeTBN();\n";
    }


    ids = albedo.fragment.getBodyIds();
    body_hash = albedo.fragment.getBody();
    var sorted_map = sortMapByValue(body_hash);
    for(var i in sorted_map){
        r += "      "+sorted_map[i][1].str;
    }

    if(has_alphaclip) {
        r += "       if ("+alphaclip.getOutputVar()+" < 0.5)\n" +
            "      {\n" +
            "           discard;\n" +
            "      }\n";
    }


    if(!has_specular) {
        r += "      float specular_intensity = 1.0;\n";
    } else {
        r +="      float specular_intensity = "+specular.getOutputVar()+";\n";
    }

    if( !has_gloss) {
        r += "      float gloss = "+gloss_prop+";\n";
    } else{
        r +="      float gloss = "+gloss.getOutputVar()+";\n";
    }

    // diffuse light
    r +="      vec3 diffuse_color = "+albedo.getOutputVar()+".xyz;\n" +
        "      float lambertian = max(dot(light_dir,normal), 0.0);\n" +
        "      vec3 diffuse_light = lambertian * vec3(1.0);\n"; // vec3(1.0) is the light color

    //ambient light
    r +="      float ambient_intensity = 0.2;\n" +
        "      vec3 ambient_light =  vec3(1.0) * ambient_intensity;\n";


    //specular color
    r +="      vec3 reflect_dir = reflect(light_dir, normal);\n" +
        "      float spec_angle = max(dot(reflect_dir, view_dir), 0.0);\n" +
        "      float specular_light = pow(spec_angle, gloss) * specular_intensity;\n" +
        "      vec3 specular_color = vec3(1.0) * specular_light;\n"; // vec3(1.0) is the light color

//    // reflections
//    r +="      vec3 reflected_vector2 = reflect(view_dir,normal);\n" +
//        "      float fresnel_dot = dot(normal, -view_dir);\n" +
//        "      vec4 env_color = textureCube(u_cube_default_texture, reflected_vector2);\n" +
//        "      float w = pow( 1.0 - clamp(0.0,fresnel_dot,1.0), 5.0);\n" +
//        "      vec4 reflection_color = env_color * w;\n";


    // emission color
    if( !has_emission){
        r += "      vec3 emission = vec3(0.0);\n";
    } else {
        r +="      vec3 emission = "+emission.getOutputVar()+".xyz;\n";
    }

//    // specular light
//    r +="      vec3 pixel_normal_ws = normal;\n" +
//        "      vec3 reflected_vector = reflect(view_dir,pixel_normal_ws);\n" +
//        "      vec4 specular_color = textureCube(u_cube_default_texture, reflected_vector);\n" +
//        "      float w = pow( 1.0 - max(0.0, dot(normal, -view_dir)), 2.0);\n" +
//
//        "      vec3 ambient_light = ambient_color * ("+albedo.getOutputVar()+").xyz;\n" +
//        "      vec3 diffuse_reflection = lambertian *("+albedo.getOutputVar()+").xyz;\n" +
//        "      vec3 specular_reflection =   mix( diffuse_reflection, vec3(1.0), w) ;\n"; // vec3(1.0 is the light color)
    //specular_color * specular * specular_intensity

    r +="      gl_FragColor = vec4( emission + "+ /*reflection_color.xyz +*/ " specular_color + (ambient_light + diffuse_light) * diffuse_color, 1.0);\n" +
        "}";

    return r;
}


