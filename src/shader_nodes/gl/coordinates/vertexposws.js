
function LGraphVertexPosWS()
{
    this.addOutput("vec3","vec3", {vec3:1});


    this.shader_piece = PVertexPosWS; // hardcoded for testing
}

LGraphVertexPosWS.title = "VertexPositionWS";
LGraphVertexPosWS.desc = "Vertex position in WS";

LGraphVertexPosWS.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
}


LiteGraph.registerNodeType("coordinates/vertexPosWS", LGraphVertexPosWS);


