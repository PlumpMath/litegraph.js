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
    var shader = this.processInputCode();

    this.graph.shader_output = shader;
    var texture_nodes = this.graph.findNodesByType("texture/textureSample");// we need to find all the textures used in the graph
    graph.shader_textures = [];
    for(var i = 0; i < texture_nodes.length; ++i){
        graph.shader_textures.push(texture_nodes[i].properties.name);
    }
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

    var nodes = this.getInputNodes();
    var node = nodes[0]; // 0 it's base color
    var input_code = node.code;
    return this.shader_piece.createShader(input_code, "");
}

//    this.code = this.shader_piece.getCode("color_"+node.id, input_code.output_var, node.id); // I need to check texture id
//
//    this.code.vertex = input_code.vertex.concat(this.code.vertex);
//    this.code.fragment = input_code.fragment.concat(this.code.fragment);
//
//    for (var inc in input_code.includes) { this.code.includes[inc] = input_code.includes[inc]; }


//var nodes = this.getInputNodes();
//for(var i = 0; i < nodes.length; ++i){
//    var node = nodes[i];
//    node.shader_piece.getCode();
//}



LiteGraph.registerNodeType("core/ShaderNode",LGraphShader);