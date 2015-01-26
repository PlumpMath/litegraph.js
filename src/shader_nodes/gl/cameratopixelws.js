//UVS
function LGraphCamToPixelWS()
{
    this.addOutput("Camera To Pixel","vec3");


    this.shader_piece = PCameraToPixelWS; // hardcoded for testing
}

LGraphCamToPixelWS.title = "CameraToPixelWS";
LGraphCamToPixelWS.desc = "The vector from camera to pixel";

LGraphCamToPixelWS.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
}


LiteGraph.registerNodeType("texture/CameraToPixelWS", LGraphCamToPixelWS);

