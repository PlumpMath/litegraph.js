
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
    if(incident == "eye_to_pixel" || incident == "eye_to_vertex")
        reflect.includes[incident]= 1;

    var code = "vec3 "+output+"= reflect("+incident+","+normal+");";
    return code;
}

