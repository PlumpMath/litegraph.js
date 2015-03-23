
//Constant
function LGraphConstColor()
{
    this.addOutput("color","vec4", {vec4:1});
    this.properties = { color:"#ffffff"};
    this.editable = { property:"value", type:"vec3" };

    this.shader_piece = new PConstant("vec3"); // hardcoded for testing
}

LGraphConstColor.title = "Color";
LGraphConstColor.desc = "Constant color";


LGraphConstColor.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode("vec3_"+this.id, this.valueToString(), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;
}

LGraphConstColor.prototype.onDrawBackground = function(ctx)
{

}

LGraphConstColor.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode("vec3_"+this.id, this.hexToColor(), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;
}



LGraphConstColor.prototype.hexToColor = function()
{
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    };
    var color = hexToRgb(this.properties["color"]);
    return "vec3("+(color[0]/255).toFixed(3)+","+(color[1]/255).toFixed(3)+","+(color[2]/255).toFixed(3)+")";
}



LiteGraph.registerNodeType("constants/"+LGraphConstColor.title, LGraphConstColor);
