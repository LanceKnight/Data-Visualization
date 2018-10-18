var global_cushion_scale = 0.07; 
count = 0
// compute depths, concatenate package names, leaf determination, accumulate sizes...
function preprocess_tree(node, concat_names, depth)  {
	node.full_name = depth==0 ? node.name : concat_names+'.'+node.name;
	node.depth = depth+1;
	if(node.depth == 1)
		node.box = {ll:[0,0], ur:[1,1]};

	if('children' in node)  {
		node.is_leaf = false;
		node.value = 0;
		for(var c = 0; c < node.children.length; c++)  {
			node.children[c].parent = node;
			preprocess_tree(node.children[c], node.full_name, node.depth);
		}
	}
	else  {
		node.is_leaf = true;
		node.value = +node.value;
		node.children = [];
	}
}

function plot_it()  {
	// preprocess the tree
	preprocess_tree(flare_data, '', 0);

	// setup svg element
	var width = 750, height = 750;
	var pad = 80;
	
	actual_width = width -2*pad, actual_height = actual_width;

	d3.select('body').append('svg').attr('width',width).attr('height',height);
	d3.selectAll('svg').append('g').attr('width',actual_width).attr('height',actual_height).attr('transform','translate('+pad+','+pad+')').attr('id','plot')

	// do treemap!
	test_data = {name:'test1',depth:1,children:[
												{name:'test11',depth:2,children:[
																				{name:'test111',depth:3,children:[]},
																				{name:'test112',depth:3,children:[]},
																				{name:'test113',depth:3,children:[]}
																				]
												},
												{name:'test12',depth:2,children:[
																				{name:'test121',depth:3,children:[]},
																				{name:'test122',depth:3,children:[]}
																				]
												}
											   ]
	}
	data = test_data	

	get_value(flare_data)

	construct_tree(data, 0, 0, actual_width, actual_height)

	d3.selectAll('#plot').selectAll('x').data([data]).enter().append('rect')	
															.attr('opacity',0.3)
															.attr('fill','white')
															.attr('stroke', 'black')
															.attr('x',d=>d.x)
															.attr('y',d=>d.y)
															.attr('width', d=>d.w)
															.attr('height', d=>d.h)
																																


	draw_tree(test_data.children,0,0, actual_width, actual_height)

	d3.select('svg').on('wheel', function(){
										direction = d3.event.wheelDelta
										console.log('zoomed:',direction)

										if(direction>0){
												if(global_cushion_scale<1)
													global_cushion_scale+=0.1
												update_tree(test_data.children, 0,0, actual_width, actual_height)	
													

										}	

	})

}

function get_value(node){
	var sum = 0
	console.log('name: ', node.name)
	if(node.is_leaf == false){
		for(var i =0;i<node.children.length;i++){
			console.log('i:',i)	
			value = get_value(node.children[i])
			console.log('value:',value)
			sum +=value
		}
		return sum
	}
	else{
		return node.value;
	}
}


function draw_tree(node_array){
	d3.select('svg').selectAll('x').data(node_array).append('rect')
													.attr('x', d=>d.x)	
													.attr('y', d=>d.y)
													.attr('width', d=>d.w)
													.attr('height', d=>d.h)
													.each(function(d){
														if(d.children.length>0){

															draw_tree(d.children);
														}
													})

}

function construct_tree(node, x, y, w, h){
	node['x'] = x
	node['y'] = y
	node['w'] = w
	node['h'] = h	

	
	if(node.children.length >0){
		num = node.children.length
		var rect_pad = d3.min([w,h])*	global_cushion_scale
		sub_x = x+rect_pad
		sub_y = y+rect_pad
		var sub_width = (w-(num+1)*rect_pad)/num
		var sub_height = (h-2*rect_pad)

		for(i =0; i<node.children.length; i++){
			construct_tree(node.children[i], sub_x, sub_y, sub_width, sub_height)
		}
	
	}

}
