/**
 * Created by vik on 21/01/2015.
 */


function LGraphShader()
{
    this.uninstantiable = true;
    this.addInput("albedo","vec3", {vec3:1});
    this.addInput("normal","vec3", {vec3:1}); // tangent space normal, if written
    this.addInput("emission","vec3", {vec3:1});
    this.addInput("specular","float", {float:1}); // specular power in 0..1 range
    this.addInput("gloss","float", {float:1});
    this.addInput("alpha","float", {float:1});
    this.addInput("displacement","vec3", {vec3:1});


    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
    this.size = [125,250];
    this.shader_piece = ShaderConstructor;
}

LGraphShader.title = "Output";
LGraphShader.desc = "Output Main Node";


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

    var color_code = this.getInputCode(0) || LiteGraph.EMPTY_CODE; // 0 it's the color
    var normal_code = this.getInputCode(1) || LiteGraph.EMPTY_CODE; // 1 it's the normal
    var emission_code = this.getInputCode(2) || LiteGraph.EMPTY_CODE; // 2 it's the emission
    var specular_code = this.getInputCode(3) || LiteGraph.EMPTY_CODE; // 3 it's the specular
    var gloss_code = this.getInputCode(4) || LiteGraph.EMPTY_CODE; //  4 it's the gloss
    var alpha_code = this.getInputCode(5) || LiteGraph.EMPTY_CODE; //  5 it's the alpha
    var world_offset_code = this.getInputCode(6) || LiteGraph.EMPTY_CODE; // 1 it's the position offset

    var shader = this.shader_piece.createShader(color_code,normal_code,emission_code,specular_code,gloss_code,alpha_code,world_offset_code);
    this.graph.shader_output = shader;
    var texture_nodes = this.graph.findNodesByType("texture/"+LGraphTexture.title);// we need to find all the textures used in the graph
    this.graph.shader_textures = [];
    // we set all the names in one array
    // useful to render nodes
    for(var i = 0; i < texture_nodes.length; ++i){
        this.graph.shader_textures.push(texture_nodes[i].properties.name);
    }
    texture_nodes = this.graph.findNodesByType("texture/"+LGraphCubemap.title);// we need to find all the textures used in the graph
    for(var i = 0; i < texture_nodes.length; ++i){
        this.graph.shader_textures.push(texture_nodes[i].properties.name);
    }


}



LiteGraph.registerNodeType("core/"+ LGraphShader.title ,LGraphShader);