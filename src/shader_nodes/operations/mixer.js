
function LGraphMixer()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("alpha","number", {float:1});

    this.properties = { alpha:0.5};
    this.options = { alpha:{min:0, max:1, step:0.01}};
    this.shader_piece = LiteGraph.CodeLib["mix"];
}

LGraphMixer.title = "Lerp";
LGraphMixer.desc = "Lerp between A and B";

LGraphMixer.prototype.onExecute = function()
{
    this.processInputCode();

}

LGraphMixer.prototype.processInputCode = function()
{
    var output_code = LiteGraph.EMPTY_CODE;

    var code_A = this.getInputCode(0);
    var code_B = this.getInputCode(1);
    var code_alpha = this.getInputCode(2);
    var alpha = code_alpha ? code_alpha.getOutputVar() :  this.properties["alpha"].toFixed(3); // need to put the correct scope

    if(code_A && code_B){
        // (out_var, a, b, c, scope, out_type)
        output_code = this.codes[0] = this.shader_piece.getCode( "mixed_"+this.id, code_A.getOutputVar(), code_B.getOutputVar(),alpha, CodePiece.FRAGMENT, "vec4"); // output var must be fragment
        output_code.order = this.order;
        // if the alpha is an input, otherwise hardcoded
        if(code_alpha){
            output_code.merge(code_alpha);
        }
        output_code.merge(code_A);
        output_code.merge(code_B);
    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
    }

}

LGraphMixer.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[2].label = "alpha";
    if(!this.isInputConnected(2))
        this.inputs[2].label += "="+this.properties["alpha"].toFixed(3);
}

LiteGraph.registerNodeType("texture/"+LGraphMixer.title, LGraphMixer );
