
//Constant
function LGraphConstColor()
{
    this.addOutput("color","vec4", {vec4:1});
    this.properties = { color:"#ffffff"};
    this.editable = { property:"value", type:"vec4" };
    this.boxcolor = this.properties.color;
    this.shader_piece = new PConstant("vec4"); // hardcoded for testing
}

LGraphConstColor.title = "Color";
LGraphConstColor.desc = "Constant color";


LGraphConstColor.prototype.onDrawBackground = function(ctx)
{

}


LGraphConstColor.prototype.onExecute = function()
{
    //this.processNodePath();
    this.bgcolor = this.properties.color;
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
            scope:scope,
            order:this.order
        }); // need to check scope

}

LiteGraph.registerNodeType("constants/"+LGraphConstColor.title, LGraphConstColor);
