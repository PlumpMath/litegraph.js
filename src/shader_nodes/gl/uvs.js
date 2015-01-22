//UVS
function LGraphUVs()
{
    this.addOutput("value","vec2");
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };

    this.shader_piece = PUVs; // hardcoded for testing
}

LGraphUVs.title = "UVs";
LGraphUVs.desc = "The texture coordinates";


LGraphUVs.prototype.setValue = function(v)
{
    if( typeof(v) == "string") v = parseFloat(v);
    this.properties["value"] = v;
    this.setDirtyCanvas(true);
};

LGraphUVs.prototype.onExecute = function()
{
    this.code = this.shader_piece.getCode(); // I need to check texture id
    this.setOutputData(0, parseFloat( this.properties["value"] ) );
}

LGraphUVs.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"].toFixed(3);
}

LGraphUVs.prototype.onWidget = function(e,widget)
{
    if(widget.name == "value")
        this.setValue(widget.value);
}

LiteGraph.registerNodeType("texture/UVs", LGraphUVs);

