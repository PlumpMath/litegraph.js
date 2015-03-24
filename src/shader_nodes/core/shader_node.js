/**
 * Created by vik on 21/01/2015.
 */


function LGraphShader()
{
    this.uninstantiable = true;
    this.addInput("albedo","vec3", {vec3:1, vec4:1});
    this.addInput("normal","vec3", {vec3:1, vec4:1}); // tangent space normal, if written
    this.addInput("emission","vec3", {vec3:1, vec4:1});
    this.addInput("specular","float", {float:1}); // specular power in 0..1 range
    this.addInput("gloss","float", {float:1});
    this.addInput("alpha","float", {float:1});
    this.addInput("displacement","vec3", {vec3:1, vec4:1});


    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
    this.properties = { color:"#ffffff",
                        gloss:4.0,
                        displacement_factor:1.0,
                        light_dir_x: 1.0,
                        light_dir_y: 1.0,
                        light_dir_z: 1.0
    };

    this.options = {
        gloss:{step:0.01},
        displacement_factor:{step:0.01},
        light_dir_x:{min:-1, max:1, step:0.01},
        light_dir_y:{min:-1, max:1, step:0.01},
        light_dir_z:{min:-1, max:1, step:0.01}
    };

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

LGraphShader.prototype.getFullCode = function(slot, scope) {
    var path = this.getInputNodePath(slot);
    for(var i = 0; i < path.length; ++i){
        path[i].processInputCode(scope);
    }
    var code = this.getInputCode(slot) || LiteGraph.EMPTY_CODE; // 0 it's the color
    return code;
}

LGraphShader.prototype.processInputCode = function() {

    var color_code = this.getFullCode(0, CodePiece.FRAGMENT);
    var normal_code = this.getFullCode(1, CodePiece.FRAGMENT);
    var emission_code = this.getFullCode(2, CodePiece.FRAGMENT);
    var specular_code = this.getFullCode(3, CodePiece.FRAGMENT);
    var gloss_code = this.getFullCode(4, CodePiece.FRAGMENT);
    var alpha_code = this.getFullCode(5, CodePiece.FRAGMENT);
    var world_offset_code = this.getFullCode(6, CodePiece.VERTEX);



    var shader = this.shader_piece.createShader(this.properties ,color_code,normal_code,emission_code,specular_code,gloss_code,alpha_code,world_offset_code);
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