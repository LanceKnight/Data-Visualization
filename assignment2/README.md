# Assignment 2

In this assignment you will be combining all of your knowledge in D3 for interactively exploring multiple time series data that is hierarchically organized. The main javascript code that you will be starting from for this assignment can be found in [http://localhost:8000/assignment2/interactive_time_series.js](http://localhost:8000/assignment2/interactive_time_series.js), and the index is [http://localhost:8000/assignment2/index.html](http://localhost:8000/assignment2/index.html).

## Data

There are two time series datasets that you will be provided for experimentation. Both are formatted in the same exact way (minus date formats, which are accounted for). Your code should be able to visualize both with no modifications (other than switching the dataset, see `is_music_time_series` variable in index).

### Population Counts in Japan

This dataset contains a set of time series of population counts for the country of Japan. More specifically, each time series is categorized by the following hierarchy levels:

* country (the root node: Japan)
* three of Japan's main island regions
* within each island, a number of prefectures (geographic regions)

Thus, a single time series contains population counts for a particular prefecture, this prefecture belongs to a particular island, and the island belongs to Japan.

[Click here to download this dataset](https://vanderbilt.box.com/s/y52ufqgx7ptxcb0zh0e84lya4b4l0jkw), and place it in the assignment2 directory.

### Music Listening Counts from last.fm

This dataset contains a set of time series of music tracks that are "scrobbled" (listened to) by the music community of the website last.fm. The tracks are broken down by genre, consisting of the following hierarchy levels:

* all musical genres (the root node)
* five general musical genres
* within each genre, a set of more specific subgenres

Thus, a single time series contains listening counts for a particular subgenre, this subgenre belongs to a particular genre, and the genre belongs to the root (all genres of music).

[Click here to download this dataset](https://vanderbilt.box.com/s/ktixa1e5jn5avnig8vu1wk3vpu3822hf), and place it in the assignment2 directory.

### Data Format

Each dataset is hierarchically organized via JSON, and upon loaded through D3 it is an object with a tree data structure, with each node containing the following properties:

* `counts`: this property only exists at the leaf nodes, and is an array that consists of objects containing properties:
	* `date`: the date at which this count exists
	* `count`: the count for this date
* `name`: the name of this node 
* `children`: an array of nodes that are children of `this` node, empty for leaf nodes

Furthermore, the dates are ordered, so there is no need to sort `counts`.

### Aggregation

Although we could simply visualize all of the time series at once, this will result in clutter, and will make it challenging to compare time series. Thus, you will first be responsible for **aggregating** the time series: namely, you will compute a time series for each non-leaf node that aggregates the time series of its children. The aggregated time series should be stored as an array in new property `counts` (similar to leaf nodes), where each entry in the array has the same structure as `counts` within the leaf nodes (an object containing properties `date` and `count`). You should be able to support two different types of aggregations:

* mean
* sum

Note that you are only to aggregate on `count`, `date` is identical across time series.

We will then want to visualize this hierarchy.

## Visual Encoding

You will use line charts to visualize the time series data. In particular, you will visualize particular types of **node subsets** of the hierarchy, where each node in the hierarchy contains a time series. More specifically, a valid subset is one that:

* **Covers all leaves**: all leaves in the tree can be reached by a path that originates in one of the nodes in the subset (a leaf node in the subset is considered to be already "reached").
* **Excludes ancestors**: two nodes in which one is an ancestor of another cannot belong in the subset.

For any subset that satisfies these conditions, you will plot all of their corresponding time series in one graph. To realize this, you will need:

* `d3.scales` for the x and y axes, as well as `d3.line` to plot each time series.
* `d3.axis` to show the axes
* labels to identify each time series - in particular, for each time series, you will place a text label on the right side of the graph, whose y-coordinate is assigned that of the time series' (mapped via scale) value at the last date, so that the text label is adjacent to the time series.

Moreover, we will want to process any subset of nodes, which means that we must be able to match nodes when we perform data joins. Thus, **keys** should be used when performing data joins, and you may use the `name` property of each node for this purpose.

Color has also been pre-defined for the nodes of the tree in the `color` property. You are to assign color, stored in the nodes, to the path elements, as well as the text elements.

## Interactivity

The time series are organized in this manner to enable interactivity. To this end, you will need to support the following operations:

* **Expand**: when a user performs a `click` on a time series, it should be replaced by its **direct children**. That is, the current time series is removed, and its children time series are added.
* **Collapse**: when a user performs a `Shift+click` on a time series, it should be replaced by its **parent**. Specifically, the parent time series is added and any node that is a descendant of this parent is removed.

| Before Click | After Click |
| ------------ | ----------- |
| <img width="300" alt="timeseries-1" src="https://github.com/matthewberger/vis-fall2018-assignments/blob/master/assignment2/timeseries-1.png"> | <img width="300" alt="timeseries-2" src="https://github.com/matthewberger/vis-fall2018-assignments/blob/master/assignment2/timeseries-2.png"> |

The above shows an example of what your visualization should look like. Given the set of time series on the left, upon clicking on the orange curve, we should see this node's children time series, shown on the right.

| Before Shift+Click | After Shift+Click |
| ------------------ | ----------------- |
| <img width="300" alt="timeseries-3" src="https://github.com/matthewberger/vis-fall2018-assignments/blob/master/assignment2/timeseries-3.png"> | <img width="300" alt="timeseries-4" src="https://github.com/matthewberger/vis-fall2018-assignments/blob/master/assignment2/timeseries-4.png"> |

Similarly, given the time series on the left, should the user press `Shift+click` on any curve with a purple hue, all time series with a purple hue should collapse into their parent, shown on the right.

You will need to do two main operations here:

* For a given time series that the user clicked on, you must determine what nodes in the tree to visualize, depending on whether they expand or collapse.
* Given this array of nodes, perform the standard update pattern that we went over in class, to: remove time series that no longer exist, and add new time series.

## Transitions

You are also to ensure smooth animations when elements are added/removed via transitions. In particular, you will support the following:

* Time series transitions: if we are **expanding**, then the clicked time series should immediately be removed, while the added time series' positions should begin at the clicked time series, and then animate to their respective locations. If we are **collapsing**, then all time series that are to be removed should animate to the clicked time series, and the clicked time series should only appear when this animation has finished.
* Text transitions: have the opacity decrease to 0 if the time series for a text label is being removed, and increase to 1 if it is a text label for a new time series.

## Streamgraph (Graduate Students only)

Although adding interactivity to visualizing multiple time series is useful, occlusion remains a problem, particularly for the music dataset. **Streamgraphs** address this problem by stacking time series graphs and using area to encode time series values. Namely, the length, in the y-coordinate, of a time series identified by a given color gives us its **relative** value. Note that in streamgraphs we cannot display absolute values anymore, a trade-off we take in reducing clutter. You should create a new file for this assignment, titled `interactive_streamgraph.js`, that will build off of your solution to `interactive_time_series.js`.

There are several important choices to make regarding streamgraphs. Arguably most important is the **baseline** curve, the bottom curve that all other time series are stacked on top of. For this assignment you will use the approach of [ThemeRiver](http://www.ifs.tuwien.ac.at/~silvia/wien/vu-infovis/references/havre-ieeeinfovis00.pdf). The topic of baseline is eloquently discussed in the following paper by [Lee Byron and Martin Wattenberg](http://leebyron.com/streamgraph/stackedgraphs_byron_wattenberg.pdf). More specifically, you should implement the baseline outlined in Section 5.1 when discussing ThemeRiver, e.g. the sum of the time series, negated and scaled by 0.5. This will give a layout that is symmetric around the x-axis.

All other considerations regarding streamgraphs: time series ordering, layer labeling, color, you need not worry about. Simply color the areas by the colors you used in the previous part of the assignment. Furthermore, you do not need to address transitions - updates will be instantaneous. But the user should still be able to click on an area to expand, and Shift+click on on area to collapse. Last, text labels need not be animated either, but should be positioned in the center of each time series' area (in the y-axis).

| Before Click | After Click |
| ------------ | ----------- |
| <img width="300" alt="streamgraph-1" src="https://github.com/matthewberger/vis-fall2018-assignments/blob/master/assignment2/streamgraph-1.png"> | <img width="300" alt="streamgraph-2" src="https://github.com/matthewberger/vis-fall2018-assignments/blob/master/assignment2/streamgraph-2.png"> |

The above shows an example of what your streamgraph visualization should look like. Each time series is represented as an area. By clicking on an area, e.g. the purple area shown on the left, it will expand that node's children time series, shown on the right. Analogously, when the user Shift+clicks on a non-root node, the set of time series should collapse.

Try out the two different aggregations: mean and sum. You should now see that it is much easier to perceive summations of time series compared to the above technique of visualizing individual time series, since in the latter we are not rescaling the axes.

## Hand-in

Zip up the `assignment2` directory with all html and javascript files, please exclude the data files when zipping, and submit it to Brightspace.

## Grading

* 10 points: hierarchical aggregation of time series
* 50 points: Visual Encoding
	* 25 points: properly using data join: `enter` and `exit` selections for handling an arbitrary subset of nodes, and proper usage of keys
	* 10 points: plot axes
	* 10 points: text labels
	* 5 points: color assigned to elements
* 30 points: Interactivity
	* 10 points: determine nodes that to be expanded/collapsed
	* 10 points: support expansion behavior in the data join
	* 10 points: support collapse behavior in the data join
* 10 points: Transitions
	* 8 points: path element transitions
	* 2 points: text element transitions
* 30 points: Streamgraphs
	* 10 points: computing a stacked representation of the count data
	* 15 points: visualizing the stacked time series data in terms of area marks, colored by the time series' assigned colors.
	* 5 points: text labels positioned properly

Please note for graduate students: your grade is out of 130 points, but still counts as the same amount as any other assignment in its contribution towards your overall grade.
