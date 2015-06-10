
//Constant
function LGraphConstVec2()
{
    this.addOutput("value","vec2", {vec2:1});
    this.properties = { v1:1.0,
                        v2:1.0 };
    this.options =  this.options || {};
    this.options.is_global = {hidden:false};
    //this.editable = { property:"value", type:"vec2" };
    this.size = [115,20];
    this.shader_piece = new PConstant("vec2"); // hardcoded for testing
}

LGraphConstVec2.title = "ConstVec2";
LGraphConstVec2.desc = "Constant vector2";

// repeated function should refactor
LGraphConstVec2.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphConstVec2.prototype.setValue = function(v1,v2)
{
    this.setFloatValue(this.properties["v1"],v1);
    this.setFloatValue(this.properties["v2"],v2);
    this.setDirtyCanvas(true);
};

LGraphConstVec2.prototype.onExecute = function()
{
    //    this.processNodePath();
}
//
//LGraphConstVec2.prototype.processNodePath = function()
//{
//    var input = {};
//    this.insertIntoPath(input);
//    this.node_path[0] = input;
//}

LGraphConstVec2.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode(
        { out_var:"vec2_"+this.id,
            is_global:this.properties.is_global,
        a:this.valueToString(),
        scope:scope,
        order:this.order
    });
}

LGraphConstVec2.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.valueToString();
}

LGraphConstVec2.prototype.valueToString = function()
{
    return "vec2("+this.properties["v1"].toFixed(3)+","+this.properties["v2"].toFixed(3)+")";
}


LGraphConstVec2.prototype.callbackIsGlobal = function(  )
{
    this.options.global_name.hidden = !this.properties.is_global;
    this.setGlobalColor();
    if(this.id in this.graph.globals)
        delete this.graph.globals[this.id];
    else{
        this.graph.globals[this.id] = {name:"vec2_"+this.id, value: this.properties , getValue:function(){return [this.value.v1,this.value.v2]}};
    }


}

LiteGraph.registerNodeType("constants/"+LGraphConstVec2.title, LGraphConstVec2);
