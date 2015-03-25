
require('3param_node');

function LGraphSmooth()
{
    this._ctor(LGraphSmooth.title);

    this.code_name = "smoothstep";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesC = null;
    this.in_extra_infoC = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};


    this.properties = { lower:0.0,
                        upper:1.5};

    this.number_piece = new PConstant("float");
    LGraph3ParamNode.call( this);
}

LGraphSmooth.prototype = Object.create(LGraph3ParamNode); // we inherit from Entity
LGraphSmooth.prototype.constructor = LGraphSmooth;

LGraphSmooth.title = "SmoothStep";
LGraphSmooth.desc = "smoothstep of input";

//LGraphSmooth.prototype.infereTypes = function( output, target_slot) {
//    var output_type = Object.keys(output.types)[0];
//    if(target_slot == 2 && output_type == "float")
//        return;
//
//    this.in_conected_using_T++;
//    var input = this.inputs[target_slot];
//    if (input.use_t && this.in_conected_using_T == 1) {
//        for (var k in output.types)
//            this.T_types[k] = output.types[k];
//    }
//}

LGraphSmooth.prototype.onGetNullCode = function(slot, scope)
{
    if(slot == 0){
        var code = this.number_piece.getCode("float_"+this.id+""+ slot, this.properties["lower"].toFixed(3), scope); // need to check scope;
        code.setOrder(this.order -1);
        return code;
    }
    else if(slot == 1){
        var code = this.number_piece.getCode("float_"+this.id+""+ slot, this.properties["upper"].toFixed(3), scope); // need to check scope;
        code.setOrder(this.order -1);
        return code;
    }

    return LiteGraph.EMPTY_CODE;

}

LGraphSmooth.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[0].label = "lower";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["lower"].toFixed(3);
    this.inputs[1].label = "upper";
    if(!this.isInputConnected(0))
        this.inputs[1].label += "="+this.properties["upper"].toFixed(3);
}

LiteGraph.extendClass(LGraphSmooth,LGraph3ParamNode);
LiteGraph.registerNodeType("operations/"+LGraphSmooth.title, LGraphSmooth);

