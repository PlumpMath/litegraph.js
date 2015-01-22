/**
 * Created by vik on 21/01/2015.
 */


function ShaderNode()
{

    this.addInput("Base color","vec4");
    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };
    this.size = [200,200];
}

ShaderNode.title = "ShaderNode";
ShaderNode.desc = "ShaderNode";


ShaderNode.prototype.setValue = function(v)
{

};

ShaderNode.prototype.onExecute = function()
{

}

ShaderNode.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    //this.outputs[0].label = this.properties["value"].toFixed(3);
}

ShaderNode.prototype.onWidget = function(e,widget)
{

}



LiteGraph.registerNodeType("core/ShaderNode",ShaderNode);