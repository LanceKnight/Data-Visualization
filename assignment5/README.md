# Assignment 5

In this assignment you will be visualizing hierarchical data using [treemaps](https://www.cs.umd.edu/~ben/papers/Johnson1991Tree.pdf). The main javascript code that you will be starting from for this assignment can be found in [http://localhost:8000/assignment5/treemap.js](http://localhost:8000/assignment5/treemap.js).

## Data

You will be provided a dataset that describes all source files for the package Flare. Source files are hierarchically organized based on grouped structures, in much the same way that directories are organized in a file system. This is represented as a tree: each node of the tree has a `name` property, non-leaf nodes have a `children` property pointing to a list of child nodes, and each leaf node has a `value` property which is the size of the source file corresponding to that node. You can download the data [here](https://vanderbilt.box.com/s/3x0eiqgk50f9e2rkm6hhieushnmm5cc3).

## Task

Your task is to construct a treemap for this dataset, so that we can visualize the hierarchical structure of the data, as well as visually distinguish between different sizes of source files. As discussed in class, in deciding the axis along which to lay out rectangles, you should choose the longer of the two axes (e.g. the larger of width and height of the particular rectangle). In addition to building and visualizing a treemap, your visualization will need to support:

* **Rectangle padding:** for each rectangle built from the treemap, with the exception of the root node, shrink the rectangle so that there exists a small cushion of space between it and other rectangles in the treemap. This will better convey the hierarchical structure. The amount to pad should be some fraction of the size of the rectangle's smallest side, where the fraction is some specified amount.
* **Interactively adjusting padding:** a disadvantage with the above is that the amount by which we pad is highly non-trivial to automatically compute, as the amount that leads to the best perception of hierarchical structure is really challenging to determine. Thus, you should allow the user to interactively control the amount by which we pad: the "fraction" discussed above. The user should be able to zoom their mouse wheel (or trackpad), and you should update the trackpad, recompute the treemap, and perform a new data join which need only update elements (nothing is to be added/removed).
* **Hierarchical node labels:** we also want the user to see what these nodes are! As the user hovers the mouse over a rectangle, you are to show the `name` property for that node, as well as the `name` property of all ancestors of this node, going up to the root. The position of a label should be placed at the center of its node (hint: use attribute `text-anchor` with value `middle` to realize this placement), and the font size of each label should be sized based on the node's depth in the hierarchy: largest for the root, smallest for the leaf node with the largest depth. Furthermore, the text's opacity should be adjusted in a similar manner, based on the node's depth: the larger the depth, the higher the opacity.

Note that a treemap takes in the value at each node, and maps that to an area. Given that we only have values at the leaf nodes, you should sum up these value amounts according to the tree structure: a given node's value is the sum of its children's values. This is similar to what you did in Assignment 2 with hierarchical time series (except this should be simpler).

## Squarified Treemaps (Graduate Students only)

The naive treemap algorithm tends to produce lots of skinny rectangles, which are hard to visualize. The [Squarified Treemaps](https://www.win.tue.nl/~vanwijk/stm.pdf) addresses this problem by laying out the child rectangles of a given node in a way that produces rectangles containing aspect ratios as close to 1 as possible.

You are to implement squarified treemaps, building off of all of the above: padding, interactive padding adjustment, and node labels. So the primary modification to the above is in how rectangles are layed out for a given node. Implement squarified treemaps in a different javascript file from the above (e.g. `squarified_treemap.js`).

## Hint

This should not be a very D3-heavy assignment. Most of the work should be spent on constructing the rectangles in the hierarchy.

## A note on D3 and Treemaps

It should be pretty easy to see that D3 already has an implementation of treemaps (and squarified treemaps). _You are not to use D3's treemap function, or its implementation of treemaps, for this assignment_ (the same holds for squarified treemaps).

## Hand-in

Zip up the `assignment5` directory with all source files (html, javascript, css, etc..) and submit it to Brightspace.

## Grading

* 10 points: Data preparation - accumulating values of nodes based on hierarchical structure, anything else necessary for the treemap algorithm.
* 50 points: Implementation of treemaps.
	* 30 points: correct computation of rectangles for nodes, namely that the area of a node is the proportion of its value to its parent's value.
	* 20 points: proper visual encoding of the rectangles.
* 15 points: Rectangle padding (static, no interaction)
* 10 points: Interactive adjustment of padding.
* 15 points: Interactively view node labels in a hierarchical manner.
* 30 points: Squarified Treemaps.

Please note for graduate students: your grade is out of 130 points, but still counts as the same amount as any other assignment in its contribution towards your overall grade.
