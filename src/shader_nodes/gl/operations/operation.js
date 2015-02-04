
function LGraphOperation()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});

    this.shader_piece = POperation; // hardcoded for testing
}

LGraphOperation.title = "operation";
LGraphOperation.desc = "operation between A and B";

LGraphOperation.prototype.onExecute = function()
{

    this.processInputCode();

}

LGraphOperation.prototype.processInputCode = function()
{

    var input_codes_l1 = this.getInputCode(0);
    var input_codes_l2 = this.getInputCode(1);

    this.codes = this.shader_piece.getCode( "result_"+this.id, "+",  input_codes_l1[1].getOutputVar(), input_codes_l2[1].getOutputVar()); // output var must be fragment

    this.codes[0].merge(input_codes_l1[0]);
    this.codes[1].merge(input_codes_l1[1]);
    this.codes[0].merge(input_codes_l2[0]);
    this.codes[1].merge(input_codes_l2[1]);

}


LiteGraph.registerNodeType("texture/Operation", LGraphOperation );
