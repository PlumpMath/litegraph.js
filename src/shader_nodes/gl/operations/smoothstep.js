
function LGraphSmooth()
{
    this.addOutput("Result","number",{number:1, number:1});
    this.addInput("lower","number", {number:1});
    this.addInput("upper","number", {number:1});
    this.addInput("x","number", {number:1});

    this.properties = { lower:0.0,
                        upper:1.5};
    this.shader_piece = PSmooth; // hardcoded for testing
}

LGraphSmooth.title = "SmoothStep";
LGraphSmooth.desc = "Hermite interpolation";

LGraphSmooth.prototype.onExecute = function()
{
    this.processInputCode();
}

LGraphSmooth.prototype.processInputCode = function()
{

    var lower_codes = this.getInputCode(0);
    var upper_codes= this.getInputCode(1);
    var x_code = this.getInputCode(2);

    var lower = lower_codes ? lower_codes[1].getOutputVar() :  this.properties["lower"].toFixed(3); // need to put the correct scope
    var upper = upper_codes ? upper_codes[1].getOutputVar() :  this.properties["upper"].toFixed(3); // need to put the correct scope
    var x_var = x_code ? x_code[1].getOutputVar() :  "0.0";

    this.codes = this.shader_piece.getCode( "smoothed_"+this.id, lower, upper, x_var); // output var scope unknown
    if(x_code){
        this.codes[0].merge(x_code[0]);
        this.codes[1].merge(x_code[1]);
    }

    if(lower_codes){
        this.codes[0].merge(lower_codes[0]);
        this.codes[1].merge(lower_codes[1]);
    }
    if(upper_codes){
        this.codes[0].merge(upper_codes[0]);
        this.codes[1].merge(upper_codes[1]);
    }


}

LGraphSmooth.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[0].label = "lower";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["lower"].toFixed(3);
    this.inputs[1].label = "upper";
    if(!this.isInputConnected(0))
        this.inputs[1].label += "="+this.properties["upper"].toFixed(3);
}

LiteGraph.registerNodeType("texture/SmoothStep", LGraphSmooth );
