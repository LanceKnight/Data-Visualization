// NOTE: these global variables will be constructed in plot_it!
var x_scale, y_scale, line_scale;
var actual_width, actual_height;

// data type conversions, so we are working with floats and dates
function data_type_conversion(node)  {
	if(node.children.length > 0)  {
		for(var c = 0; c < node.children.length; c++)
			data_type_conversion(node.children[c]);
		return;
	}

	var time_parser = is_music_time_series ? d3.timeParse('%Y-%m-%d') : d3.timeParse('%Y %B');
	node.counts.forEach(function(d)  {
		d.date = time_parser(d.date);
		d.count = +d.count;
	});
}

// add a 'parent' field to each node, so we can access parent data
function add_parent_links(node)  {
	for(var c = 0; c < node.children.length; c++)  {
		node.children[c].parent = node;
		add_parent_links(node.children[c]);
	}
}

// go through all nodes and collect count data
function get_all_count_data(node, all_count_data)  {
	for(var p = 0; p < node.counts.length; p++)
		all_count_data.push(node.counts[p].count);
	for(var c = 0; c < node.children.length; c++)
		get_all_count_data(node.children[c], all_count_data);
}

// create a color for each node based on the tree hierarchy (this is manually coded up: categorical colors for many categories is really tricky!)
function create_color(root_node)  {
	// black color for root
	root_node.color = d3.rgb(0,0,0);
	var hue_scale = d3.scaleLinear().domain([0,root_node.children.length-1]).range([10,250])
	for(var c = 0; c < root_node.children.length; c++)  {
		var child_node = root_node.children[c];
		var interpolator = d3.interpolateLab(d3.hsl(hue_scale(c),0.8,0.3), d3.hsl(hue_scale(c),0.8,0.8))
		child_node.color = interpolator(0.5);
		for(var d = 0; d < child_node.children.length; d++)
			child_node.children[d].color = interpolator(d / (child_node.children.length-1));
	}
}

// TODO: create a time series for each non-leaf node (`counts`) that aggregates its count data and dates - same format as `counts` in leaves
var is_mean = false;//Change this flag to toggle between mean and sum;True for sum, False for mean.
function aggregate_counts(node)  {
	//console.log("node_name:" +node.name);
	
	if(node.children.length > 0)  {//not leave node
		node.counts = [];
		var population =0;
		var date_data = {count:population, date : ''};
		var c = 0;
		var i = 0;
		var k = 223;
		var flag = true;
		for(i=0; (flag == true) && (i< k);i++, population = 0){
			
			for(c = 0; c < node.children.length; c++){	
				
				child_counts = aggregate_counts(node.children[c]);
				if(child_counts[i] == undefined){
					flag = false
					//console.log('break');
					break;
				}
				date_child_counts = child_counts[i];
				population += date_child_counts.count;				
				date = date_child_counts.date;

			}//for loop (var c)
			if(is_mean == false)
				date_data = {count: population, date:date }	
			else
				date_data = {count:population/node.children.length, date:date}	
			if(flag != false){	
			
				node.counts.push(date_data);
				
			}
			flag = true;
		}//for loop (var i)
		
	}//if(node.children.length>0)
	
	if(node.name == 'Japan'){
	//	console.log(node);
	}	
	return node.counts//, node.counts.date];
	

}

// TODO: create/set `view_series` field to false for `node` and all of its children
function reset_node_views(node)  {
	//console.log('reset');
	node.view_series = false;
	var name = node.name

	node.name = name.replace(/\s+/g, '_');
	if (node.children.length>0){
		
		for(var i =0; i< node.children.length; i++){
		
			reset_node_views(node.children[i]);

		}
	
	}

	if(node.name == 'Japan'){
	//	console.log(node);
	}

}

// TODO: traverse tree, adding nodes where `view_series` is set to true to `node_array`
function collect_viewable_nodes(node, node_array)  {
	//console.log("collect: "+node.name+" view_series:"+node.view_series);
	if(node.view_series == true){
		//console.log(node.name);
		node_array.push(node);

	}
	if(node.children != undefined){

		if (node.children.length>0){
			
			for (var i =0; i< node.children.length; i++){

				collect_viewable_nodes(node.children[i], node_array);	

			}
		}
		
	}


}

// TODO: make `node` no longer visible, but its immediate children visible (if a child, nothing to do) - modify `view_series`!
function expand_node_view(node)  {
	if(node.children.length>0){
		node.view_series = false;
		for(var i = 0; i< node.children.length; i++){

			node.children[i].view_series = true;

		}
	}

}

// TODO: make the parent of `node` visible, but the subtree rooted at `node` should not be visible (hint `reset_node_views`) (if a parent, nothing to do) - modify `view_series`!
function collapse_node_view(node)  {
		if (node.parent!=undefined){
			
			reset_node_views(node.parent);
			node.parent.view_series = true;
		}

}

// TODO: does all of the visualization -> get the time series to view (`collect_viewable_nodes`), data join, setup interactions
function visualize_time_series(root_node, is_collapsing, selected_node)  {

		

	var node_array = [];
	if(is_collapsing == true)
		if(selected_node == undefined)
			collect_viewable_nodes(root_node, node_array);
		else
			collect_viewable_nodes(selected_node.parent, node_array);
	else{	
		if(selected_node !=undefined)
			collect_viewable_nodes(selected_node, node_array);
		else
			collect_viewable_nodes(root_node,node_array);
	}
	
	// TODO: data join for line plot
	var trans = d3.transition().duration(1000);
	if(is_collapsing == true){//collapsing
		var parent_node = selected_node.parent
		var s = d3.selectAll('#g_'+parent_node.name).selectAll('path').data(parent_node)
		s.exit().transition(trans)
			.attr('d',d=>{
					if(d == root_node){
						return line_scale(d.counts)
					}
					else
						return line_scale(d.parent.counts)
				})
			.attr('fill', 'none')
			.attr('stroke', d=>d.color)
			.attr('stroke-width', '3')
			.attr('id', d=>d.name)
			
		for(var i= 0; i<parent_node.children.length; i++){
			d3.selectAll('#g_'+parent_node.children[i].name).transition(trans).remove();
		}
		//console.log("enter:")
		//console.log(parent_node.name);
		d3.selectAll('#g_'+parent_node.name).selectAll('circle').data([parent_node]).enter().append('path')
			.attr('d', d=>line_scale(d.children[0].counts))
			.attr('stroke', d=>d.children[0].color)	
			.transition(trans)	
			.attr('d', d=>line_scale(d.counts))
			.attr('fill', 'none')
			.attr('stroke', d=>d.color)
			.attr('stroke-width', '3')
			.attr('id', d=>d.name)

	}

	else//expanding
	{
	//TODO:data join for lineplot
		if(selected_node == undefined)
			var s = d3.selectAll('#mainplot').selectAll('path').data(node_array);	
		else{
			var s = d3.selectAll('#g_'+selected_node.name).selectAll('g').data(node_array);
		}
	console.log(s)	
	//TODO: remove old series

		if((selected_node != undefined)&&(selected_node.children.length!=0))
			d3.selectAll("#"+selected_node.name).remove();	
		else
			d3.selectAll("#"+root_node.name).remove();
	// TODO: add new series

		if((selected_node == undefined)||((selected_node != undefined)&&(selected_node.children.length !=0))){
			s.enter().append('g').attr('id',d=>"g_"+d.name).append('path')
				.attr('d',d=>{
					if(d == root_node){
						return line_scale(d.counts)
					}
					else
						return line_scale(d.parent.counts)
				})
				.attr('fill', 'none')
				.attr('stroke', d=>d.color)
				.attr('stroke-width', '3')
				.attr('id', d=>d.name)
				.transition(trans)
				.attr('d',d=>line_scale(d.counts))
				.attr('fill', 'none')
				.attr('stroke', d=>d.color)
				.attr('stroke-width', '3')

		}
	}


	// TODO: setup interactions
	d3.selectAll('path')
		.on('click', function(d,i,g){
			if(is_collapsing == false){	
				expand_node_view(d)
			;}
			
			else{
				collapse_node_view(d);
			}
			console.log("clicked")	
			visualize_time_series(root_node, is_collapsing, d);
			
		})
		d3.selectAll('body').on('keydown', function(d,i,g){
			if(d3.event.keyCode === 16){
				console.log("key down");
				is_collapsing =true;
			}
		}).on('keyup',function(){
			if(d3.event.keyCode===16){
				console.log("keyup");
				is_collapsing = false
			}
		});



	// TODO: data join for text

	if(is_collapsing == false){
		
		if(selected_node != undefined)
		{
			for(var i = 0; i<selected_node.children.length;i++){	
				
				var text_s = d3.selectAll('#g_'+selected_node.children[i].name).selectAll('text').data([selected_node.children[i]]);
		
				if((selected_node != undefined)&&(selected_node.children.length!=0))
					d3.selectAll("#l_"+selected_node.name).transition(trans).attr('opacity',0).remove();	
				else
					d3.selectAll('#l_'+root_node.name).remove();

				// TODO: text labels - add new ones (fade them in via opacity)
	
				text_s.enter().append('text')
					.text(d=>d.name.replace('_', ' '))
					.attr('x',640)
					.attr('y', d=>y_scale(d.counts[d.counts.length-1].count))
					.attr('opacity',0)
					.attr('id', d=>'l_'+d.name)
					.transition(trans)
					.attr('opacity',1);
			}
		}
		else{
			var text_s = d3.selectAll('#g_'+root_node.name).selectAll('text').data(node_array)

			// TODO: text labels - remove old ones (fade them out via opacity)
		
			if((selected_node != undefined)&&(selected_node.children.length!=0))
				d3.selectAll("#l_"+selected_node.name).transition(trans).attr('opacity',0).remove();	
			else
				d3.selectAll('#l_'+root_node.name).remove();

			// TODO: text labels - add new ones (fade them in via opacity)

			text_s.enter().append('text')
				.text(d=>{
					//console.log(d.name.replace('_','k'));
					return d.name.replace('_', ' ')})
				.attr('x',640)
				.attr('y', d=>y_scale(d.counts[d.counts.length-1].count))
				
				.attr('opacity',0)
				.attr('id', d=>'l_'+d.name)
				.transition(trans)
				.attr('opacity',1);
		}
	}
	else{

		var parent_node = selected_node.parent
		var s = d3.selectAll('#g_'+parent_node.name).selectAll('text').data(parent_node)
		s.exit().transition(trans).attr('opacity',0);
			
		d3.selectAll('#g_'+parent_node.name).selectAll('circle').data([parent_node]).enter().append('text')
				.text(d=>d.name.replace('_', ' '))
				.attr('x',640)
				.attr('y', d=>y_scale(d.counts[d.counts.length-1].count))
				.attr('opacity',0)
				.attr('id', d=>'l_'+d.name)
				.transition(trans)
				.attr('opacity',1);

	}

	
}


function plot_it()  {
	// some preprocessing
	data_type_conversion(count_tree);
	add_parent_links(count_tree);
	count_tree.parent = null;
	create_color(count_tree);

	// First things first: we aggregate the time series data: non-leaf nodes should aggregate their child nodes in some sense (e.g. mean)
	aggregate_counts(count_tree);

	// Second: we initialize the nodes as to whether or not to visualize them - first, lets assume we aren't viewing any of them ...
	reset_node_views(count_tree);

	// ... and then set the root node view to be true (have to view something to start!)
	count_tree.view_series = true;
	//	count_tree.children[0].view_series = true;

	// visualization setup: width, height, padding, actual width and height
	var width = 800, height = 800;
	var pad = 80;
	actual_width = width-2*pad;
	actual_height = height-2*pad;
	// add svg element of width x height
	d3.select('body').append('svg').attr('width', width).attr('height', height);
	// add <g> transformation element to center the main plotting area by pad, assign it an id since we will be primarily selecting it
	d3.select('svg').append('g').attr('transform', 'translate('+pad+','+pad+')').attr('id', 'mainplot');
	// add <rect> element to have a nice backdrop for  our plot!
	d3.select('#mainplot').append('rect').attr('width', actual_width).attr('height', actual_height).attr('fill', '#999999').attr('opacity', 0.4)

	// TODO: setting up scales: we need to compute the minimum and maximum of our count data and dates; so first, lets get our count data from all nodes, then compute min/max
	var count_array = [];
	get_all_count_data(count_tree, count_array);
	//console.log(count_array.length);
	var min_count = d3.min(count_array), max_count = d3.max(count_array);
	
	// TODO: for the min/max of dates, they are equivalent across nodes, so just map the root node's dates to an array, compute min and max
	var date_array = [];
	for(var i = 0;i<count_tree.counts.length;i++){
		date_array.push(count_tree.counts[i].date);
	}
	//console.log(date_array);
	var min_date= d3.min(date_array), max_date = d3.max(date_array);
	
	// TODO: compute the x and y scales for the line plots
	var min_x = 0, max_x = actual_width, min_y = actual_height, max_y = 0;
	//x_scale = d3.scaleLinear().domain([min_date, max_date]).range([min_x, max_x]);
	y_scale = d3.scaleLinear().domain([min_count, max_count]).range([min_y, max_y]);

	x_scale= d3.scaleTime().domain([min_date, max_date]).range([min_x, max_x]);

	// TODO: setup the line scale
	line_scale= d3.line()
		.x(d=>x_scale(d.date))
		.y(d=>y_scale(d.count));
		
	// TODO: setup axes from the scales
	d3.select('svg').append('g').attr('id','bottomaxis').attr('transform', 'translate('+ pad +','+(min_y+pad-0)+')').call(d3.axisBottom(x_scale));
	d3.select('svg').append('g').attr('id','leftaxis').attr('transform', 'translate('+ pad +','+(pad-0)+')').call(d3.axisLeft(y_scale));
	// visualize data!
	visualize_time_series(count_tree, false);
//	console.log(count_tree);
}
