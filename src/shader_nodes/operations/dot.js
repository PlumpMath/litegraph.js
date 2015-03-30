require('./operation');


function LGraphDot()
{
    this._ctor(LGraphDot.title);
    this.code_name = "dot";
    LGraphOperation.call( this);

    this.output_types = {float:1};
}


LGraphDot.title = "Dot";
LGraphDot.desc = "Dot product the inputs";


LiteGraph.extendClass(LGraphDot,LGraphOperation);
LiteGraph.registerNodeType("operations/"+LGraphDot.title, LGraphDot);

