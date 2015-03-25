
//Constant
function LGraphConstColor()
{
    this.addOutput("color","vec4", {vec4:1});
    this.properties = { color:"#ffffff"};
    this.editable = { property:"value", type:"vec3" };

    this.shader_piece = new PConstant("vec3"); // hardcoded for testing
}

LGraphConstColor.title = "Color";
LGraphConstColor.desc = "Constant color";


LGraphConstColor.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode("vec3_"+this.id, this.valueToString(), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;
}

LGraphConstColor.prototype.onDrawBackground = function(ctx)
{

}


LGraphConstColor.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphConstColor.prototype.processNodePath = function()
{
    var input = [];
    this.node_path[0] = input;
    input.push(this);
}

LGraphConstColor.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode("vec3_"+this.id, LiteGraph.hexToColor(this.properties["color"]), scope); // need to check scope
    this.codes[0].setOrder(this.order);
}

LiteGraph.registerNodeType("constants/"+LGraphConstColor.title, LGraphConstColor);
