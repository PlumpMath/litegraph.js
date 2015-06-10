
//Constant
function LGraphConstColor()
{
    this.addOutput("color","vec4", {vec4:1});
    this.properties = { color:"#ffffff"};
    this.editable = { property:"value", type:"vec4" };
    this.options =  this.options || {};
    this.options.is_global = {hidden:false};
    this.boxcolor = this.properties.color;
    this.shader_piece = new PConstant("vec4"); // hardcoded for testing
    this.global_var = {name:"vec4_"+this.id, value: this.properties , getValue:function(){return LiteGraph.hexToColor(this.value["color"], true)}};
}

LGraphConstColor.title = "Color";
LGraphConstColor.desc = "Constant color";


LGraphConstColor.prototype.onDrawBackground = function(ctx)
{
    this.bgcolor = this.properties.color;
}


LGraphConstColor.prototype.onExecute = function()
{
    //this.processNodePath();
    //this.bgcolor = this.properties.color;
}

//LGraphConstColor.prototype.processNodePath = function()
//{
//    var input = {};
//    this.insertIntoPath(input);
//    this.node_path[0] = input;
//
//}

LGraphConstColor.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode(
        { out_var:"vec4_"+this.id,
            a:LiteGraph.hexToColor(this.properties["color"]),
            is_global:this.properties.is_global,
            scope:scope,
            order:this.order
        }); // need to check scope

}

LGraphConstColor.prototype.callbackIsGlobal = function(  )
{
    this.options.global_name.hidden = !this.options.global_name.hidden

    if(this.id in this.graph.globals)
        delete this.graph.globals[this.id];
    else{
        this.graph.globals[this.id] = {name:"vec4_"+this.id, value: this.properties , getValue:function(){return LiteGraph.hexToColor(this.value["color"], true)}};
    }


}

LiteGraph.registerNodeType("constants/"+LGraphConstColor.title, LGraphConstColor);
