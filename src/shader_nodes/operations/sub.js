require('./operation');


function LGraphSubOp()
{
    this._ctor(LGraphSubOp.title);

    this.code_name = "sub";

    LGraphOperation.call( this);
}
LGraphSubOp.prototype = Object.create(LGraphOperation);
LGraphSubOp.prototype.constructor = LGraphSubOp;

LGraphSubOp.title = "Sub";
LGraphSubOp.desc = "Substraction of the inputs";



LiteGraph.extendClass(LGraphSubOp,LGraphOperation);
LiteGraph.registerNodeType("operations/"+LGraphSubOp.title, LGraphSubOp);

