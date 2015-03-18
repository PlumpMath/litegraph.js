require(CodePiece);
declare(PReflected);


// object representing glsl 2 param function
function PReflected () {
    this.id = "reflected_vector";
    this.includes = {v_pos:1, v_normal:1, u_eye: 1, v_coord:1, camera_to_pixel_ws:1};
}

PReflected.prototype.getVertexCode = function () {
    return "";
}

PReflected.prototype.getFragmentCode = function () {
    return  "       vec3 pixel_normal_ws = normal;\n" +
            "       vec3 reflected_vector = reflect(camera_to_pixel_ws,pixel_normal_ws);\n";
}

/**
 * @param {out_var} name of the output var
 *  @param {a} value a in the function
 *  @param {b} value a in the function
 *  @param {scope} either CodePiece.BOTH CodePiece.FRAGMENT CodePiece.VERTEX
 *  @param {out_type} in case the output var type has to be defined in run time example "vec3"
 */
PReflected.prototype.getCode = function () {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode());
    vertex.setIncludes(this.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode());
    fragment.setIncludes(this.includes );

    return new ShaderCode(vertex, fragment, "reflected_vector");
}




