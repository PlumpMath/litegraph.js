
//Constant
function LGraphTime()
{
    this.addOutput("time","float", {float:1});

    this.shader_piece = PTime; // hardcoded for testing
}

LGraphTime.title = "Time";
LGraphTime.desc = "Time since execution started";


LGraphTime.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphTime.prototype.processNodePath = function()
{
    var input = {};
    this.insertIntoPath(input);
    this.node_path[0] = input;
}

LGraphTime.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode({order:this.order, scope:scope}); // need to check scope
}

LiteGraph.registerNodeType("constants/"+LGraphTime.title , LGraphTime);
