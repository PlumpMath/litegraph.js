

declare(LGraph1ParamNode);

function LGraph1ParamNode()
{
    this.addOutput("result","notype", this.getOutputTypes(), this.getOutputExtraInfo() );
    this.addInput("A","notype", this.getInputTypes(), this.getInputExtraInfo());


    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()]; // hardcoded for testing

    console.log(this);
}

LGraph1ParamNode.prototype.constructor = LGraph1ParamNode;

LGraph1ParamNode.inherit =  function(base_class){
    if(base_class.prototype) //is a class
        for(var i in LGraph1ParamNode.prototype)
            if(!base_class.prototype[i])
                base_class.prototype[i] = LGraph1ParamNode.prototype[i];

}

//LGraph1ParamNode.title = "ReflectVector";
//LGraph1ParamNode.desc = "To reflect a vector3";


LGraph1ParamNode.prototype.onExecute = function()
{
    this.processInputCode();
}


LGraph1ParamNode.prototype.processInputCode = function()
{

    var code_A = this.getInputCode(0); // normal

    if(code_A){
        // (output, incident, normal)
        var output_code = this.codes[0] = this.shader_piece.getCode(this.getCodeName()+"_"+this.id, code_A.getOutputVar(), this.getScope(), this.getOutputType()); // output var must be fragment

        output_code.merge(code_A);
    }

}


LGraph1ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types;
}

LGraph1ParamNode.prototype.getInputTypes = function()
{
    return this.intput_types;
}

LGraph1ParamNode.prototype.getOutputType = function()
{
    return this.output_type;
}

LGraph1ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph1ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}

LGraph1ParamNode.prototype.getInputExtraInfo = function()
{
    return this.in_extra_info;
}

LGraph1ParamNode.prototype.getOutputExtraInfo = function()
{
    return this.out_extra_info;
}

//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);

