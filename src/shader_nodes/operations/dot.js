require('./operation');


function LGraphDot()
{
    this._ctor(LGraphDot.title);
    this.code_name = "dot";
    this.output_types = {float:1};
    this.out_extra_info = {};
    LGraphOperation.call( this);


}


LGraphDot.title = "Dot";
LGraphDot.desc = "Dot product the inputs";


LiteGraph.extendClass(LGraphDot,LGraphOperation);
LiteGraph.registerNodeType("math/"+LGraphDot.title, LGraphDot);

