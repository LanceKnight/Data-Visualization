# Assignment 4

In this assignment you will be using a scatterplot matrix and parallel coordinates to visualize multidimensional data. Moreover, the two interfaces will be linked together via brushing, so that we can understand the relationship between their visual patterns. The main javascript code that you will be starting from for this assignment can be found in [http://localhost:8000/assignment4/linked_visualizations.js](http://localhost:8000/assignment4/linked_visualizations.js).

## Data

You will be provided a dataset of Abalone, a type of sea shell. Each item has a set of quantitative values, named:

* length
* height
* diameter
* whole weight
* shucked weight
* viscera weight

You can [download the dataset here](https://vanderbilt.box.com/s/8rczciarwm3fow6a9p4xkor70absdo81).

In the boilerplate code, at the top there are 2 parameters: `selected_atts` and `num_points`, which refer to an array of named dimensions that we can select, and the number of points to plot, respectively. For debugging and experimental purposes, you may want to consider adjusting each of these.

Furthermore, please note: every time the visualization is launched, **the order of the dimensions are permuted at random, and the points are sampled at random**. This is to allow you to see the impact of order, and point density, on your visualizations.

## Visual Encoding

Your task is to construct a scatterplot matrix and parallel coordinates for any arbitrary set of dimensions.

### Scatterplot Matrix

The scatterplot matrix will be shown on the left part of the screen. Each scatterplot will correspond to a unique pair of dimensions from the aforementioned array. Do not plot any dimension against itself, only show scatterplots for unique dimensions. You will additionally provide axes for each scatterplot, as well as text labels: a sequence of text labels for each row, and a sequence of text labels for each column, so that the user can identify the dimensions that are used for each scatterplot. It is also your responsibility to be able to effectively display the points, since clutter is likely to occur - consider using opacity to help convey point density.

### Parallel Coordinates

To the right of the scatterplot matrix you will show a parallel coordinates view of the data. You must first map each dimension to an x position, and then plot each data item as a poly-line (path element) whose individual dimensions map to the x coordinates, and whose y coordinate for a given dimension is based on its data range, e.g. a small y coordinate for a small value, and a large y coordinate for a large value. Additionally, you will need to plot the axis for each dimension, only showing the minimum and maximum values of the dimension in order to minimize clutter. You should also use opacity as a way to better convey poly-line density.

## Interactions

The user should be able to brush a rectangle on _any_ of the scatterplots to perform a selection of the data items. Upon a brush, the following needs to be supported:

* The user sees the rectangular brush being dragged as they press+mouse move (e.g. need to add the brush as a rect).
* During brushing, for the given data items selected in the given scatterplot view, they will show up as being selected in all of the scatterplots. You can indicate this via color, e.g. in the fill or stroke of the circle.
* Moreover, the poly-lines for these data items in the parallel coordinates view will be updated to reflect their selection. Similarly, you may indicate this via color.
* If the user's drag leaves the scatterplot, then brushing ends, but the selection remains.
* If the user releases the mouse button, then brushing ends, but the selection remains.
* Only when the user begins a new brush should the current selection be reset to a new selection.

The selection must also be clear: choose colors for selection that are distinct with respect to the colors used in the scatterplot matrix and parallel coordinates.

## Kernel Density Estimation (Graduate Students only)

Using opacity to help convey density has its limitations: low density points will have be difficult to see if we want to show high density regions, and vice versa. One way of addressing this is to estimate the density at each point, and then color map each point by the density. Thus we do not need to use opacity to show density, or at the very least not be as reliant on it.

To this end, you are to implement a kernel density estimation technique, in order to associate each data point with a density. You can use any kernel you wish, though a Gaussian kernel with a user-specified bandwidth would be just fine. Please see [this paper](http://www.ii.uib.no/vis_old/publications/pdfs/lampe11kde.pdf) for a discussion on kernel density estimation within the context of visualization; in particular, see Equations 1 and 2 for the specific form that you should implement. Then you are to use an appropriate (hint: **sequential**) color map to convey the density at each point.

Note: kernel density estimation is to be computed on the original dataset, **not the visual representations** (e.g. scatterplots, parallel coordinates). Thus, the same color-mapped density will be used for scatterplots and parallel coordinates.

Furthermore, you will need to choose an appropriate color for selection that does not interfere with the color map for the estimated density.

Last, since choosing a bandwidth for density estimation is quite tricky, this should be a **tunable parameter** that the user adjusts during interaction. To this end, if the user presses the `j` key (key code 74) the bandwidth should decrease, and if they press `k` (key code 75) the bandwidth should increase. Subsequently, the colors for all points/poly-lines should update. You do not need to have the density estimation run in real-time, e.g. it should incur at most 1-2 seconds of latency for 500 points.

## Suggestions

* You should first focus on setting up your plot regions (e.g. svg groups) in the scatterplot matrix. Consider using `scaleBand` for this purpose.
* As mentioned during lecture, consider using `d3.each` for constructing your scatterplot matrix, with `each` invoked on the aforementioned groups, e.g. you will have a data join per scatterplot.
* Take this assignment one step at a time:
	* Sketch out, on paper, how you want to design each of the plots (scatterplot matrix and parallel coordinates). Figure out how you to organize the data so that you can perform the appropriate data joins, and what scales you will need to use for positioning the plots, and creating the elements.
	* Get your scatterplot matrix up.
	* Get your parallel coordinates plot up.
	* Make sure you can dynamically draw a rectangle over any of the scatterplots.
	* Then figure out how to determine what points belong in the rectangle (simple containment test), gather those points, and update their appearance across all visual encodings.
* **Use keys in the data join to help with selecting the elements you want to update across all views.**
* (for grad students) Keyboard strokes can be listened to via the 'keydown' event, applied to the main svg element. You will also need to register a 'focus' event, with an empty function, to ensure that the svg element listens for key strokes.
* Perform a point-in-rectangle test to see if a point lies in a selection; don't worry about circle-rectangle tests.
* To get a mouse position: `d3.mouse(node)`, for some arbitrary `node`. Returns mouse position with respect to the coordinate system of `node`.

## A note on D3 and Brushing

D3 has support of various kinds for brushing, however _you are not to use D3's brushing capabilities_. The intent of this assignment is to implement brushing from scratch.

## Hand-in

Zip up the `assignment5` directory with all source files (html, javascript, css, etc..) and submit it to Brightspace.

## Grading

* 60 points: Visual Encodings
	* 25 points: scatterplot matrix (layout, individual plots)
	* 25 points: parallel coordinates (layout, poly-line plots)
	* 5 points: axes
	* 5 points: text labels
* 40 points: Interactions
	* 5 points: show user's brush as a dynamic rectangle, adhering to user interactions (mouse press+mouse move, mouse release, mouse exits scatterplot)
	* 5 points: find points within user's brush
	* 10 points: update circles in all scatterplots corresponding to user-selected items
	* 10 points: update polylines corresponding to user-selected items
	* 5 points: update elements when user performs new selection (namely, revert back to original visual encoding for the previous selection)
	* 5 points: ensure selected points/poly-lines are clearly shown
* 30 points: Kernel Density Estimation
	* 20 points: compute a density estimate for each data item
	* 5 points: associate color map with density, color points/poly-lines based on color map
	* 5 points: support interactive updating of bandwidth

Please note for graduate students: your grade is out of 130 points, but still counts as the same amount as any other assignment in its contribution towards your overall grade.
