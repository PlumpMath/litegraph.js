
function demo()
{
	multiConnection();
}

function multiConnection()
{
	var node_vec = LiteGraph.createNode("texture/UVs");
    node_vec.pos = [200,200];
	graph.add(node_vec);

    var node_tex = LiteGraph.createNode("texture/textureSample");
    node_tex.pos = [400,500];
    graph.add(node_tex);

    var node_prev = LiteGraph.createNode("texture/preview");
    node_prev.pos = [1000,100];
    graph.add(node_prev);

    var node_shader = LiteGraph.createNode("core/ShaderNode");
    node_shader.pos = [1000,600];
    graph.add(node_shader);

    node_vec.connect(0,node_tex,0 );
    node_tex.connect(1,node_shader,0 );
    node_tex.connect(0,node_prev,0 );

}

function sortTest()
{
	var rand = LiteGraph.createNode("math/rand",null, {pos: [10,100] });
	graph.add(rand);

	var nodes = [];
	for(var i = 4; i >= 1; i--)
	{
		var n = LiteGraph.createNode("basic/watch",null, {pos: [i * 120,100] });
		graph.add(n);
		nodes[i-1] = n;
	}

	rand.connect(0, nodes[0], 0);

	for(var i = 0; i < nodes.length - 1; i++)
		nodes[i].connect(0,nodes[i+1], 0);
}

function benchmark()
{
	var num_nodes = 500;
	var consts = [];
	for(var i = 0; i < num_nodes; i++)
	{
		var n = LiteGraph.createNode("math/rand",null, {pos: [(2000 * Math.random())|0, (2000 * Math.random())|0] });
		graph.add(n);
		consts.push(n);
	}

	var watches = [];
	for(var i = 0; i < num_nodes; i++)
	{
		var n = LiteGraph.createNode("basic/watch",null, {pos: [(2000 * Math.random())|0, (2000 * Math.random())|0] });
		graph.add(n);
		watches.push(n);
	}

	for(var i = 0; i < num_nodes; i++)
		consts[ (Math.random() * consts.length)|0 ].connect(0, watches[ (Math.random() * watches.length)|0 ], 0 );
}