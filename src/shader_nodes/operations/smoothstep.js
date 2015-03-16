
function LGraphSmooth()
{
    this.addOutput("Result","float",{float:1});
    this.addInput("lower","float", {float:1});
    this.addInput("upper","float", {float:1});
    this.addInput("x","float", {float:1});

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

    var lower_code = this.getInputCode(0);
    var upper_code = this.getInputCode(1);
    var x_code = this.getInputCode(2);

    var lower = lower_code ? lower_code.getOutputVar() :  this.properties["lower"].toFixed(3); // need to put the correct scope
    var upper = upper_code ? upper_code.getOutputVar() :  this.properties["upper"].toFixed(3); // need to put the correct scope
    var x_var = x_code ? x_code.getOutputVar() :  "0.0";

    var output_code = this.codes[0] = this.shader_piece.getCode( "smoothed_"+this.id, lower, upper, x_var); // output var scope unknown
    output_code.order = this.order;
    if(x_code){
        output_code.merge(x_code);
        if(lower_code)
            output_code.merge(lower_code);
        if(upper_code)
            output_code.merge(upper_code);
    } else {
        output_code = LiteGraph.EMPTY_CODE;
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

LiteGraph.registerNodeType("texture/"+LGraphSmooth.title, LGraphSmooth );
