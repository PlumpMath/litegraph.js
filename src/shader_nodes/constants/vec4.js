
//Constant
function LGraphConstVec4()
{
    this.addOutput("value","vec4", {vec4:1});
    this.properties = { v1:1.0,
                        v2:1.0,
                        v3:1.0,
                        v4:1.0};
    this.options =  this.options || {};
    this.options.is_global = {hidden:false};

    this.editable = { property:"value", type:"vec4" };

    this.shader_piece = new PConstant("vec4");
    this.size = [181,20];
}

LGraphConstVec4.title = "ConstVec4";
LGraphConstVec4.desc = "Constant vector4";


// repeated function should refactor
LGraphConstVec4.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphConstVec4.prototype.setValue = function(v1,v2,v3,v4)
{
    this.setFloatValue(this.properties["v1"],v1);
    this.setFloatValue(this.properties["v2"],v2);
    this.setFloatValue(this.properties["v3"],v3);
    this.setFloatValue(this.properties["v4"],v4);
    this.setDirtyCanvas(true);
};

//LGraphConstVec4.prototype.processNodePath = function()
//{
//    var input = {};
//    this.insertIntoPath(input);
//    this.node_path[0] = input;
//}

LGraphConstVec4.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode(
        { out_var:"vec4_"+this.id,
        is_global:this.properties.is_global,
        a:this.valueToString(),
        scope:scope,
        order:this.order
    });

}

LGraphConstVec4.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphConstVec4.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.valueToString();
}

LGraphConstVec4.prototype.valueToString = function()
{
    return "vec4("+this.properties["v1"].toFixed(3)+","+this.properties["v2"].toFixed(3)+","+this.properties["v3"].toFixed(3)+","+this.properties["v4"].toFixed(3)+")";
}

LGraphConstVec4.prototype.callbackIsGlobal = function(  )
{
    this.options.global_name.hidden = !this.options.global_name.hidden

    if(this.id in this.graph.globals)
        delete this.graph.globals[this.id];
    else{
        this.graph.globals[this.id] = {name:"vec4_"+this.id, value: this.properties , getValue:function(){return [this.value.v1,this.value.v2,this.value.v3,this.value.v4]}};
    }


}


LiteGraph.registerNodeType("constants/"+LGraphConstVec4.title, LGraphConstVec4);
