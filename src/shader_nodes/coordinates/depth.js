
function LGraphDepth()
{
    this.addOutput("float","float", {float:1});

    this.shader_piece = PDepth; // hardcoded for testing
}

LGraphDepth.title = "Depth";
LGraphDepth.desc = "Depth of the pixel";

LGraphDepth.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphDepth.prototype.processNodePath = function()
{
    var input = [];
    input.push(this);
    this.node_path[0] = input;
}

LGraphDepth.prototype.processInputCode = function()
{
    this.codes[0] = this.shader_piece.getCode({order:this.order}); // I need to check texture id
}

LiteGraph.registerNodeType("coordinates/"+LGraphDepth.title, LGraphDepth);


