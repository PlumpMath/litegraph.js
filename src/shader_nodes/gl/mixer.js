
function LGraphMixer()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("alpha","number", {float:1});

    this.properties = { alpha:0.5};
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
    var alpha_code = this.getInputCode(2);
    var alpha = alpha_code ? alpha_code[1].getOutputVar() :  this.properties["alpha"].toFixed(3); // need to put the correct scope
    this.codes = this.shader_piece.getCode( "mixed_"+this.id, input_codes_l1[1].getOutputVar(), input_codes_l2[1].getOutputVar(),alpha); // output var must be fragment
    // if the alpha is an input, otherwise hardcoded
    if(alpha_code){
        this.codes[0].merge(alpha_code[0]);
        this.codes[1].merge(alpha_code[1]);
    }
    this.codes[0].merge(input_codes_l1[0]);
    this.codes[1].merge(input_codes_l1[1]);
    this.codes[0].merge(input_codes_l2[0]);
    this.codes[1].merge(input_codes_l2[1]);

}


LiteGraph.registerNodeType("texture/Lerp", LGraphMixer );
