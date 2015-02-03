
//Constant
function LGraphConstVec4()
{
    this.addOutput("value","vec4", {vec4:1});
    this.properties = { value:"1.0,1.0,1.0,1.0" };
    this.editable = { property:"value", type:"vec4" };

    this.shader_piece = new PConstant("vec4"); // hardcoded for testing
}

LGraphConstVec4.title = "ConstVec4";
LGraphConstVec4.desc = "Constant vector4";


LGraphConstVec4.prototype.setValue = function(v1,v2,v3,v4)
{
    if( typeof(v1) == "string") v1 = parseFloat(v1);
    this.properties["value"] = v1;
    this.setDirtyCanvas(true);
};

LGraphConstVec4.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode("vec4_"+this.id, "vec4("+this.properties["value"]+")", PConstant.FRAGMENT); // need to check scope
}

LGraphConstVec4.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"];
}


LiteGraph.registerNodeType("constants/ConstVec4", LGraphConstVec4);
