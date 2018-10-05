var abalone_data;

// all dimensions: 'length', 'height', 'shucked weight', 'diameter', 'whole weight', 'viscera weight', 'rings'
var selected_atts = ['length', 'height', 'shucked weight', 'diameter', 'whole weight', 'viscera weight', 'rings'];
var num_points = 800

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


			height = 800; width = 2 * height
			padding = 80
			innerpad = 0.3
			actual_height = height - 2*padding; actual_width = actual_height

			domainByTrait = {}
			traits = d3.keys(abalone_data[0])
			traits.forEach(function(trait){
				domainByTrait[trait] = d3.extent(abalone_data, d => d[trait]);
			});
			n = traits.length

			scale_group = d3.scaleBand().domain(traits).range([0,actual_width])
			scale_group.paddingInner(innerpad)
			x_width = scale_group.bandwidth()
			x = d3.scaleLinear().range([0, x_width])
			xAxis = d3.axisBottom()
						.scale(x)
						
					
			
			d3.select('body').append('svg')
			left = d3.select('svg').append('g').attr('id','scatter_plot').attr('transform', 'translate('+padding+','+padding+')')
			right = d3.select('svg').append('g').attr('id','parallel_plot').attr('transform', 'translate('+(actual_width+2*padding)+','+padding+')')
			


		//	left.selectAll('x_axis')
		//			.data(traits)
		//		.enter().append('g')
		//		.attr('class', 'x axis')
		//	
			d3.selectAll('#scatter_plot').selectAll('rect').data(traits).each(d=>{return abalone})


//				.attr('transform', (d,i) => 'translate('+scale_group(d) + ',0)')
//				.each( d=>{x.domain(domainByTrait[d]) }).call(xAxis)
			



}
