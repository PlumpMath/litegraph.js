
require(CodePiece);
declare(POperation);

var POperation = {};

POperation.id = "operation";
POperation.includes = {v_pos:1, u_eye: 1};
POperation.already_included = false; // TODO add multiple times same line

POperation.getVertexCode = function (output, op, input1, input2) {
    return "";
}

POperation.getFragmentCode = function (output, op, input1, input2) {
    return "vec4 "+output+" = "+input1+" "+op+" "+input2+"; \n\
            ";
}


POperation.getCode = function (output, op, input1, input2) {
    var vertex = new CodePiece();
    vertex.setBody(this.getVertexCode(output, op, input1, input2));
    vertex.setIncludes(POperation.includes);

    var fragment = new CodePiece();
    fragment.setBody(this.getFragmentCode(output, op, input1, input2));
    fragment.setIncludes(POperation.includes);
    fragment.setOutputVar(output);

    POperation.already_included = true;

    return [vertex, fragment];
}