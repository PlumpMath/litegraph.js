
//Constant
function LGraphFrameTime()
{
    this.addOutput("time","float", {float:1});

    this.shader_piece = PFrameTime;
}

LGraphFrameTime.title = "FrameTime";
LGraphFrameTime.desc = "Time between frames";


LGraphFrameTime.prototype.onExecute = function()
{
//    this.processNodePath();
}
//
//LGraphFrameTime.prototype.processNodePath = function()
//{
//    var input = {};
//    this.insertIntoPath(input);
//    this.node_path[0] = input;
//}

LGraphFrameTime.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode({order:this.order, scope:scope}); // need to check scope
}

LiteGraph.registerNodeType("constants/"+LGraphFrameTime.title , LGraphFrameTime);
