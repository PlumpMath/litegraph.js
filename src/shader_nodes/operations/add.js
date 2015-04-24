require('./operation');


function LGraphAddOp()
{
    this._ctor(LGraphAddOp.title);

    this.code_name = "add";

    LGraphOperation.call( this);
}
LGraphAddOp.prototype = Object.create(LGraphOperation);
LGraphAddOp.prototype.constructor = LGraphAddOp;

LGraphAddOp.title = "Add";
LGraphAddOp.desc = "Add the inputs";



LiteGraph.extendClass(LGraphAddOp,LGraphOperation);
LiteGraph.registerNodeType("math/"+LGraphAddOp.title, LGraphAddOp);

