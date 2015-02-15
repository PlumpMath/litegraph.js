//UVS
function LGraphReflect()
{
    this.addOutput("reflect vector","vec3", {vec3:1});
    this.addInput("normal","vec3", {vec3:1});
    this.addInput("vector","vec3", {vec3:1});

    this.shader_piece = LiteGraph.CodeLib["reflect"]; // hardcoded for testing
}

LGraphReflect.title = "Reflect";
LGraphReflect.desc = "To reflect a vector3";


LGraphReflect.prototype.onExecute = function()
{
    this.processInputCode();
}


LGraphReflect.prototype.processInputCode = function()
{

    var code_normal = this.getInputCode(0); // normal
    var code_incident = this.getInputCode(1); // inident vector

    // (output, incident, normal)
    if(code_incident && code_normal){
        var output_code = this.codes[0] = this.shader_piece.getCode("reflect_"+this.id, code_incident.getOutputVar(), code_normal.getOutputVar(), CodePiece.FRAGMENT, "vec3"); // output var must be fragment
        output_code.order = this.order;

        output_code.merge(code_normal);
        output_code.merge(code_incident);
    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
    }

}

LiteGraph.registerNodeType("texture/"+LGraphReflect.title, LGraphReflect);

