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
    if( texture_type == LiteGraph.COLOR_MAP || texture_type == LiteGraph.SPECULAR_MAP) {
        code_str = "vec4 " + output + " = texture2D(" + texture_id + ", " + input + ");\n";
    }  else if (texture_type == LiteGraph.NORMAL_MAP) {
        code_str = "vec4 " + output + " = texture2D(" + texture_id + ", " + input + ");\n";
        code_str += "      " + output + " = (2.0 * " + output + " )-1.0;\n";
    }
    else if( texture_type == LiteGraph.TANGENT_MAP){
        code_str = "vec4 " + output + " = texture2D(" + texture_id + ", " + input + ");\n";
        code_str += "      " + output + " = (2.0 * " + output + " )-1.0;\n";
        code_str += "      "+output+" = vec4(TBN * "+output+".xyz, 1.0);\n";
        code.setIncludes(PTextureSample.includes);
    }



    code.setBody(code_str);

    return code;
}


PTextureSample.getCode = function (output, input, texture_id, texture_type) {
    var vertex = this.getVertexCode(output, input, texture_id, texture_type)


    var fragment = this.getFragmentCode(output, input, texture_id, texture_type);


    return new ShaderCode(vertex, fragment, output);
}



