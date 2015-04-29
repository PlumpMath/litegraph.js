
function LGraphVertexPosWS()
{
    this.addOutput("vec3","vec3", {vec3:1});

    this.shader_piece = PVertexPosWS; // hardcoded for testing
}

LGraphVertexPosWS.title = "VertexPositionWS";
LGraphVertexPosWS.desc = "Vertex position in WS";

LGraphVertexPosWS.prototype.onExecute = function()
{
    //this.processNodePath();
}

//LGraphVertexPosWS.prototype.processNodePath = function()
//{
//    var input = {};
//    this.insertIntoPath(input);
//    this.node_path[0] = input;
//}

LGraphVertexPosWS.prototype.processInputCode = function()
{
    this.codes[0] = this.shader_piece.getCode({order:this.order}); // I need to check texture id
}

LiteGraph.registerNodeType("coordinates/"+LGraphVertexPosWS.title, LGraphVertexPosWS);


