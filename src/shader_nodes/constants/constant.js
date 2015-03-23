
//Constant
function LGraphConstant()
{
    this.addOutput("value","float", {float:1});
    this.properties = { value:1.0 };

    this.editable = { property:"value", type:"float" };

    this.shader_piece = new PConstant("float"); // hardcoded for testing
}

LGraphConstant.title = "Number";
LGraphConstant.desc = "Constant value";


LGraphConstant.prototype.setValue = function(v)
{
    if( typeof(v) == "string") v = parseFloat(v);
    this.properties["value"] = v;
    this.setDirtyCanvas(true);
};

LGraphConstant.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode("float_"+this.id, this.properties["value"].toFixed(3), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;

    this.setOutputData(0, parseFloat( this.properties["value"] ) );
}

LGraphConstant.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"].toFixed(3);
}

LGraphConstant.prototype.onWidget = function(e,widget)
{
    if(widget.name == "value")
        this.setValue(widget.value);
}

LiteGraph.registerNodeType("constants/"+LGraphConstant.title, LGraphConstant);
