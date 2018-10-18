var global_cushion_scale = 0.03; 
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

	test_data = {name:'test1',children:[
										{name:'test11',children:[
																{name:'test111',value:3},
																{name:'test112',value:2},
																{name:'test113',value:1}
																]
										},
										{name:'test12',children:[
																{name:'test121',value:2},
																{name:'test122',value:1}
																]
										}
									   ]
	}
	data = flare_data
//	data = test_data	
	// preprocess the tree
	preprocess_tree(data, '', 0);

	get_value(data)

	// setup svg element
	var width = 750, height = 750;
	var pad = 80;
	
	actual_width = width -2*pad, actual_height = actual_width;

	d3.select('body').append('svg').attr('width',width).attr('height',height);
	d3.selectAll('svg').append('g').attr('width',actual_width).attr('height',actual_height).attr('transform','translate('+pad+','+pad+')').attr('id','plot')

	// do treemap!

	construct_tree(data, 0, 0, actual_width, actual_height)

	d3.selectAll('#plot').selectAll('x').data([data]).enter().append('rect')	
															.attr('opacity',0.3)
															.attr('fill','white')
															.attr('stroke', 'black')
															.attr('x',d=>d.x)
															.attr('y',d=>d.y)
															.attr('width', d=>d.w)
															.attr('height', d=>d.h)
																																


	draw_tree(data.children,0,0, actual_width, actual_height)

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
	//console.log('name: ', node.name)
	if(node.is_leaf == false){
		var sum = 0
		for(var i =0;i<node.children.length;i++){
			//console.log('i:',i)	
			value = get_value(node.children[i])
			//console.log('value:',value)
			sum +=value
		}
		//console.log('sum:',sum)	
		node['value'] = sum
		return sum
	}
	else{
		return node.value;
	}
}


function draw_tree(node_array){
	d3.select('#plot').selectAll('x').data(node_array).enter().append('rect')			
													.attr('opacity',0.3)
													.attr('fill','white')
													.attr('stroke', 'black')
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
		var num = node.children.length
		var rect_pad = d3.min([w,h]) * global_cushion_scale
		var sub_x = x+rect_pad
		var sub_y = y+rect_pad
		for(var i =0; i<node.children.length; i++){
			child = node.children[i]
			if(w>h){
				var sub_width = (child.value/node.value) * (w-(num+1)*rect_pad)
				var sub_height = (h-2*rect_pad)

				construct_tree(child, sub_x, sub_y, sub_width, sub_height)
				
				sub_x += (sub_width+rect_pad)
			}
			else{
				var sub_width =  (w-2*rect_pad)
			//	console.log('ratio:',child.value/node.value)
			//	console.log('whole:',(h-(num+1)*rect_pad))
				var sub_height =  (child.value/node.value) * (h-(num+1)*rect_pad)
				
				construct_tree(child, sub_x, sub_y, sub_width, sub_height)
	
				sub_y +=(sub_height+ rect_pad)
			}

		}
	
	}

}
