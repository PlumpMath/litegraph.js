//UVS
function LGraphPixelNormalWS()
{
    this.addOutput("Pixel Normal","vec3", {vec3:1});


    this.shader_piece = PPixelNormalWS; // hardcoded for testing
}

LGraphPixelNormalWS.title = "PixelNormalWS";
LGraphPixelNormalWS.desc = "The normal in world space";

LGraphPixelNormalWS.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(); // I need to check texture id
    this.codes[0].order = this.order;
}


LiteGraph.registerNodeType("coordinates/"+LGraphPixelNormalWS.title, LGraphPixelNormalWS);

