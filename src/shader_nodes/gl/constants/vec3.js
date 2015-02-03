
//Constant
function LGraphConstVec3()
{
    this.addOutput("value","vec3", {vec3:1});
    this.properties = { value:"1.0,1.0,1.0" };
    this.editable = { property:"value", type:"vec3" };

    this.shader_piece = new PConstant("vec3"); // hardcoded for testing
}

LGraphConstVec3.title = "ConstVec3";
LGraphConstVec3.desc = "Constant vector3";


LGraphConstVec3.prototype.setValue = function(v1,v2,v3)
{
    if( typeof(v) == "string") v = parseFloat(v);
    this.properties["value"] = v;
    this.setDirtyCanvas(true);
};

LGraphConstVec3.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode("vec3_"+this.id, "vec3("+this.properties["value"]+")", PConstant.FRAGMENT); // need to check scope
}

LGraphConstVec3.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"];
}


LiteGraph.registerNodeType("constants/ConstVec3", LGraphConstVec3);
