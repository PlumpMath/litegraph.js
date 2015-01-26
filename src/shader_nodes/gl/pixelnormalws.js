//UVS
function LGraphPixelNormalWS()
{
    this.addOutput("value","vec3");
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };

    this.shader_piece = PPixelNormalWS; // hardcoded for testing
}

LGraphPixelNormalWS.title = "PixelNormalWS";
LGraphPixelNormalWS.desc = "The normal in world coordinates";

LGraphPixelNormalWS.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
    this.setOutputData(0, parseFloat( this.properties["value"] ) );
}


LiteGraph.registerNodeType("texture/PixelNormalWS", LGraphPixelNormalWS);

