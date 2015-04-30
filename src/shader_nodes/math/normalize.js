
require('1param_node');

function LGraphNormnalize()
{
    this._ctor(LGraphNormnalize.title);

    this.code_name = "normalize";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    LGraph1ParamNode.call( this);
}

LGraphNormnalize.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity

LGraphNormnalize.prototype.constructor = LGraphNormnalize;

LGraphNormnalize.title = "Normalize";
LGraphNormnalize.desc = "normalize of input";


LiteGraph.extendClass(LGraphNormnalize,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphNormnalize.title, LGraphNormnalize);

