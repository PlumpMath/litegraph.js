//UVS
function LGraphUVs()
{
    this.addOutput("value","vec2");

    this.shader_piece = PUVs; // hardcoded for testing
}

LGraphUVs.title = "UVs";
LGraphUVs.desc = "The texture coordinates";

LGraphUVs.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
    this.setOutputData(0, parseFloat( this.properties["value"] ) );
}


LiteGraph.registerNodeType("texture/UVs", LGraphUVs);

