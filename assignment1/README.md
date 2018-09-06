# Assignment 1

This assignment is a D3 Workout of sorts. You will be using D3 to create a visualization using basic shapes and styling of these shapes. The objective is to produce the following static image through your visualization:

![alt text](https://github.com/matthewberger/vis-fall2018-assignments/blob/master/assignment1/decline.jpg "Target Visualization")

There are two parts to the assignment, both of which have the same objective: produce the above image. First, kick off a local web server via python, in the top-level directory (**vis-fall2018-assignments**), the same way you did in the previous assignment.

## Part 1

Go to [http://localhost:8000/assignment1/part1.html](http://localhost:8000/assignment1/part1.html) for part1. You should see a black rectangle. However, all of the shapes are indeed present in the DOM, but they lack a `fill` color. It is your job to assign these elements the appropriate color. In the code you will see **TODOs** indicating what needs to be selected and what color to assign to the selection. You are to only use D3 functions to complete this part.

Additionally, there is a question at the very end for which you need to provide an answer, in the appropriate Javascript comment.

## Part 2

Go to [http://localhost:8000/assignment1/part2.html](http://localhost:8000/assignment1/part2.html) for part2. You should not see anything here. Indeed, the DOM is mostly empty! Only a single SVG element exists. However, this time the data corresponding to the shapes has been provided. It is your responsibility to join the data with elements to produce the correct visualization. You will see a set of **TODOs** indicating what operations need to be accomplished.

## Hand-in

Zip up the `assignment1` directory with `part1.html` and `part2.html` completed, and submit it to Brightspace.

## Grading Criteria

### Part 1 - 35%

* 30%: perform D3 selections to assign attributes to elements so that the visualization exactly matches the target image
* 5%: correctly answer the provided question

### Part 2 - 65%

* 30%: correcty join data and assign element attributes for the background and `bar` data
* 15%: correcty join data and assign element attributes for the `box` data and `main_circles` data
* 20%: correcty join data and assign attributes for the `eight_circles` data
