function LGraph2ParamNode()
{
    this.addOutput("Result","", this.getOutputTypes(), this.getOutputExtraInfo() );
    this.addInput("A","", this.getInputTypesA(), this.getInputExtraInfoA());
    this.addInput("B","", this.getInputTypesB(), this.getInputExtraInfoB());
    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()];

}

LGraph2ParamNode.prototype.constructor = LGraph2ParamNode;


LGraph2ParamNode.prototype.onExecute = function()
{
    this.processNodePath();
}

LGraph2ParamNode.prototype.processNodePath = function()
{
    var input1 = this.getInputNodePath(0);
    var input2 = this.getInputNodePath(1);
    var input = input1.concat(input2);
    input.push(this);
    this.node_path[0] = input;
}


LGraph2ParamNode.prototype.processInputCode = function(scope)
{
    var output_code = LiteGraph.EMPTY_CODE;

    var code_A = this.getInputCode(0) || this.onGetNullCode(0, scope);
    var code_B = this.getInputCode(1) || this.onGetNullCode(1 , scope);
    if(code_A && code_B){
        // (out_var, a, b, c, scope, out_type)
        output_code = this.codes[0] = this.shader_piece.getCode( this.getCodeName()+"_"+this.id,
            code_A.getOutputVar(),
            code_B.getOutputVar(),
            scope,
            this.getOutputType()); // output var must be fragment
        // if the alpha is an input, otherwise hardcoded
        output_code.setOrder(this.order);
        output_code.merge(code_A);
        output_code.merge(code_B);
    }

}

LGraph2ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types ? this.output_types :  this.T_types;
}

LGraph2ParamNode.prototype.getInputTypesA = function()
{
    return this.intput_typesA ? this.intput_typesA :  this.T_types;
}

LGraph2ParamNode.prototype.getInputTypesB = function()
{
    return this.intput_typesB ? this.intput_typesB :  this.T_types;
}


LGraph2ParamNode.prototype.getOutputType = function()
{
    var obj = this.output_types ? this.output_types :  this.T_types;
    return Object.keys(obj)[0];
}

LGraph2ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph2ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}

LGraph2ParamNode.prototype.getInputExtraInfoA = function()
{
    return this.in_extra_infoA;
}

LGraph2ParamNode.prototype.getInputExtraInfoB = function()
{
    return this.in_extra_infoB;
}


LGraph2ParamNode.prototype.getOutputExtraInfo = function()
{
    return this.out_extra_info;
}


//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);

