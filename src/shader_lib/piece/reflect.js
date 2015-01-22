
var reflect = {};

reflect.id = "reflect";
reflect.includes = {};

reflect.getVertexCode = function(output,incident, normal) {
//    if(incident == "eye_to_pixel" || incident == "eye_to_vertex")
//        reflect.includes[incident]= 1;
//
//    var code = "vec3 "+output+"= reflect("+incident+","+normal+");";
//    return code;
    return "";
}


reflect.getFragmentCode = function(output,incident, normal) {
    if(incident == "eye_to_pixel" || incident == "eye_to_vertex")
        reflect.includes[incident]= 1;

    var code = "vec3 "+output+"= reflect("+incident+","+normal+");";
    return code;
}

