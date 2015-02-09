
//Constant
function LGraphTime()
{
    this.addOutput("time","number", {number:1});

    this.shader_piece = PTime; // hardcoded for testing
}

LGraphTime.title = "Time";
LGraphTime.desc = "Time since execution started";



LGraphTime.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(CodePiece.FRAGMENT); // need to check scope

}

LiteGraph.registerNodeType("constants/Time", LGraphTime);