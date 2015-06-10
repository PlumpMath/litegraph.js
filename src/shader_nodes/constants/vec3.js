
//Constant
function LGraphConstVec3()
{
    this.addOutput("value","vec3", {vec3:1});
    this.properties = { v1:1.0,
                        v2:1.0,
                        v3:1.0};
    this.options =  this.options || {};
    this.options.is_global = {hidden:false};
    this.editable = { property:"value", type:"vec3" };
    this.size = [147,20];
    this.shader_piece = new PConstant("vec3"); // hardcoded for testing
}

LGraphConstVec3.title = "ConstVec3";
LGraphConstVec3.desc = "Constant vector3";

// repeated function should refactor
LGraphConstVec3.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphConstVec3.prototype.setValue = function(v1,v2,v3)
{
    this.setFloatValue(this.properties["v1"],v1);
    this.setFloatValue(this.properties["v2"],v2);
    this.setFloatValue(this.properties["v3"],v3);
    this.setDirtyCanvas(true);
};

LGraphConstVec3.prototype.onExecute = function()
{
    //this.processNodePath();
}

//LGraphConstVec3.prototype.processNodePath = function()
//{
//    var input = {};
//    this.insertIntoPath(input);
//    this.node_path[0] = input;
//
//}

LGraphConstVec3.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode(
        { out_var:"vec3_"+this.id,
            is_global:this.properties.is_global,
        a:this.valueToString(),
        scope:scope,
        order:this.order
        });
}

LGraphConstVec3.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.valueToString();
}

LGraphConstVec3.prototype.valueToString = function()
{
    return "vec3("+this.properties["v1"].toFixed(3)+","+this.properties["v2"].toFixed(3)+","+this.properties["v3"].toFixed(3)+")";
}

LGraphConstVec3.prototype.callbackIsGlobal = function(  )
{
    this.options.global_name.hidden = !this.options.global_name.hidden

    if(this.id in this.graph.globals)
        delete this.graph.globals[this.id];
    else{
        this.graph.globals[this.id] = {name:"vec3_"+this.id, value: this.properties , getValue:function(){return [this.value.v1,this.value.v2,this.value.v3]}};
    }


}

LiteGraph.registerNodeType("constants/"+LGraphConstVec3.title, LGraphConstVec3);
