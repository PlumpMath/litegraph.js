//UVS
function LGraphUVs()
{
    this.addOutput("UVs","vec2", {vec2:1});

    this.properties = { UTiling:1.0,
                        VTiling:1.0 };
    this.options =  this.options || {};
    this.options.is_global = {hidden:false};
    this.options = {    UTiling:{ step:0.01},
                        VTiling:{step:0.01}
    };
    this.shader_piece = PUVs; // hardcoded for testing
}

LGraphUVs.title = "TextureCoords";
LGraphUVs.desc = "Texture coordinates";

LGraphUVs.prototype.onExecute = function()
{
    //this.processNodePath();
}

//LGraphUVs.prototype.processNodePath = function()
//{
//    var input = {};
//    this.insertIntoPath(input);
//    this.node_path[0] = input;
//}

LGraphUVs.prototype.processInputCode = function(scope)
{
    this.codes[0] = this.shader_piece.getCode({order:this.order,
                                                utiling:this.properties.UTiling.toFixed(3),
                                                vtiling:this.properties.VTiling.toFixed(3),
                                                out_var:"uvs_"+this.id,
                                                scope:scope
                                                }); // I need to check texture id
}

LGraphUVs.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphUVs.prototype.setValue = function(v1,v2)
{
    this.setFloatValue(this.properties["UTiling"],v1);
    this.setFloatValue(this.properties["VTiling"],v2);
};

LiteGraph.registerNodeType("coordinates/"+LGraphUVs.title , LGraphUVs);


