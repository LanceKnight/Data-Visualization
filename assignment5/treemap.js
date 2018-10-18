var global_cushion_scale = 0.00; 
text_opacity = 0.2
font_factor = 80
error = false
scale_step = 0.01
// compute depths, concatenate package names, leaf determination, accumulate sizes...
function preprocess_tree(node, concat_names, depth)  {
	node.full_name = depth==0 ? node.name : concat_names+'-'+node.name;
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
	//data = test_data	
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
															.attr('id',d=>d.name)																	
	d3.selectAll('#plot').selectAll('x').data([data], d=>d.name).enter().append('text')
															.attr('opacity', 0)	
															.text(d=>d.name)
															.attr('x', d=>d.x+d.w/2)
															.attr('y', d=>d.y+d.h/2)
															.attr('style', d=>'font-size:'+1/d.depth * font_factor+"px;stroke-width:8")
															.attr('alignment-baseline','centeral')
															.attr('text-anchor', 'middle')
	draw_tree(data.children,0,0, actual_width, actual_height)

	d3.select('svg').on('wheel', function(){
										direction = d3.event.wheelDelta
										console.log('zoomed:',direction)

										if(direction>0){
												if(global_cushion_scale<0.5-scale_step)
													global_cushion_scale+=scale_step
											
												console.log('scale:',global_cushion_scale)	
												construct_tree(data, 0, 0, actual_width, actual_height)

												update_tree(data.children)	
													

										}
										else{

												if(global_cushion_scale>=scale_step)
													global_cushion_scale-=scale_step
												else
													global_cushion_scale=0
												console.log('scale:',global_cushion_scale)	
												construct_tree(data, 0, 0, actual_width, actual_height)

												update_tree(data.children)	
													
										}	

	})
//	d3.select('svg').append('rect').attr('fill','white').attr('text-anchor', 'middle').text('test').attr('x',0).attr('y',0).attr('width',100).attr('height',100).attr('stroke','black')
	d3.selectAll('rect').on('mouseover', function(d){
				console.log(d)
				array = []
				get_parent(d, array)
				console.log(array)
				d3.selectAll('text').data(array, d=>d.name)
									.attr('opacity', d=>d.depth*text_opacity)

											//	.attr('opacity', 0)
												.text(d=>d.name)
												.attr('x', d=>d.x+d.w/2)
												.attr('y', d=>d.y+d.h/2)
												.attr('style', d=>'font-size:'+1/d.depth * font_factor+"px")
												.attr('text-anchor','middle')
												.attr('alignment-baseline','centeral')


									.exit()
									.attr('x',0)
									.attr('y',0)	


	}).on('mouseout',function(){
		d3.selectAll('text').attr('opacity',0)
	})
	
	d3.selectAll('text').on('mouseover', function(d){
				console.log(d)
				array = []
				get_parent(d, array)
				console.log(array)
				d3.selectAll('text').data(array, d=>d.name)
									.attr('opacity', d=>d.depth*text_opacity)

											//	.attr('opacity', 0)
												.text(d=>d.name)
												.attr('x', d=>d.x+d.w/2)
												.attr('y', d=>d.y+d.h/2)
												.attr('style', d=>'font-size:'+1/d.depth * font_factor+"px")
												.attr('text-anchor','middle')
												.attr('alignment-baseline','centeral')


									.exit()
									.attr('x',0)
									.attr('y',0)	


	}).on('mouseout',function(){
		d3.selectAll('text').attr('opacity',0)
	})
	
	

}

function get_parent(node, array){
	array.push(node)
	if(node.parent != undefined){
		get_parent(node.parent, array)
	}

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
													.attr('class', d=>d.parent.full_name)
													.attr('id', d=>d.name)
													.attr('opacity', 0.3)
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

	d3.select('#plot').selectAll('x').data(node_array, d=>d.name).enter().append('text')
//													.attr('opacity', 0)
//													.text(d=>d.name)
//													.attr('x', d=>d.x+d.w/2)
//													.attr('y', d=>d.y+d.h/2)
//													.attr('style', d=>'font-size:'+1/d.depth * font_factor+"px")
//													.attr('text-anchor','middle')
//													.attr('alignment-baseline','centeral')

}

function update_tree(node_array){
	//console.log(node_array)
	//console.log('class:','.'+node_array[0].parent.full_name)
	d3.select('#plot').selectAll('.'+node_array[0].parent.full_name).data(node_array)			
													.attr('opacity',0.3)
													.attr('fill','white')
													.attr('stroke', 'black')
													.attr('x', d=>d.x)	
													.attr('y', d=>d.y)
													.attr('width', d=>d.w)
													.attr('height', d=>d.h)
													.each(function(d){
														if(d.children.length>0){

															update_tree(d.children);
														}
													})


	d3.select('#plot').selectAll('text').data(node_array, d => d.name)			

													.attr('x', d=>d.x+d.w/2)
													.attr('y', d=>d.y+d.h/2)

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
