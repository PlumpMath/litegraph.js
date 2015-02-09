//UVS
function LGraphPixelNormalWS()
{
    this.addOutput("Pixel Normal","vec3");


    this.shader_piece = PPixelNormalWS; // hardcoded for testing
}

LGraphPixelNormalWS.title = "PixelNormalWS";
LGraphPixelNormalWS.desc = "The normal in world space";

LGraphPixelNormalWS.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(); // I need to check texture id
}


LiteGraph.registerNodeType("coordinates/pixelNormalWS", LGraphPixelNormalWS);
