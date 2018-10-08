var abalone_data;

// all dimensions: 'length', 'height', 'shucked weight', 'diameter', 'whole weight', 'viscera weight', 'rings'
var selected_atts = ['length', 'height', 'shucked weight', 'diameter', 'whole weight', 'viscera weight', 'rings'];
var selected_atts = ['length', 'height', 'shucked weight','diameter', 'whole weight']//this is for debugging
var num_points = 800
var num_points = 20//this is for dubugging

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

		r = 3

		x = d3.scaleLinear().range([r, plot_width-r])
		y = d3.scaleLinear().range([plot_height-r,r])
		xAxis = d3.axisBottom()
					.scale(x)
					
			
		
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
	s=	d3.selectAll('#scatter_plot').selectAll('g').data(combo).enter().append('g').attr('transform',d=>'translate(' +scale_group_x(d['x_attr']) +','+scale_group_y(d['y_attr'])+')').each(function(d,i,g){
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
																			
																			//add data points
																			d3.select(this).selectAll('circle').data(abalone_data).enter().append('circle')
																																						.attr('cx', d2=>{return x(d2.value[x_attr])})
																																						.attr('cy', d2=>{return y(d2.value[y_attr])})
																																						.attr('r', 3)
																																						.attr('opacity',0.2)
																			
																			
																			//add label
																			d3.select(this).append('text').text(x_attr).attr('transform', 'translate('+30+','+(g_width+22)+')')
	
																			d3.select(this).append('text').text(y_attr).attr('transform', 'translate('+ -30 +','+100+') rotate(-90)')
																			
																			//add axes
																			d3.select(this).append('g').attr('transform', 'translate(0,0)').call(d3.axisLeft(x))
																			
																			d3.select(this).append('g').attr('transform', 'translate(0,'+plot_height+')').call(d3.axisBottom(y))
																
																			return d
																			})
	

//				.attr('transform', (d,i) => 'translate('+scale_group(d) + ',0)')
//				.each( d=>{x.domain(domainByTrait[d]) }).call(xAxis)
		


}
