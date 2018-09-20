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
var is_mean = true;//Change this flag to toggle between mean and sum;True for sum, False for mean.
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
		var sum = []
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
			var sum = population;
			var mean = population/node.children.length;
			if(is_mean == false)
				date_data = {count: population, date:date, sum:sum}	
			else
				date_data = {count:population/node.children.length, date:date, sum:sum}	
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
var total=[];

/*
function set_up_low(root_node, node, first_time){
	if(first_time == true)
	{
		var name = node.name
		node.name = name.replace(/\s+/g, '_');
		if(node.parent!= null){
			var upper = [], lower=[]
		
		//console.log("total:"+total);			
		}
		else{
			//console.log("sum:"+node);
			for(var i = 0; i<node.counts.length;i++){
				total.push( node.counts[i].count);
			}

			//console.log("keep total:"+total);
			var upper, lower
	
			for(var i = 0; i<total.length;i++){
				upper = total[i]/2
				lower = -total[i]/2	
				node.counts[i].upper = upper;
				node.counts[i].lower = lower;
			}
		
		}
	}
	if (node.children.length>0){
			
		var array = [];
		collect_viewable_nodes(root_node, array);
		for(var k = 0; k < array.length; k++){
		//	if(node.parent!= null){
		//		node.parent.
		//	}	
		}
		for(var i =0; i< array.length; i++){
			var upper, lower;
			for(var j = 0; j <node.counts.length;j++){
				if(i==0){
					if(is_mean == false){
						upper = node.counts[j].upper;
						lower = upper-array[i].counts[j].count;	
						//console.log("upper:"+upper)
						//console.log("lower:"+lower)
						//console.log("count:"+node.counts[j].count);				
					}
					else{
						upper = node.counts[j].sum/2;
						console.log("sum:"+upper)
						lower = upper-array[i].counts[j].count;
						console.log("count:"+array[i].counts[j].count)
					}
				}
				else{
				
					if(is_mean == false){
						upper =array[i-1].counts[j].lower;
						lower =upper-array[i].counts[j].count;
			
					}
					else{

						upper = array[i-1].counts[j].lower;
						lower = upper-array[i].counts[j].count;
					}
				}

				node.children[i].counts[j].upper = upper;
				node.children[i].counts[j].lower = lower;
			}
	
			set_up_low(root_node, array[i], first_time);

		}
	
	}
}
*/

function set_up_low(root, node, first_time){
	var array = []
	collect_viewable_nodes(root, array);
	var counts_length = node.counts.length;
	var sum_array=[];
//	console.log("viewable array");
	for(var j =0; j <counts_length;j++){
		var sum =0;
		for(var k =0; k<array.length;k++){
			sum+=array[k].counts[j].count;
		}
		sum_array.push(sum);
	}
	console.log(array);
	for(var j =0; j<counts_length;j++){
		for(var k =0; k<array.length;k++){
			if(k==0){
				//console.log("sum[j]:"+sum_array[j]);
				array[k].counts[j].upper = sum_array[j]/2;
				array[k].counts[j].lower = sum_array[j]/2-array[k].counts[j].count;
			}
			else{
				array[k].counts[j].upper = array[k-1].counts[j].lower;
				array[k].counts[j].lower = array[k].counts[j].upper- array[k].counts[j].count;
			}
		}	
	}
	return sum_array;
}


function get_leaf_sum(array, sum_array){
	
//	console.log("get leaf array");
	
//	console.log(array)
	var counts_length = array[0].counts.length;
	var node;
	for(var k = 0; k<array.length; k++){
		node = array[k];
	}
		

//	if( node.children.length == 0){
//		console.log(node.name)
		for(var j =0; j <counts_length;j++){
			//console.log('here')
			if(sum_array[j]!=undefined){
				sum_array[j]+=node.counts[j].count
			//	console.log('defined 1')
			}
			else{
				sum_array[j]=node.counts[j].count;
			//	console.log('undefined 1')
			}/*
			sum += node.counts[j].count;
			if(sum_array[j]!=undefined){
				sum_array[j]=sum;
				console.log('sum_array[j] is defined')
			}
			else{
				sum_array.push(sum)
				console.log('sum_array[j] is undefined');
			}*/
//			console.log(sum_array)
		}
	
//	}
//	else{		
	array.pop();
//	console.log('before next')	
//	console.log(array)
	if(array.length!=0)	
		get_leaf_sum(array, sum_array);
		
//	}

}

// TODO: create/set `view_series` field to false for `node` and all of its children
function reset_node_views(node)  {
	//console.log('reset');
	node.view_series = false;

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

	collect_viewable_nodes(root_node, node_array);

/*
	console.log('about to change scale')
	var count_array = [];
	get_all_count_data(node_array[0], count_array, true);
	console.log(count_array[0]);
	var max = d3.max(count_array)
	var min_count = -max/2//d3.min(count_array), max_count = d3.max(count_array);
	var max_count = max/2
	console.log(max);
	y_scale = d3.scaleLinear().domain([min_count, max_count]).range([640, 0]);
	area_scale= d3.area()
		.x(d=>x_scale(d.date))
		.y0(d=>y_scale(d.lower))
		.y1(d=>y_scale(d.upper));

*/
	if(selected_node != undefined){
		var array=[];
		console.log("node array:"+node_array.length);
		for(var i = 0; i<node_array.length; i++){
			for(var j =0; j<node_array[0].counts.length;j++){
				array.push(node_array[i].counts[j].upper)	
			}
		}
		max_count = d3.max(array);
		array = []
		for(var i = 0; i<node_array.length; i++){
			for(var j =0; j<node_array[0].counts.length;j++){
				array.push(node_array[i].counts[j].lower)	
			}
		}
		min_count = d3.min(array)
		//console.log(count_array)
		//var max = d3.max(count_array)
		//console.log('max:'+max)
		//min_count = -max/2
		//max_count = max/2
		console.log(min_count);
		console.log(max_count);
	
		//var t = d3.scaleLinear().domain([0, 100]).range([640, 0]);

		var date_array = [];
		for(var i = 0;i<count_tree.counts.length;i++){
			date_array.push(count_tree.counts[i].date);
		}
		//console.log(date_array);
		var min_date= d3.min(date_array), max_date = d3.max(date_array);
	
		x_scale= d3.scaleTime().domain([min_date, max_date]).range([0, 640]);

		y_scale = d3.scaleLinear().domain([min_count, max_count]).range([640, 0]);
		area_scale= d3.area()
			.x(d=>{
				console.log('activate')
				return x_scale(d.date)

			})
			.y0(d=>y_scale(d.lower))
			.y1(d=>y_scale(d.upper));
		//console.log("scaled:"+y_scale(-2078526))
		//console.log(area_scale)
	}

	//console.log("scaled:"+y_scale(-2078526))
	var s = d3.selectAll('#mainplot').selectAll('t').data(node_array)

	d3.selectAll('path').remove()
	s.exit().remove();
	
	s.enter().append('path')
	.attr('d', d=>{

		console.log('data binding')
		return	area_scale(d.counts)

		})
	.attr('fill', d=>d.color)
	.merge(s)
	
	.attr('d', d=>area_scale(d.counts))
	.attr('fill', d=>d.color)

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
			set_up_low(root_node, root_node, false);
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
	var s_text = d3.selectAll('#mainplot').selectAll('text').data(node_array);

	s_text.exit().remove();
	s_text.enter().append('text')
		.text(d=>d.name)
		.attr('x', 640)
		.attr('y', d=>{
			var l = d.counts.length;
			var upper = d.counts[l-1].upper;
			var lower = d.counts[l-1].lower;
			return y_scale((upper+lower)/2)
		})
	.merge(s_text)
		.text(d=>d.name)
		.attr('x', 640)
		.attr('y', d=>{
			var l = d.counts.length;
			var upper = d.counts[l-1].upper;
			var lower = d.counts[l-1].lower;
			return y_scale((upper+lower)/2)
		})
}

function get_all_sum(node, array){
	for(var i =0;i<node.counts.length;i++){
//		console.log("name:"+node.name + ", sum:"+node.counts[i].sum)
		if(node.counts[i].sum != undefined)
			array.push(node.counts[i].sum);
	}
	if(node.children.length>0){
		for(var i=0;i<node.children.length;i++){
		
		//	console.log("here")
			get_all_sum(node.children[i],array);
		}	
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

	set_up_low(count_tree, count_tree);
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
	var sum;
	for(var i = 0;i<count_tree.counts.length;i++){
		count_array.push(count_tree.counts[i].count);
	}
	var max = d3.max(count_array)
	min_count = -max/2
	max_count = max/2
	//console.log(min_count);
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
		
	area_scale= d3.area()
		.x(d=>x_scale(d.date))
		.y0(d=>y_scale(d.lower))
		.y1(d=>y_scale(d.upper));
	console.log(area_scale)
	// TODO: setup axes from the scales
	d3.select('svg').append('g').attr('id','bottomaxis').attr('transform', 'translate('+ pad +','+(min_y+pad-0)+')').call(d3.axisBottom(x_scale));
//	d3.select('svg').append('g').attr('id','leftaxis').attr('transform', 'translate('+ pad +','+(pad-0)+')').call(d3.axisLeft(y_scale));
	// visualize data!
//console.log("here")
	visualize_time_series(count_tree, false);
	console.log(count_tree);
}
