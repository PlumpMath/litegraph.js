
require('1param_node');

function LGraphFrac()
{
    this.code_name = "fract";
    this.output_types = {vec2:1, float:1, vec3:1, vec4:1 };
    this.intput_types = { vec2:1, float:1, vec3:1, vec4:1};
    this.output_type = "vec2";

    LGraph1ParamNode.call( this);
    console.log(this);
}

LGraphFrac.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity
LGraphFrac.prototype.constructor = LGraphSin;

LGraphFrac.title = "Fract";
LGraphFrac.desc = "fract of input";


LiteGraph.extendClass(LGraphFrac,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphFrac.title, LGraphFrac);

