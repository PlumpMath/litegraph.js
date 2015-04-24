function LGraphTexture()
{
    this.addOutput("Texture","Texture",{Texture:1});
    this.addOutput("Color","vec4", {vec4:1});
    this.addOutput("R","float", {float:1});
    this.addOutput("G","float", {float:1});
    this.addOutput("B","float", {float:1});
    this.addOutput("A","float", {float:1});
    this.addInput("UVs","vec2", {vec2:1});

    // properties for for dat gui
    this.properties =  this.properties || {};
    this.properties.name = "";
    this.properties.texture_url = "";
    this.properties.texture_type = "Color";
    this.properties.normal_map_type = "Tangent space";


    this.options =  this.options || {};
    this.options.texture_url = {hidden:1};
    var that = this;
    this.options.texture_type = {multichoice:[ 'Color', 'Normal map'], reloadonchange:1,
                                 callback: "toggleNormalMap"};
    this.options.normal_map_type = {multichoice:[ 'Tangent space', 'Model space', 'Bump map' ], hidden:1};


    //this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];
    this.size = [170,165];
    this.shader_piece = PTextureSample; // hardcoded for testing
    this.uvs_piece = PUVs;
    // default texture
//    if(typeof(gl) != "undefined" && gl.textures["default"]){
//        this.properties.name = "default";
//        this._drop_texture = gl.textures["default"];
//    }
}

LGraphTexture.title = "TextureSample";
LGraphTexture.desc = "textureSample";
LGraphTexture.widgets_info = {"name": { widget:"texture"} };

//REPLACE THIS TO INTEGRATE WITH YOUR FRAMEWORK
LGraphTexture.textures_container = {}; //where to seek for the textures, if not specified it uses gl.textures
LGraphTexture.loadTextureCallback = null; //function in charge of loading textures when not present in the container
LGraphTexture.image_preview_size = 256;

//flags to choose output texture type
LGraphTexture.PASS_THROUGH = 1; //do not apply FX
LGraphTexture.COPY = 2;			//create new texture with the same properties as the origin texture
LGraphTexture.LOW = 3;			//create new texture with low precision (byte)
LGraphTexture.HIGH = 4;			//create new texture with high precision (half-float)
LGraphTexture.REUSE = 5;		//reuse input texture
LGraphTexture.DEFAULT = 2;

LGraphTexture.MODE_VALUES = {
    "pass through": LGraphTexture.PASS_THROUGH,
    "copy": LGraphTexture.COPY,
    "low": LGraphTexture.LOW,
    "high": LGraphTexture.HIGH,
    "reuse": LGraphTexture.REUSE,
    "default": LGraphTexture.DEFAULT
};

LGraphTexture.getTexture = function(name, url)
{
    var container =  gl.textures || LGraphTexture.textures_container; // changedo order, otherwise it bugs with the multiple context

    if(!container)
        throw("Cannot load texture, container of textures not found");

    var tex = container[ name ];

    if(!tex && name && name[0] != ":" || tex && tex.width == 1 && tex.height == 1 && tex.texture_type != gl.TEXTURE_CUBE_MAP)
    {
        //texture must be loaded
        if(LGraphTexture.loadTextureCallback)
        {
            var loader = LGraphTexture.loadTextureCallback;
            tex = loader( name, url );
            return tex;
        }
        else
        {
            var url = name;
            if(url.substr(0,7) == "http://")
            {
                if(LiteGraph.proxy) //proxy external files
                    url = LiteGraph.proxy + url.substr(7);
            }

            tex = container[ name ] = GL.Texture.fromURL(name, {});
        }
    }

    return tex;
}

//used to compute the appropiate output texture
LGraphTexture.getTargetTexture = function( origin, target, mode )
{
    if(!origin)
        throw("LGraphTexture.getTargetTexture expects a reference texture");

    var tex_type = null;

    switch(mode)
    {
        case LGraphTexture.LOW: tex_type = gl.UNSIGNED_BYTE; break;
        case LGraphTexture.HIGH: tex_type = gl.HIGH_PRECISION_FORMAT; break;
        case LGraphTexture.REUSE: return origin;
        case LGraphTexture.COPY:
        default: tex_type = origin ? origin.type : gl.UNSIGNED_BYTE; break;
    }

    if(!target || target.width != origin.width || target.height != origin.height || target.type != tex_type )
        target = new GL.Texture( origin.width, origin.height, { type: tex_type, format: gl.RGBA, filter: gl.LINEAR });

    return target;
}

LGraphTexture.getNoiseTexture = function()
{
    if(this._noise_texture)
        return this._noise_texture;

    var noise = new Uint8Array(512*512*4);
    for(var i = 0; i < 512*512*4; ++i)
        noise[i] = Math.random() * 255;

    var texture = GL.Texture.fromMemory(512,512,noise,{ format: gl.RGBA, wrap: gl.REPEAT, filter: gl.NEAREST });
    this._noise_texture = texture;
    return texture;
}

LGraphTexture.loadTextureFromFile = function(data, filename, file, callback, gl){

    gl = gl || window.gl;
    if(data)
    {
        var texture = null;
        var no_ext_name = LiteGraph.removeExtension(filename);
        if( typeof(data) == "string" )
            gl.textures[no_ext_name] = texture = GL.Texture.fromURL( data, {wrap: gl.REPEAT}, callback, gl );
        else if( filename.toLowerCase().indexOf(".dds") != -1 )
            texture = GL.Texture.fromDDSInMemory(data, gl);
        else
        {
            var blob = new Blob([file]);
            var url = URL.createObjectURL(blob);
            texture = GL.Texture.fromURL( url, {}, callback , gl  );
        }
        texture.name = no_ext_name;
        return texture;
    }

}

LGraphTexture.prototype.toggleNormalMap = function () {
    if(this.properties.texture_type == "Normal map") {
        this.options.normal_map_type.hidden = 0;
    } else  {
        this.options.normal_map_type.hidden = 1;
    }
}


LGraphTexture.prototype.onDropFile = function(data, filename, file, callback, gl)
{
    if(!data)
    {
        this._drop_texture = null;
        this.properties.name = "";
    } else {
        var tex = LGraphTexture.loadTextureFromFile(data, filename, file, LGraphTexture.configTexture, gl);
        if(tex){
            this._drop_texture = tex;
            this._last_tex = this._drop_texture;
            this.properties.name = tex.name;
            this._drop_texture.current_ctx = LiteGraph.current_ctx;
        }
    }
}

LGraphTexture.prototype.getExtraMenuOptions = function(graphcanvas)
{
    var that = this;
    if(!this._drop_texture)
        return;
    return [ {content:"Clear", callback:
        function() {
            that._drop_texture = null;
            that.properties.name = "";
        }
    }];
}

LGraphTexture.prototype.onExecute = function()
{
    this.processNodePath();

    if(this._drop_texture ){

        if(this._drop_texture.current_ctx != LiteGraph.current_ctx){
            this._drop_texture = LGraphTexture.getTexture( this.properties.name, this.properties.texture_url );
        }
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

LGraphTexture.prototype.onDrawBackground = function(ctx)
{
    if( this.flags.collapsed || this.size[1] <= 20 )
        return;

    if( this._drop_texture && ctx.webgl )
    {
        ctx.drawImage(this._drop_texture,this.size[1]* 0.05,this.size[1]* 0.2,this.size[0]* 0.75,this.size[1]* 0.75);
        //this._drop_texture.renderQuad(this.pos[0],this.pos[1],this.size[0],this.size[1]);
        return;
    }

    //Different texture? then get it from the GPU
    if(this._last_preview_tex != this._last_tex)
    {
        if(ctx.webgl)
        {
            this._canvas = this._last_tex;
        }
        else if( !this._drop_texture && !this._last_tex.hasOwnProperty("ready")|| this._drop_texture && !this._drop_texture.hasOwnProperty("ready"))
        {
            var tex_canvas = LGraphTexture.generateLowResTexturePreview(this._last_tex);
            if(!tex_canvas)
                return;

            this._last_preview_tex = this._last_tex;
            this._canvas = cloneCanvas(tex_canvas);
        }
    }

    if(!this._canvas)
        return;

    //render to graph canvas
    ctx.save();
    if(!ctx.webgl) //reverse image
    {
        ctx.translate(0,this.size[1]);
        ctx.scale(1,-1);
    }
    ctx.drawImage(this._canvas,this.size[1]* 0.05,this.size[1]* 0.1,this.size[0]* 0.75,this.size[1]* 0.75);
    ctx.restore();
}


//very slow, used at your own risk
LGraphTexture.generateLowResTexturePreview = function(tex)
{
    if(!tex) return null;

    var size = LGraphTexture.image_preview_size;
    var temp_tex = tex;

    //Generate low-level version in the GPU to speed up
    if(tex.width > size || tex.height > size)
    {
        temp_tex = this._preview_temp_tex;
        if(!this._preview_temp_tex)
        {
            temp_tex = new GL.Texture(size,size, { minFilter: gl.NEAREST });
            this._preview_temp_tex = temp_tex;
        }

        //copy
        tex.copyTo(temp_tex);
        tex = temp_tex;
    }

    //create intermediate canvas with lowquality version
    var tex_canvas = this._preview_canvas;
    if(!tex_canvas)
    {
        tex_canvas = createCanvas(size,size);
        this._preview_canvas = tex_canvas;
    }

    if(temp_tex)
        temp_tex.toCanvas(tex_canvas);
    return tex_canvas;
}

LGraphTexture.prototype.processNodePath = function()
{

    var input = this.getInputNodePath(0);

    this.insertIntoPath(input);

    this.node_path[1] = input;
    this.node_path[2] = input;
    this.node_path[3] = input;
    this.node_path[4] = input;
    this.node_path[5] = input;
//    this.node_path[2] = cloned_input.slice(0);
//    this.node_path[3] = cloned_input.slice(0);
//    this.node_path[4] = cloned_input.slice(0);
//    this.node_path[5] = cloned_input.slice(0);

}

LGraphTexture.prototype.processInputCode = function(scope)
{

//    if(this.properties.texture_type == "Normal map") {
//        if (!this.properties.hasOwnProperty("normal_map_type"))
//            this.properties.normal_map_type = "Tangent space";
//    } else
//        delete this.properties.normal_map_type;



    var input_code = this.getInputCode(0) || this.onGetNullCode(0);
    var texture_type = 0;
    if(this.properties.texture_type == "Normal map"  ){
        if(this.properties.normal_map_type == "Tangent space")
            texture_type =  LiteGraph.TANGENT_MAP;
        else if(this.properties.normal_map_type == "Model space")
            texture_type = LiteGraph.NORMAL_MAP;
        else if(this.properties.normal_map_type == "Bump map")
            texture_type = LiteGraph.BUMP_MAP;
    }
    else
        texture_type = LiteGraph.COLOR_MAP;


    if(input_code){
        var texture_name = "u_" + (this.properties.name ? this.properties.name : "default_name") + "_texture"; // TODO check if there is a texture
        var color_output = this.codes[1] = this.shader_piece.getCode(
            {   out_var:"color_"+this.id,
                input:input_code.getOutputVar(),
                texture_id:texture_name,
                texture_type:texture_type,
                scope:scope,
                order:this.order
            });

        color_output.merge(input_code);
        var r_chan = color_output.clone();
        r_chan.output_var = color_output.getOutputVar()+".r";
        this.codes[2] = r_chan;
        var g_chan = color_output.clone();
        g_chan.output_var = color_output.getOutputVar()+".g";
        this.codes[3] = g_chan;
        var b_chan = color_output.clone();
        b_chan.output_var = color_output.getOutputVar()+".b";
        this.codes[4] = b_chan;
        var a_chan = color_output.clone();
        a_chan.output_var = color_output.getOutputVar()+".a";
        this.codes[5] = a_chan;
//        this.codes[3]
//        this.codes[4]
//        this.codes[5]
    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
        this.codes[1] = LiteGraph.EMPTY_CODE;
        this.codes[2] = LiteGraph.EMPTY_CODE;
        this.codes[3] = LiteGraph.EMPTY_CODE;
        this.codes[4] = LiteGraph.EMPTY_CODE;
        this.codes[5] = LiteGraph.EMPTY_CODE;
    }

}

LGraphTexture.prototype.onGetNullCode = function(slot)
{
    if(slot == 0) {
        var code = this.uvs_piece.getCode( {order:this.order-1});
        return code;
    }

}

LGraphTexture.loadTextureCallback = function(name, url)
{
    function callback(tex){
        LGraphTexture.configTexture(tex);
        LiteGraph.dispatchEvent("graphCanvasChange", null, null);
    }
    tex = gl.textures[ name ] = GL.Texture.fromURL(url, {}, callback);
    return tex;
}

LGraphTexture.configTexture = function(tex)
{
    tex.bind();
    if(GL.isPowerOfTwo(tex.width) && GL.isPowerOfTwo(tex.height)){
        gl.generateMipmap(tex.texture_type);
        tex.has_mipmaps = true;
        tex.minFilter = gl.LINEAR_MIPMAP_LINEAR;
        tex.wrapS = gl.REPEAT;
        tex.wrapT = gl.REPEAT;
    }

    gl.texParameteri(tex.texture_type, gl.TEXTURE_MIN_FILTER, tex.minFilter );
    gl.texParameteri(tex.texture_type, gl.TEXTURE_WRAP_S, tex.wrapS );
    gl.texParameteri(tex.texture_type, gl.TEXTURE_WRAP_T, tex.wrapT );
    gl.bindTexture(tex.texture_type, null); //disable
}


LiteGraph.registerNodeType("texture/"+LGraphTexture.title, LGraphTexture );
window.LGraphTexture = LGraphTexture;
