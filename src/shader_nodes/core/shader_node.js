/**
 * Created by vik on 21/01/2015.
 */


function LGraphShader()
{
    this.uninstantiable = true;
    this.clonable = false;
    this.addInput("albedo","vec3", {vec3:1, vec4:1});
    this.addInput("normal","vec3", {vec3:1, vec4:1}); // tangent space normal, if written
    this.addInput("emission","vec3", {vec3:1, vec4:1});
    this.addInput("specular","float", {float:1}); // specular power in 0..1 range
    this.addInput("gloss","float", {float:1});
    this.addInput("alpha","float", {float:1});
    this.addInput("alpha clip","float", {float:1});
    this.addInput("refraction","float", {float:1});
    this.addInput("vertex offset","float", {float:1});


    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
//    this.properties = { color:"#ffffff",
//                        gloss:4.0,
//                        displacement_factor:1.0,
//                        light_dir_x: 1.0,
//                        light_dir_y: 1.0,
//                        light_dir_z: 1.0
//    };

//    this.options = {
//        gloss:{step:0.01},
//        displacement_factor:{step:0.01},
//        light_dir_x:{min:-1, max:1, step:0.01},
//        light_dir_y:{min:-1, max:1, step:0.01},
//        light_dir_z:{min:-1, max:1, step:0.01}
//    };

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

LGraphShader.prototype.sortPathByOrder = function (map)
{
    var tupleArray = [];
    for (var key in map) tupleArray.push([key, map[key]]);
    tupleArray.sort(function (a, b) { return a[1].order - b[1].order });
    return tupleArray;
}

LGraphShader.prototype.getFullCode = function(slot, scope, modifier) {
    CodePiece.ORDER_MODIFIER = modifier;
    var path = this.getInputNodePath(slot);
    var sorted_map = this.sortPathByOrder(path);
    for(var i = 0; i < sorted_map.length; ++i){
        var node = sorted_map[i][1];
        if (node != this)
            node.processInputCode(scope);
    }
    var code = this.getInputCode(slot) || LiteGraph.EMPTY_CODE; // 0 it's the color
    return code;
}

LGraphShader.prototype.processInputCode = function() {

    var color_code = this.getFullCode(0, CodePiece.FRAGMENT, 0);
    var normal_code = this.getFullCode(1, CodePiece.FRAGMENT, 1000);
    if(normal_code.getOutputVar()) normal_code.fragment.setBody("normal = normalize("+normal_code.getOutputVar()+".xyz);\n", -5);
    var emission_code = this.getFullCode(2, CodePiece.FRAGMENT,0);
    var specular_code = this.getFullCode(3, CodePiece.FRAGMENT,0);
    var gloss_code = this.getFullCode(4, CodePiece.FRAGMENT,0);
    var alpha_code = this.getFullCode(5, CodePiece.FRAGMENT,0);
    var alphaclip_code = this.getFullCode(6, CodePiece.FRAGMENT,0);
    var refraction_code = this.getFullCode(7, CodePiece.FRAGMENT,0);
    var world_offset_code = this.getFullCode(8, CodePiece.VERTEX,0);



    var shader = this.shader_piece.createShader(this.graph.scene_properties ,color_code,normal_code,emission_code,specular_code,gloss_code,alpha_code,alphaclip_code,refraction_code, world_offset_code);

    var texture_nodes = this.graph.findNodesByType("texture/"+LGraphTexture.title);// we need to find all the textures used in the graph
    var shader_textures = [];
    var shader_cubemaps = [];
    // we set all the names in one array
    // useful to render nodes
    for(var i = 0; i < texture_nodes.length; ++i){
        shader_textures.push(texture_nodes[i].properties.name);
    }
    texture_nodes = this.graph.findNodesByType("texture/"+LGraphCubemap.title);// we need to find all the textures used in the graph
    for(var i = 0; i < texture_nodes.length; ++i){
        shader_cubemaps.push(texture_nodes[i].properties.name);
    }

    shader.cubemaps = shader_cubemaps;
    shader.textures = shader_textures;
    shader.globals = this.graph.globals;
    this.graph.shader_output = shader;

}



LiteGraph.registerNodeType("core/"+ LGraphShader.title ,LGraphShader);