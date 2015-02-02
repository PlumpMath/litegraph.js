
function LGraphMixer()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});

    this.shader_piece = PMixer; // hardcoded for testing
}

LGraphMixer.title = "Lerp";
LGraphMixer.desc = "Lerp between A and B";

LGraphMixer.prototype.onExecute = function()
{
    this.processInputCode();

}

LGraphMixer.prototype.processInputCode = function()
{

    var input_codes_l1 = this.getInputCode(0);
    var input_codes_l2 = this.getInputCode(1);

    this.codes = this.shader_piece.getCode( "mixed_"+this.id, input_codes_l1[1].getOutputVar(), input_codes_l2[1].getOutputVar(), "0.5"); // output var must be fragment

    this.codes[0].merge(input_codes_l1[0]);
    this.codes[1].merge(input_codes_l1[1]);
    this.codes[0].merge(input_codes_l2[0]);
    this.codes[1].merge(input_codes_l2[1]);

}


LiteGraph.registerNodeType("texture/Lerp", LGraphMixer );
