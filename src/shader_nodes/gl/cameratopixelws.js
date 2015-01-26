//UVS
function LGraphCamToPixelWS()
{
    this.addOutput("value","vec3");
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };

    this.shader_piece = PCameraToPixelWS; // hardcoded for testing
}

LGraphCamToPixelWS.title = "CameraToPixelWS";
LGraphCamToPixelWS.desc = "The vector from camera to pixel";

LGraphCamToPixelWS.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
    this.setOutputData(0, parseFloat( this.properties["value"] ) );
}


LiteGraph.registerNodeType("texture/CameraToPixelWS", LGraphCamToPixelWS);

