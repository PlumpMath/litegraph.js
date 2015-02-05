
require(CodePiece);
declare(PSmooth);

var PSmooth = {};

PSmooth.id = "smoothsteep";
PSmooth.includes = {};

PSmooth.getVertexCode = function(output ,lower, upper, x) {
//    if(incident == "eye_to_pixel" || incident == "eye_to_vertex")
//        reflect.includes[incident]= 1;
//
//    var code = "vec3 "+output+"= reflect("+incident+","+normal+");";
//    return code;
    return "";
}


PSmooth.getFragmentCode = function(output ,lower, upper, x) {

    var code = "float "+output+" = smoothstep("+lower+","+upper+", "+x+");\n\
            ";
    return code;
}

PSmooth.getCode = function (output ,lower, upper, x) {
    var vertex = new CodePiece();
    vertex.setIncludes(PSmooth.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output ,lower, upper, x));
    fragment.setIncludes(PSmooth.includes);

    return new ShaderCode(vertex, fragment, output);
}





