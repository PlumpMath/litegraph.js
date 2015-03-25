
function LGraphVertexPosWS()
{
    this.addOutput("vec3","vec3", {vec3:1});

    this.shader_piece = PVertexPosWS; // hardcoded for testing
}

LGraphVertexPosWS.title = "VertexPositionWS";
LGraphVertexPosWS.desc = "Vertex position in WS";

LGraphVertexPosWS.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraphVertexPosWS.prototype.processNodePath = function()
{
    var input = [];
    input.push(this);
    this.node_path[0] = input;
}

LGraphVertexPosWS.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode(); // I need to check texture id
    this.codes[0].setOrder(this.order);
}

LiteGraph.registerNodeType("coordinates/"+LGraphVertexPosWS.title, LGraphVertexPosWS);


