require(CodePiece);
declare(PTextureSample);

var PTextureSample = {};

PTextureSample.id = "texture_sample";
PTextureSample.includes = {v_pos:1, v_coord:1, camera_to_pixel_ws:1, u_eye:1};

PTextureSample.getVertexCode = function (output, input, texture_id, texture_type) {
    var code = new CodePiece()
    var code_str = "";
    code.setIncludes(PTextureSample.includes);
//    if( texture_type == LiteGraph.BUMP_MAP){
//        code_str = "vec4 " + output + " = texture2D(" + texture_id + ", " + input + ");\n" +
//            "      v_pos = v_pos + v_normal * "+output+".r ;";
//
//
//        code.addHeaderLine("uniform sampler2D "+texture_id+";\n");
//        code.setIncludes(PTextureSample.includes);
//    }
    code.setBody(code_str);
    return code;
}

PTextureSample.getFragmentCode = function (output, input, texture_id, texture_type) {
    input = input || "v_coord";
    var code = new CodePiece();
    code.setIncludes(PTextureSample.includes);
    var code_str = "";
    code.addHeaderLine("uniform sampler2D " + texture_id + ";\n");
    //if( texture_type == LiteGraph.COLOR_MAP || texture_type == LiteGraph.SPECULAR_MAP) {
    code_str = "vec4 " + output + " = texture2D(" + texture_id + ", " + input + ");\n";
    if (texture_type == LiteGraph.NORMAL_MAP) {
        code_str += "      " + output + " = (2.0 * " + output + " )-1.0;\n";
    }
    else if( texture_type == LiteGraph.TANGENT_MAP){
        code_str += "      " + output + " = (2.0 * " + output + " )-1.0;\n";
        code_str += "      "+output+" = vec4(TBN * "+output+".xyz, 1.0);\n";
        code.setIncludes(PTextureSample.includes);
    }    else if( texture_type == LiteGraph.TANGENT_MAP){
        code_str += "      " + output + " = (2.0 * " + output + " )-1.0;\n";
        code_str += "      "+output+" = vec4(TBN * "+output+".xyz, 1.0);\n";
        code.setIncludes(PTextureSample.includes);
    }
//    else if( texture_type == LiteGraph.BUMP_MAP){
//        code_str += "      const vec2 size = vec2(2.0,0.0);\n" +
//                    "      const ivec3 off = ivec3(-1,0,1);\n" +
//                    "      float s11 = "+output+".x;\n" +
//                    "      float s01 = textureOffset("+texture_id+", v_coord, off.xy).x;\n" +
//                    "      float s21 = textureOffset("+texture_id+", v_coord, off.zy).x;\n" +
//                    "      float s10 = textureOffset("+texture_id+", v_coord, off.yx).x;\n" +
//                    "      float s12 = textureOffset("+texture_id+", v_coord, off.yz).x;\n" +
//                    "      vec3 va = normalize(vec3(size.xy,s21-s01));\n" +
//                    "      vec3 vb = normalize(vec3(size.yx,s12-s10));\n" +
//                    "      "+output+" = vec4( cross(va,vb), s11 );\n";
//
//        code.setIncludes(PTextureSample.includes);
//    }




    code.setBody(code_str);

    return code;
}


PTextureSample.getCode = function (output, input, texture_id, texture_type) {
    var vertex = this.getVertexCode(output, input, texture_id, texture_type)


    var fragment = this.getFragmentCode(output, input, texture_id, texture_type);


    return new ShaderCode(vertex, fragment, output);
}



