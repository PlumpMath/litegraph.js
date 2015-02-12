
require(CodePiece);
declare(PReflect);

var PReflect = {};

PReflect.id = "reflect";
PReflect.includes = {};

PReflect.getVertexCode = function(output,incident, normal) {
//    if(incident == "eye_to_pixel" || incident == "eye_to_vertex")
//        reflect.includes[incident]= 1;
//
//    var code = "vec3 "+output+"= reflect("+incident+","+normal+");";
//    return code;
    return "";
}


PReflect.getFragmentCode = function(output,incident, normal) {

    var code = "vec3 "+output+"= reflect("+incident+","+normal+");\n";
    return code;
}

PReflect.getCode = function (output, incident, normal) {
    var vertex = new CodePiece();
    vertex.setIncludes(PReflect.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output, incident, normal));
    fragment.setIncludes(PReflect.includes);

    return new ShaderCode(vertex, fragment, output);
}





