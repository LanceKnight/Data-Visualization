---
layout: default
title: Monday Lecture
---

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML" async>
</script>
<script src="https://d3js.org/d3.v5.min.js"></script>

# D3: Scales

Thus far we have seen how to map data to visual elements in the DOM through D3, but we have assumed that the data values nicely map into the SVG viewport. When we set the width and height of the SVG element, this is defining a **coordinate system** and visual elements must be positioned and sized with respect to this coordinate system. For instance, if the SVG element is in a 500 x 500 rectangle positioned at (0,0), and our datum is a 2D point with coordinate (40, 50), then it might seem reasonable to directly position this datum with its coordinate. But what if our data was all completely outside of the SVG element's viewport? We need to have a way to map **abstract data** to **visual representations**.

## Scales map data from a domain to a range

Pretty simple, right? Scales in D3 are actually very straightforward, but prove to be quite powerful in performing a number of operations:

* Properly positioning and sizing arbitrary data through a variety of maps.
* Performing color mapping.
* Mapping time.
* Supporting quantization, padding, continuous vs. discrete data, etc..

To construct a scale, you must specify a **domain**, e.g. the input space, and **range**, e.g. the output space. Almost always: **data is the domain, visual encoding is the range**. There are a variety of scales that D3 provides, which are highly dependent on the data **attribute types** that we previously discussed: categorical, ordinal, quantitative, as well as the types of **channels** that we are mapping data to: spatial position, size, color, etc..

## Continuous Scales

Continuous scales assume that both the domain and range are, well, continuous, or in the parlance of our attribute types: quantitative. Lets first consider the simplest scale: a **linear** scale.

### d3.scaleLinear()

A linear scale assumes **continuous** input and **continuous** output. Upon creating a scale, it is necessary to define the domain's sequence of values and the range's sequence of values. So a common way to construct `scaleLinear` is as follows:

```javascript
scale = d3.scaleLinear()
	.domain([min_d,max_d])
	.range([min_x,max_x])
```

Where `min_d` and `max_d` are the minimum and maximum of your data, respectively, and `min_x` and `max_x` are the minimum and maximum of the x-coordinate in the SVG coordinate system, respectively. D3 scales, like selections, support method chaining, hence the notation above. To use the scale, for a given datum `d`, we simply pass it in to the scale to obtain the mapped value in the range: `scale(d)`.

<p>
So what is actually being done here? Under the hood, <b>linear interpolation</b> is being performed. More specifically, a function \(f : \mathbb{R} \rightarrow \mathbb{R}\) is constructed such that \(f(min_d) = min_x\), \(f(max_d) = max_x\), and for \(d \in (min_d,max_d)\), \(f(d)\) is linear, namely it can be expressed by \(f(d') = \min_x \cdot (1-d') + \max_x \cdot d'\), where \(d' = \frac{d-min_d}{max_d-min_d} \in [0,1]\).
</p>

Continuous scales, like `scaleLinear`, are very useful when our data is continuous, like our 2D points visually encoded in a scatterplot. So lets [revisit our scatterplot](localhost:8000/example0.html), and see how much more flexible things get when we use scales.

## Other Continuous Scales

D3 has a host of other continuous scales; we will not cover each one, please see the docs for more information. However, we will cover two other continuous scales, as they relate to fairly common uses in data visualization.

### d3.scaleSqrt()

<p>
Naturally, this applies a \(\sqrt{x}\) transformation to the data. But where would we use this? Lets discuss how to map <b>size</b> to a visual channel. Suppose we had a third data attribute in our previous dataset, and we wanted to map it to circle radii. What would a linear scale do to the resulting <b>area</b> of the circle?
</p>

<p>
Recall: area is \(\pi r^2\). So a linear change in radius will result in a quadratic change in area. This is not a great mapping from data to visual property, as it will be difficult to distinguish small data values in their visual encodings. On the other hand, a square-root scale results in a linear change in the area, thus changes in data will map linearly to the area channel.
</p>

[Lets experiment with this](localhost:8000/example1.html).

### d3.scaleLog()

<p>
This will apply a \(\log(x)\) transformation to the data. When would such a transformation be used?
</p>

<p>
Suppose for a base exponent \(a\) that our data can be described as \(a^{x_i}\) for the i'th quantitative data point. 
</p>

[Lets look at a plot of this](localhost:8000/example2.html).

Hmm, hard to see the variation. Lets see what happens when we apply a log scale to the y-axis.

Ah, so the data _plots linearly_. 

Some questions:
* How do we interpret the y-axis?
* What happens when our data has negative values? Or zero?
* How much does the selected exponent matter?
* How do we know when we _should_ apply a log scale to our data?

### Color

The range need not only be numbers! D3 provides support for other types of values that can be readily interpolated. Among them: color!

D3 supports color in many different types of formats:

* prespecified names (`'red'`, `'green'`, `'blue'`)
* hexadecimal strings (`'0xff0000'`,`'0x00ff00'`,`'0x0000ff'`)
* explicit RGB values (`'rgb(255,0,0)'`, `'rgb(0,255,0)'`, `'rgb(0,0,255)'`)

You can mix and match these color types when specifying your `range` in any of the continuous scales. [Lets see an example](localhost:8000/example3.html).

Above I've used RGB as the color space. D3 also supports other color spaces, but we will hold off on that for now, and revisit this in some detail in the next couple of weeks.

### Time

Time can also be used, both as a domain and a range. `d3.scaleTime` assumes a time domain, and some range - it could be scalar values, colors, or even dates.

## Quantized Scales

Moving away from continuous scales, D3 also supports so-called _quantized_ scales. Here, the domain remains continuous, but the range is **discrete**. So, subsequences in the domain now map to the same value in the range. [Lets take a look](localhost:8000/example4.html).

## Band Scales

The last type of scale we will look at is a **band** scale. This scale is typically used to help with the spatial layout of data. It is especially powerful for nested data, as we can associate different band scales for different nesting levels.

The [d3-scale docs for band](https://github.com/d3/d3-scale#band-scales) have a great illustration to help with setting up a band scale:

![alt text](https://raw.githubusercontent.com/d3/d3-scale/master/img/band.png)

The domain that we specify is **ordinal**, and it represents each visual element that we wish to lay out. So if we are concerned with **bar elements**, then we would need to have a way to refer to each bar, and organize this into an array. The range is the spatial position extent, which is discretized into different chunks based on the domain. We may specify `paddingInner` and `paddingOuter` as a way to introduce padding between elements represented by our domain. The `bandwidth` is automatically computed, and gives us the width of a single element in the domain.

Once we set up the scale, then invoking the scale with an item in the domain gives us its position in the range. Lets see how we can use this to organize space, and organize visual elements, [with an example](localhost:8000/example5.html).

D3 also supports **point scales**, which can be analogously used for scatterplots.

## Axes

So we've now mastered scales, but we can't actually see them! This is unfortunate. But fortunately, displaying them is quite straightforward via `d3.axis`.

To use an axis, we need to first tell D3 where to position it. We use the group element `<g>` for this purpose, to specify an appropriate transformation. D3 axis actually returns a function, intended for D3 to be invoked in a specific way. If you recall `call`, D3 uses this as a way to transform an element, in this case the group element. D3 will create the appropriate visual elements for an axis as children of the group element.

Lets [walk through an example](localhost:8000/example6.html).

Ok, so we now have most of the pieces in place to use D3 for data visualization. In the next lecture, we will cover three more topics that will cap off our D3 discussion: shapes, events, and transitions.
