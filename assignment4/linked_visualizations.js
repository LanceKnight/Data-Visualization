var abalone_data;

// all dimensions: 'length', 'height', 'shucked weight', 'diameter', 'whole weight', 'viscera weight', 'rings'
var selected_atts = ['length', 'height', 'shucked weight', 'diameter', 'whole weight', 'viscera weight', 'rings'];
var selected_atts = ['length', 'height', 'shucked weight','diameter', 'whole weight']//this is for debugging
var num_points = 800
var num_points = 20 //debugging

function plot_it()  {
	// some data messing around-ness
	selected_atts = d3.shuffle(selected_atts);
	abalone_data = abalone_data.map(datum => {
		var filtered_datum = {};
		selected_atts.forEach(d => { filtered_datum[d] = +datum[d]; })
		return filtered_datum;
	});

	var shuffled_data = d3.shuffle(abalone_data);
	abalone_data = [];
	for(var i = 0; i < num_points; i++)
		abalone_data.push({key:i,value:shuffled_data[i]});

//my codes
		padding = 40
		height = 1000; width = 2 * height
		
		group_innerpad = 0.23
		group_height = height - padding; group_width = group_height		
		scale_group_x = d3.scaleBand().domain(selected_atts).range([0,group_width])
		scale_group_y = d3.scaleBand().domain(selected_atts).range([0,group_height])
		scale_group_x.paddingInner(group_innerpad)
		scale_group_y.paddingInner(group_innerpad)
		
		g_width = scale_group_x.bandwidth();g_height = scale_group_y.bandwidth()

		plot_padding = 10
		plot_height = g_height -plot_padding; plot_width = g_width - plot_padding

		
		parallel_y = d3.scaleLinear().range([group_height-g_height,0])	

		r = 3

		opacity = 0.1

		x = d3.scaleLinear().range([r, plot_width-r])
		y = d3.scaleLinear().range([plot_height-r,r])
		line = d3.line()
						.x((d,i)=>{y_domain = domainByTrait[d.attr]
									parallel_y.domain(y_domain)
									return scale_group_x(d.attr)
								})
						.y(d=>{console.log(d);return parallel_y(d.value)})				
			
		d3.select('body').append('svg').attr('width', width).attr('height',height)
		left = d3.select('svg').append('g').attr('id','scatter_plot').attr('transform', 'translate('+padding+','+padding+')')
		right = d3.select('svg').append('g').attr('id','parallel_plot').attr('transform', 'translate('+(group_width+2*padding)+','+padding+')')
		
		domainByTrait={}
		selected_atts.forEach(function(attr) {
    		domainByTrait[attr] = d3.extent(abalone_data, function(d) { return d.value[attr]; });
 		 });





	//	left.selectAll('x_axis')
	//			.data(traits)
	//		.enter().append('g')
	//		.attr('class', 'x axis')
	//	
	//	key = d3.nest().key(d=>d.key).entries(abalone_data)
	combo = []
	
	for(var i = 0; i < selected_atts.length; i++){
		for(var j = 0; j < i; j++){
			if(i!=j){
				tuple = {'x_attr':selected_atts[i], 'y_attr':selected_atts[j]}
				combo.push(tuple);
			}
		}
	}

	click_x = 0
	click_y = 0
	release_x = 0
	release_y = 0	

	s=	d3.selectAll('#scatter_plot').selectAll('g').data(combo).enter().append('g').attr('id','subplot').attr('transform',d=>'translate(' +scale_group_x(d['x_attr']) +','+scale_group_y(d['y_attr'])+')').each(function(d,i,g){
																			//console.log(d)	
																			x_attr = d.x_attr
																			y_attr = d.y_attr
																			//console.log(x_attr)
																			//console.log(y_attr)
																			x_domain = domainByTrait[x_attr]
																			y_domain = domainByTrait[y_attr]
																			x.domain(x_domain)
																			y.domain(y_domain)
																					
																			d3.select(this).append('rect')
																								.attr('fill', 'lightblue')
																								.attr('opacity', 0.3)
																								.attr('width', plot_width)
																								.attr('height', plot_height)
																								
																							.on('mousemove', function(d){

																									[click_x,click_y] = d3.mouse(this)
																									//console.log('clicked')
																									//console.log('x:'+click_x)
																									//console.log('y:'+click_y)
																									x_attr = d.x_attr
																									y_attr = d.y_attr
																							
																									x_domain = domainByTrait[x_attr]
																									y_domain = domainByTrait[y_attr]
																									x.domain(x_domain)
																									y.domain(y_domain)

																									
																																													
					
																									for(i=0;i<abalone_data.length;i++){
																												data_x = abalone_data[i].value[x_attr]
																												data_y = abalone_data[i].value[y_attr]
																												scale_x = x(data_x)
																												scale_y = y(data_y)
																									}



																								})
																							.on('mousedown', function(d){
																									[click_x,click_y] = d3.mouse(this)
																									console.log('clicked')
																									console.log('x:'+click_x)
																									console.log('y:'+click_y)
																									this.append('rect')
																											.attr('x',click_x)
																											.attr('y',click_y)
																											.attr('id','brush')
																									x_attr = d.x_attr
																									y_attr = d.y_attr
																							
																									x_domain = domainByTrait[x_attr]
																									y_domain = domainByTrait[y_attr]
																									x.domain(x_domain)
																									y.domain(y_domain)

																									
																																													
					
																									for(i=0;i<abalone_data.length;i++){
																												data_x = abalone_data[i].value[x_attr]
																												data_y = abalone_data[i].value[y_attr]
																												scale_x = x(data_x)
																												scale_y = y(data_y)

																									}

																							})

																								




																			//add data points
																			d3.select(this).selectAll('circle').data(abalone_data).enter().append('circle')
																																						.attr('cx', d2=>{return x(d2.value[x_attr])})
																																						.attr('cy', d2=>{return y(d2.value[y_attr])})
																																						.attr('r', 3)
																																						.attr('opacity',opacity)
																			
																			
																			//add label
																			d3.select(this).append('text').text(x_attr).attr('transform', 'translate('+30+','+(g_width+22)+')')
	
																			d3.select(this).append('text').text(y_attr).attr('transform', 'translate('+ -30 +','+100+') rotate(-90)')
																			
																			//add axes
																			d3.select(this).append('g').attr('transform', 'translate(0,0)').call(d3.axisLeft(x))
																			
																			d3.select(this).append('g').attr('transform', 'translate(0,'+plot_height+')').call(d3.axisBottom(y))
																
																			return d
																			})
																			


	assembly_data =[]
	for (var i = 0; i<abalone_data.length;i++){
		//console.log('start')
		line_data = []
		datum = abalone_data[i]
		for(var j = 0; j<selected_atts.length;j++){
			tuple = {}
			tuple['attr'] = selected_atts[j]
			tuple['value'] = datum.value[selected_atts[j]]
		//	console.log(tuple)
			line_data.push(tuple)
		//	console.log(line_data)
		}
		assembly_data.push(line_data)
	}	


	//add coordinates
	s1 = d3.select('#parallel_plot').selectAll('line').data(selected_atts).enter().append('line')
																												.attr('transform', d=>'translate(' +scale_group_x(d)+',0)')
																												.attr('x1',0)
																												.attr('x2',0)
																												.attr('y1',0)
																												.attr('y2',	group_height-g_width)
																												.attr('style', 'stroke:rgb(0,0,0);stroke-width:2')
	//add coordinate label
			d3.select('#parallel_plot').selectAll('text').data(selected_atts).enter().append('text')
																												.text(d=>d)															
																												.attr('transform', d=>'translate(' +(scale_group_x(d)-20)+','+(group_height-g_height+40)+')')
												
			d3.select('#parallel_plot').selectAll('path').data(assembly_data).enter().append('path')


																												.attr('d',d=>{
																															//console.log('here')
																														//	console.log(d);
																														
																															return line(d)})
																													
				.attr('fill', 'none')
				.attr('stroke', 'blue')
				.attr('stroke-width', '3')
				.attr('opacity',opacity)


	
																		


}

function fh(x){

		sum = 0
		for(i =0;i<abalone_data.length;i++){
			t = abalone_data[i]
			sum +=K(x-t)
		}

		return sum/abalone.data.length

}

function K(t){

			K = 1/Math.sqrt(2*Math.PI)*Math.pow(Math.E,(-(t^2)/2))
			return K
}
