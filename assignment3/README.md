# Assignment 3

In this assignment you will be tasked with creating visualizations in response to a series of questions. It is your responsibility to design the best visualization for the particular question. Your decisions should be based on perceptual principles that we discussed in class.

More specifically, for each question you will need to:

* Decide on the most appropriate **mark**: bar (rect), line (path), point (circle), etc..
* Decide on the most appropriate **channels**. You are free to use any visual channels, such as:
	* **position**: both in x and y
	* **color**
	* **size**
	* **shape**
	* **positional grouping**: in x and y, this refers to grouping data by certain characteristics, like categories
	* **faceted grouping**: in x and y, for the purposes of creating multiple views (i.e. x and y are columns and rows in faceted layout, respectively)

You should consider the different types of ways we plot data that we have thus far gone over, and any additional types of plots that you can think of.

## Data

The dataset is information on different bird species. It is given to you as an array of objects, where each object has the following properties:

* `name`: the name of the bird species
* `bird_size`: the average size of this type of bird (quantitative)
* `wing_length`: the average wing length for the bird (quantitative)
* `head_pattern`: a pattern that characterizes the head of the bird (categorical)
* `wing_pattern`: a pattern that characterizes the bird's wings (categorical)

## Question 1

**What is the relationship between bird size and wing length?**

## Question 2

**How does bird size vary across different head patterns?**

## Question 3

**How does wing length compare across different head patterns and wing patterns?**

## Question 4

**What is the relationship between bird size and wing length, relative to head pattern and wing pattern?**

## Objectives

For each question you will design a visualization that allows the user to help answer the question. Each of the questions is in its own html file (e.g. Question 1 is in `question1.html`, Question 2 is in `question2.html`, etc..). Moreover, in each question you are required to explain your design (at the bottom of each html file in comments):

* Why did you choose the particular mark(s)?
* Why did you choose the particular channels?
* Why is your design good in helping to answer the question?
* What are the limitations of your design in attempting to answer the question?

## Suggestions

* For some of these questions, you will find that multiple bird species might map to the same combination of categories (e.g. there are multiple bird species for "solid" wing pattern and "capped" head pattern). In the case of quantitative data, you might want to aggregate such a set of bird species into a single quantitative value - namely, **compute the mean**. However, you are also free to directly visualize the individual species. The choice is up to you.
* Furthermore, there might be some combinations of categories that yield no birds (like "spotted" wing pattern and "crested" head pattern). This is fine, your visualization should be able to show this as empty.
* If you so choose to use positional grouping or faceted grouping, you may find [d3.nest()](https://github.com/d3/d3-collection#nests) to be extremely handy. Please consult the d3 documentation for more information, as well as [Mr Nester](http://bl.ocks.org/shancarter/raw/4748131/) for experimentation.
* Recall `d3.bandScale()`. We went over this in some detail in class. You may find this very useful.
* If you choose to use color, then please refer to [d3-color](https://github.com/d3/d3-color) and [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic) for further information on how to work with color spaces, and color maps, using D3.
* Feel free to change anything in the starter code as you see fit: width and length of the svg element, padding, etc..

## Hand-in

Zip up the `assignment3` directory with all html files, and submit it to Brightspace.

## Grading

* 25 points: Question 1
	* 20 points: working visualization (marks and channels are visible, axes are used, axes are appropriately labeled with text, and legends are used as needed)
	* 5 points: justification of visualization
* 25 points: Question 2
	* 20 points: working visualization (marks and channels are visible, axes are used, axes are appropriately labeled with text, and legends are used as needed)
	* 5 points: justification of visualization
* 25 points: Question 3
	* 20 points: working visualization (marks and channels are visible, axes are used, axes are appropriately labeled with text, and legends are used as needed)
	* 5 points: justification of visualization
* 25 points: Question 4
	* 20 points: working visualization (marks and channels are visible, axes are used, axes are appropriately labeled with text, and legends are used as needed)
	* 5 points: justification of visualization

