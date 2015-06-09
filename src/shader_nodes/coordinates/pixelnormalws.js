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

}

LGraphPixelNormalWS.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode({order:this.order,
        scope:scope
    }); // I need to check texture id
}

LiteGraph.registerNodeType("coordinates/"+LGraphPixelNormalWS.title, LGraphPixelNormalWS);

