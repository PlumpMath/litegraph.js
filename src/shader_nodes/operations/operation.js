
function LGraphOperation()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});

    this.shader_piece = POperation; // hardcoded for testing
}

LGraphOperation.title = "Operation";
LGraphOperation.desc = "operation between A and B";

LGraphOperation.prototype.onExecute = function()
{

    this.processInputCode();

}

LGraphOperation.prototype.processInputCode = function()
{

    var code_A = this.getInputCode(0);
    var code_B = this.getInputCode(1);

    var output_code = this.codes[0] = this.shader_piece.getCode( "result_"+this.id, "+",  code_A.getOutputVar(), code_B.getOutputVar()); // output var must be fragment

    output_code.merge(code_A);
    output_code.merge(code_B);

}


LiteGraph.registerNodeType("texture/"+LGraphOperation.title, LGraphOperation );
