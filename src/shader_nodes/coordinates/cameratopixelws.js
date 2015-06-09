//UVS
function LGraphCamToPixelWS()
{
    this.addOutput("Camera To Pixel","vec3", {vec3:1});


    this.shader_piece = PCameraToPixelWS; // hardcoded for testing
}

LGraphCamToPixelWS.title = "CameraToPixelWS";
LGraphCamToPixelWS.desc = "The vector from camera to pixel";

LGraphCamToPixelWS.prototype.onExecute = function()
{

}

LGraphCamToPixelWS.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode({order:this.order,
        scope:scope
    }); // I need to check texture id
}

LiteGraph.registerNodeType("coordinates/"+ LGraphCamToPixelWS.title , LGraphCamToPixelWS);

