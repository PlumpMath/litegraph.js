
require('3param_node');


function LGraphMix()
{
    this._ctor(LGraphMix.title);

    this.code_name = "mix";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesC = null;
    this.in_extra_infoC = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};

    this.properties = { alpha:0.5};
    this.options = { alpha:{min:0, max:1, step:0.01}};
    this.number_piece = new PConstant("float");
    LGraph3ParamNode.call( this);
}

LGraphMix.prototype = Object.create(LGraph3ParamNode); // we inherit from Entity
LGraphMix.prototype.constructor = LGraphMix;

LGraphMix.title = "Mix";
LGraphMix.desc = "mix of input";

LGraphMix.prototype.infereTypes = function( output, target_slot) {
    var output_type = Object.keys(output.types)[0];
    if(target_slot == 2 && output_type == "float")
        return;

    this.in_conected_using_T++;
    var input = this.inputs[target_slot];
    if (input.use_t && this.in_conected_using_T == 1) {
        for (var k in output.types)
            this.T_types[k] = output.types[k];
    }
}

LGraphMix.prototype.onGetNullCode = function(slot, scope)
{
    if(slot == 2){
        var code = this.number_piece.getCode("float_"+this.id, this.properties["alpha"].toFixed(3), scope);
        code.setOrder(this.order -1);
        return code; // need to check scope;
    }

}

LGraphMix.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[2].label = "alpha";
    if(!this.isInputConnected(2))
        this.inputs[2].label += "="+this.properties["alpha"].toFixed(3);
}

LiteGraph.extendClass(LGraphMix,LGraph3ParamNode);
LiteGraph.registerNodeType("operations/"+LGraphMix.title, LGraphMix);

