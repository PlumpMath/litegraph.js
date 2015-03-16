require('2param_node');


function LGraphOperation()
{
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};

    this.number_piece = new PConstant("float"); // hardcoded when the inputs are null
    this.properties = { A:0.0, B:0.0};

    LGraph2ParamNode.call( this);
}
LGraphOperation.prototype = Object.create(LGraph2ParamNode);
LGraphOperation.prototype.constructor = LGraphOperation;



LGraphOperation.prototype.infereTypes = function( output, target_slot) {
    this.in_conected_using_T++;
    var input = this.inputs[target_slot];
    if(input.use_t && this.in_conected_using_T == 1){
        for(var k in output.types)
            this.T_types[k] = output.types[k];
    }

//    var output_type = Object.keys(output.types)[0];
//    if(target_slot == 2 && output_type == "number")
//        return;
//
//    this.in_conected_using_T++;
//    var input = this.inputs[target_slot];
//    if (input.use_t && this.in_conected_using_T == 1) {
//        for (var k in output.types)
//            this.T_types[k] = output.types[k];
//    }
}


LGraphOperation.prototype.onGetNullCode = function(slot)
{
    if(slot == 0){
        return this.number_piece.getCode("float_"+this.id, this.properties["A"].toFixed(3), CodePiece.FRAGMENT); // need to check scope;
    } else if(slot == 1){
        return this.number_piece.getCode("float_"+this.id, this.properties["B"].toFixed(3), CodePiece.FRAGMENT); // need to check scope;
    }

}

LGraphOperation.prototype.onDrawBackground = function(ctx)
{
    this.inputs[0].label = "A";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["A"].toFixed(3);

    this.inputs[1].label = "B";
    if(!this.isInputConnected(1))
        this.inputs[1].label += "="+this.properties["B"].toFixed(3);
}


LiteGraph.extendClass(LGraphOperation,LGraph2ParamNode);


