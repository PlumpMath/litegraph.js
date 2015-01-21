/**
 * Created by vik on 21/01/2015.
 */


function FinalOutput()
{

    this.addInput("Base color","vec4");
    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };
    this.size = [200,200];
}

FinalOutput.title = "Final Output";
FinalOutput.desc = "Final output";


FinalOutput.prototype.setValue = function(v)
{
    if( typeof(v) == "string") v = parseFloat(v);
    this.properties["value"] = v;
    this.setDirtyCanvas(true);
};

FinalOutput.prototype.onExecute = function()
{

}

FinalOutput.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    //this.outputs[0].label = this.properties["value"].toFixed(3);
}

FinalOutput.prototype.onWidget = function(e,widget)
{

}



LiteGraph.registerNodeType("core/FinalOutput",FinalOutput);