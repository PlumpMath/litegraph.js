
function LGraphCubemap()
{
    this.addOutput("Cubemap","Cubemap");
    this.addOutput("Color","vec4", {vec4:1});
    this.addInput("vec3","vec3");
    this.properties =  this.properties || {};
    this.properties.name = "";

    this.properties =  this.properties || {};
    this.properties.name = "";
    this.properties.texture_url = "";
    this.options = {    texture_url:{hidden:1}};



    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];

    this.shader_piece = PTextureSampleCube; // hardcoded for testing
    this.vector_piece = new PReflected();
    this.size = [170,165];
}

LGraphCubemap.title = "TextureSampleCube";
LGraphCubemap.desc = "textureSampleCube";

LGraphCubemap.prototype.onDropFile = function(data, filename, file)
{
    if(!data)
    {
        this._drop_texture = null;
        this.properties.name = "";
    }
    else
    {
        var no_ext_name = filename.split('.')[0];
        if( typeof(data) == "string" )
            gl.textures[no_ext_name] = this._drop_texture = GL.Texture.cubemapFromURL(data);
        else
            gl.textures[no_ext_name] =this._drop_texture = GL.Texture.fromDDSInMemory(data);
        this.properties.name = no_ext_name;
    }
}

LGraphCubemap.prototype.onExecute = function()
{

    //this.processNodePath();
    if(this._drop_texture)
    {
        this.setOutputData(0, this._drop_texture);
        return;
    }

    if(!this.properties.name)
        return;

    var tex = LGraphTexture.getTexture( this.properties.name, this.properties.texture_url );
    if(!tex)
        return;

    this._last_tex = tex;
    this.setOutputData(0, tex);
}

LGraphCubemap.prototype.onDrawBackground = function(ctx)
{
    //    if( this.flags.collapsed || this.size[1] <= 20)
//        return;
//
//    if(!ctx.webgl)
//        return;
//
//    var cube_mesh = gl.meshes["cube"];
//    if(!cube_mesh)
//        cube_mesh = gl.meshes["cube"] = GL.Mesh.cube({size:1});
//
//    //var view = mat4.lookAt( mat4.create(), [0,0


}

//LGraphCubemap.prototype.processNodePath = function()
//{
//    var input = this.getInputNodePath(0);
//    this.insertIntoPath(input);
//    this.node_path[1] = input;
//    this.node_path[2] = input;
//    this.node_path[3] = input;
//    this.node_path[4] = input;
//    this.node_path[5] = input;
//
//}

LGraphCubemap.prototype.processInputCode = function(scope)
{
    var input_code = this.getInputCode(0) || this.onGetNullCode(0); // get input in link 0
    if(input_code){
        var texture_name = "u_" + (this.properties.name ? this.properties.name : "default_name") + "_texture"; // TODO check if there is a texture
        var color_code = this.codes[1] = this.shader_piece.getCode(
            {   out_var:"color_"+this.id,
                input:input_code.getOutputVar(),
                texture_id:texture_name,
                scope:scope,
                order:this.order
            });
        color_code.merge(input_code);

    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
        this.codes[1] = LiteGraph.EMPTY_CODE;
    }

}

LGraphCubemap.prototype.onGetNullCode = function(slot)
{
    if(slot == 0){
        var code = this.vector_piece.getCode({order:this.order-1});
        return code;
    }



}

LiteGraph.registerNodeType("texture/"+LGraphCubemap.title, LGraphCubemap );
window.LGraphCubemap = LGraphCubemap;
