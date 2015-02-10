//**************************
function LGraphTexturePreview()
{
    this.addInput("Texture","Texture", {Texture:1, Vec3:1, Vec4:1});
    this.properties = { flipY: false };
    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];
}

LGraphTexturePreview.title = "Preview";
LGraphTexturePreview.desc = "Show a texture in the graph canvas";

LGraphTexturePreview.prototype.onDrawBackground = function(ctx)
{
    if(this.flags.collapsed) return;

    var tex = this.getInputData(0);
    if(!tex) return;

    var tex_canvas = null;

    if(!tex.handle && ctx.webgl)
        tex_canvas = tex;
    else
        tex_canvas = LGraphTexture.generateLowResTexturePreview(tex);

    //render to graph canvas
    ctx.save();
    if(this.properties.flipY)
    {
        ctx.translate(0,this.size[1]);
        ctx.scale(1,-1);
    }
    ctx.drawImage(tex_canvas,0 + LiteGraph.NODE_COLLAPSED_RADIUS * 0.5,0 + LiteGraph.NODE_COLLAPSED_RADIUS * 0.5,this.size[0] - LiteGraph.NODE_COLLAPSED_RADIUS,this.size[1]- LiteGraph.NODE_COLLAPSED_RADIUS);
    ctx.restore();
}

LiteGraph.registerNodeType("texture/"+LGraphTexturePreview.title, LGraphTexturePreview );
window.LGraphTexturePreview = LGraphTexturePreview;