//http://bl.ocks.org/mbostock/9f37cc207c0cb166921b

var white = d3.rgb("white"),
    black = d3.rgb("black"),
    width = d3.select("canvas").property("width");

var channels = {
  l: {scale: d3.scale.linear().domain([0, 150]).range([0, width]), x: width / 2},
  a: {scale: d3.scale.linear().domain([-100, 100]).range([0, width]), x: width / 2},
  b: {scale: d3.scale.linear().domain([-100, 100]).range([0, width]), x: width / 2}
};

var channel = d3.selectAll(".channel")
    .data(d3.entries(channels));

channel.select(".axis")
    .each(function(d) { d3.select(this).call(d3.svg.axis().scale(d.value.scale).orient("bottom")); })
  .append("text")
    .attr("x", width)
    .attr("y", 9)
    .attr("dy", ".72em")
    .style("text-anchor", "middle")
    .style("text-transform", "uppercase")
    .text(function(d) { return d.key; });

var canvas = channel.select("canvas")
    .call(d3.behavior.drag().on("drag", dragged))
    .each(render);

function dragged(d) {
  d.value.x = Math.max(0, Math.min(this.width - 1, d3.mouse(this)[0]));
  canvas.each(render);
}

function render(d) {
  var width = this.width,
      context = this.getContext("2d"),
      image = context.createImageData(width, 1),
      i = -1;

  var current = d3.lab(
    channels.l.scale.invert(channels.l.x),
    channels.a.scale.invert(channels.a.x),
    channels.b.scale.invert(channels.b.x)
  );

  for (var x = 0, v, c; x < width; ++x) {
    if (x === d.value.x) {
      c = white;
    } else if (x === d.value.x - 1) {
      c = black;
    } else {
      current[d.key] = d.value.scale.invert(x);
      c = d3.rgb(current);
    }
    image.data[++i] = c.r;
    image.data[++i] = c.g;
    image.data[++i] = c.b;
    image.data[++i] = 255;
  }

  context.putImageData(image, 0, 0);
}