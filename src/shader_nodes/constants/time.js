
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
    this.codes[0] = this.shader_piece.getCode(CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;

}

LiteGraph.registerNodeType("constants/"+LGraphTime.title , LGraphTime);
