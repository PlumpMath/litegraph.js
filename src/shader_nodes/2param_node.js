

declare(LGraph2ParamNode);

function LGraph2ParamNode()
{
    this.addOutput("result","vec3", this.getOutputTypes() );
    this.addInput("A","vec3", this.getInputTypes());
    this.addInput("B","vec3", this.getInputTypes());
    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()]; // hardcoded for testing

}

LGraph2ParamNode.prototype.constructor = LGraph2ParamNode;

LGraph2ParamNode.inherit =  function(base_class){
    if(base_class.prototype) //is a class
        for(var i in LGraph2ParamNode.prototype)
            if(!base_class.prototype[i])
                base_class.prototype[i] = LGraph2ParamNode.prototype[i];

}

LGraph2ParamNode.prototype.onExecute = function()
{
    this.processInputCode();
}

LGraph2ParamNode.prototype.processInputCode = function()
{

    var output_code = LiteGraph.EMPTY_CODE;

    var code_A = this.getInputCode(0);
    var code_B = this.getInputCode(1);

    if(code_A && code_B){
        // (out_var, a, b, c, scope, out_type)
        output_code = this.codes[0] = this.shader_piece.getCode( this.getCodeName()+"_"+this.id, code_A.getOutputVar(), code_B.getOutputVar(), this.getScope(), this.getOutputType()); // output var must be fragment
        // if the alpha is an input, otherwise hardcoded
        if(code_alpha){
            output_code.merge(code_alpha);
        }
        output_code.merge(code_A);
        output_code.merge(code_B);
    }




}


LGraph2ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types;
}

LGraph2ParamNode.prototype.getInputTypes = function()
{
    return this.intput_types;
}

LGraph2ParamNode.prototype.getOutputType = function()
{
    return this.output_type;
}

LGraph2ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph2ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}


//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);

