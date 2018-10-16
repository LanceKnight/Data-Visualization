var global_cushion_scale = 0.0; 
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
	var rect_pad = 10
	actual_width = width -2*pad, actual_height = actual_width;

	d3.select('body').append('svg').attr('width',width).attr('height',height);
	d3.selectAll('svg').append('g').attr('width',actual_width).attr('height',actual_height).attr('transform','translate('+pad+','+pad+')').attr('id','plot')

	//d3.select('#plot').append('rect').attr('x',3).attr('y',4).attr('width',30).attr('height',40)
	// do treemap!
	test_data = {name:'test1',children:[
																		{name:'test11',children:[
																														{name:'test111',children:[]},
																														{name:'test112',children:[]},
																														{name:'test113',children:[]}
																														]
																		},
																		{name:'test12',children:[

																														{name:'test121',children:[]},
																														{name:'test122',children:[]}
																		
																														]
																		}
																		]
							}
	
	
	draw_tree([flare_data],0,0, actual_width, actual_height)
}



function draw_tree(node_array, x, y, w, h){
	
	var num = node_array.length	
	var step = w/num
	var sub_x = x
	var sub_y = y
	d3.selectAll('#plot').selectAll('x').data(node_array).enter()//.append('g').attr('id',d=>d.name)
																																.append('rect')
																																.attr('id', d=>d.name+'_'+count)
																												//				.attr('y', d=>{x+step;return y})
																												//				.attr('width',step)
																												//				.attr('height',h)
																																.attr('opacity',0.3)
																																.attr('fill','white')
																																.attr('stroke', 'black')
																																.each(function (d){
														console.log('name:',d.name)
														d3.select(this).attr('x',sub_x)
																						.attr('y',sub_y)
																						.attr('width',step)
																						.attr('height',h)	
														
														
														if(d.children.length>0){								
															draw_tree(d.children, sub_x, sub_y, step, h)
														}
													
														sub_x = sub_x + step

																																})


//	if((num = node[0].children.length) !=0){
//			
//			sub_w = w/num
//			sub_h = h
//			x = 0
//			y = 0
//			console.log('sub_w:', sub_w)
//			draw_tree(node.children,x,y,sub_w,sub_h)
	//		for(var i =0; i<num;i++){
	//			console.log(node[0].children[i])
	//			console.log(draw_tree([node[0].children[i]],x,y,sub_w,sub_h))
	//			x = x+sub_w

	//		}
		
//	}
//	return 0

	


}
