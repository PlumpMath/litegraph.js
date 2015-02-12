
function LGraphCubemap()
{
    this.addOutput("Cubemap","Cubemap");
    this.addOutput("Color","vec4", {vec3:1, vec4:1});
    this.addInput("vec3","vec3");
    this.properties = {name:""};
    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];

    this.shader_piece = PTextureSampleCube; // hardcoded for testing
    this.properties.name = "cube";
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

    this.processInputCode();
    if(this._drop_texture)
    {
        this.setOutputData(0, this._drop_texture);
        return;
    }

    if(!this.properties.name)
        return;

    var tex = LGraphTexture.getTexture( this.properties.name );
    if(!tex)
        return;

    this._last_tex = tex;
    this.setOutputData(0, tex);
}

LGraphCubemap.prototype.onDrawBackground = function(ctx)
{
    if( this.flags.collapsed || this.size[1] <= 20)
        return;

    if(!ctx.webgl)
        return;

    var cube_mesh = gl.meshes["cube"];
    if(!cube_mesh)
        cube_mesh = gl.meshes["cube"] = GL.Mesh.cube({size:1});

    //var view = mat4.lookAt( mat4.create(), [0,0
}


LGraphCubemap.prototype.processInputCode = function()
{

    var input_code = this.getInputCode(0); // get input in link 0

    var texture_name = "u_" + (this.properties.name ? this.properties.name : "default_name") + "_texture"; // TODO check if there is a texture
    var color_code = this.codes[1] = this.shader_piece.getCode("color_"+this.id, input_code.getOutputVar(), texture_name);

    color_code.merge(input_code);


}


LiteGraph.registerNodeType("texture/"+LGraphCubemap.title, LGraphCubemap );
window.LGraphCubemap = LGraphCubemap;
