/**
 * Created by vik on 21/01/2015.
 */


function LGraphShader()
{

    this.addInput("Base color","vec4");
    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };
    this.size = [200,200];
    this.shader_piece = ShaderConstructor;
}

LGraphShader.title = "ShaderMain";
LGraphShader.desc = "Shader Main Node";


LGraphShader.prototype.setValue = function(v)
{

};

LGraphShader.prototype.onExecute = function()
{
    this.processInputCode();

}

LGraphShader.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    //this.outputs[0].label = this.properties["value"].toFixed(3);
}

LGraphShader.prototype.onWidget = function(e,widget)
{

}


LGraphShader.prototype.processInputCode = function() {

    var input_code = this.getInputCode(0); // 0 it's the color

    var shader = this.shader_piece.createShader(input_code, "");
    this.graph.shader_output = shader;
    var texture_nodes = this.graph.findNodesByType("texture/textureSample");// we need to find all the textures used in the graph
    this.graph.shader_textures = [];
    // we set all the names in one array
    // useful to render nodes
    for(var i = 0; i < texture_nodes.length; ++i){
        this.graph.shader_textures.push(texture_nodes[i].properties.name);
    }
}



LiteGraph.registerNodeType("core/ShaderNode",LGraphShader);