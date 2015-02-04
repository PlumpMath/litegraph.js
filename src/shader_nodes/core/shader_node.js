/**
 * Created by vik on 21/01/2015.
 */


function LGraphShader()
{

    this.addInput("color","vec4", {vec4:1});
    this.addInput("normal","vec3", {vec3:1});
    this.addInput("world position offset","vec3", {vec3:1});

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

    var empty_code = new CodePiece();

    var color_code = this.getInputCode(0) || empty_code; // 0 it's the color
    var normal_code = this.getInputCode(1) || empty_code; // 1 it's the normal
    var world_offset_code = this.getInputCode(2) || empty_code; // 1 it's the normal

    var shader = this.shader_piece.createShader(color_code,normal_code,world_offset_code);
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