
    d3.queue()
      .defer(d3.csv, 'actorNodesCircle_v5.csv')
      .awaitAll(function(err, data){
          var nodes = data[0];
					r_nodes = nodes.map(function(d){
						var r = 6;
						var Max_d = d3.max(nodes, function(d) {return d.d;});
						 return {
							 'person_code' : d.person_code,
							 'dr_cnt' : +d.dr_cnt,
							 'person_name' : d.person_name,
							 'path_mean' : d.path_mean,
							'link_cnt' : +d.link_cnt,
							 'person_pic_url' : d.person_pic_url,
							 'person_en' : d.person_en,
							 'd' : +d.d,
							 'r' : r * ( (Max_d - d.d) * 1.5 + 1)
						 };
					});
          render(r_nodes);
      });

function render(nodes){
  var W = 0.95 * window.innerWidth;
  var H = 0.95 * window.innerWidth;
	var r = 10;
	var K = 100;

	var root=d3.select('#v3')
					.attr("width",W)
					.attr("height",H)

	root.select('defs #svgPath3 circle')
		.attr('cx', 0.5)
		.attr('cy', 0.5)
		.attr('r', 0.5);

	var tree =root.select('.tree')
			.style('transform', 'translate(' + (W * 0.5) + 'px, ' + (H * 0.5) + 'px)');

			// <image
			// 	width="34" height="34"
			// 	href="http://img1.daumcdn.net/thumb/C216x216/?fname=http%3A%2F%2Fcfile170.uf.daum.net%2Fimage%2F262D664357EC94BA15A001" clip-path="url(#round)"
			// />

  var nodesSel = tree.append('g')
      .attr('class', 'nodes')
      .selectAll('image')
      .data(nodes)
      .enter()
      .append('image')
			.style('opacity',0.5)
			.attr('width', function(d) { return d.r * 2;})
			.attr('height', function(d) { return d.r * 2;})
			.attr('clip-path', 'url(#svgPath3)')
			.attr('href', function(d) {	return d.person_pic_url; })
			.attr('class', function(d) { return d.person_en; })
			.on('click',function(d) {
				d3.select('.selected')
					.style('opacity',0.5)
					.classed('selected',false);
				d3.select(this)
					.style('opacity',1)
					.classed('selected',true);
			})
			.call(d3.drag()
          .on('start',function(d) { sim.alphaTarget(0.3).restart();
                                      d.fx = d.x;
                                      d.fy = d.y;})
          .on('drag', function(d) { d.fx = d3.event.x; d.fy=d3.event.y;})
          .on('end', function(d) { sim.alphaTarget(0);
                                   d.fx = null;
                                   d.fy = null; })
      );

	var center_person = nodes.filter( function(d) {
		if(d.d == 0)
			return d;
	})[0]
	console.log(center_person);
	d3.select('.'+center_person.person_en)
		.style('opacity', 1);


  var textsSel = tree.append('g')
      .attr('class','texts')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', 2)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
      .text(function(d) { return d.person_name;});

  var sim = d3.forceSimulation(nodes)
					//.force('charge', d3.forceManyBody().strength(-10))            // default : strength =  -30
          .force('center', d3.forceCenter (0, 0))
					.force('col', d3.forceCollide(function(d) { return  d.r ;}))
					.force('radial', d3.forceRadial( function(d) { return d.d * K;}).strength(3))
					.on('tick', onTick);

  function onTick() {
      nodesSel
          .style('transform', function (d) {
						d.x = Math.max(-(W/2) + d.r, Math.min(d.x, (W/2)-(d.r)));
						d.y = Math.max(-(H/2) + d.r, Math.min(d.y, (H/2)-(d.r)));
						return 'translate(' + (d.x - d.r) + 'px, ' + (d.y - d.r) + 'px)';});
      textsSel
          .style('transform', function (d) {return 'translate(' + d.x + 'px, ' + (d.y+d.r) + 'px)';});
	}
}
