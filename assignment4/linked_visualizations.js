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
}
