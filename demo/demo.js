
function demo()
{
	multiConnection();
}

function multiConnection()
{
    graph.loadFromURL("graphs/graph.json");
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