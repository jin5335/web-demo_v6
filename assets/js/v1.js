
    d3.queue()
      .defer(d3.csv, 'actorNodesSim_v4.csv')
      .defer(d3.csv, 'actorLinksSim_v4.csv')
			.awaitAll(function(err, data){
					var nodes = data[0];
					var links = data[1];
					var MAX_L = d3.max(nodes, function(d) {return +d.link_cnt;});
					var r = 50;
					console.log()
					r_nodes = nodes.map(function(d, i){
						return {
							 'person_code' : d.person_code,
							 'dr_cnt' : +d.dr_cnt,
							 'person_name' : d.person_name,
							 'path_mean' : d.path_mean,
							 'link_cnt' : +d.link_cnt,
							 'person_pic_url' : d.person_pic_url,
					 		'person_en' : d.person_en,
					 		'r' : r * ((+d.link_cnt)/MAX_L),
							'idx' : i
						 };
					});
					render(r_nodes, links);
      });

function render(nodes, links){

  var W = 0.95 * window.innerWidth;
  var H = 0.95 * window.innerWidth;
	var MAX_L = d3.max(nodes, function(d) {return +d.link_cnt;});


	var root=d3.select('#v2')
					.attr("width",W)
					.attr("height",H);

	root.select('defs #svgPath2 circle')
			.attr('cx', 0.5)
			.attr('cy', 0.5)
			.attr('r', 0.5);

  var linksSel = root.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
			.attr('class', function(d) {return d.source_en});

  var nodesSel = root.append('g')
      .attr('class', 'nodes')
      .selectAll('image')
      .data(nodes)
      .enter()
      .append('image')
			.attr('width', function(d) { return d.r * 2;})
			.attr('height', function(d) { return d.r * 2;})
      //.attr('width', r * 2)
			//.attr('height', r * 2)
			.attr('clip-path','url(#svgPath2)')
			.attr('href', function(d) {return d.person_pic_url});
      // .call(d3.drag()
      //     .on('start',function(d) { sim.alphaTarget(0.3).restart();
      //                                 d.fx = d.x;
      //                                 d.fy = d.y;})
      //     .on('drag', function(d) { d.fx = d3.event.x; d.fy=d3.event.y;})
      //     .on('end', function(d) { sim.alphaTarget(0);
      //                              d.fx = null;
      //                              d.fy = null; })
      // )

  var textsSel = root.append('g')
      .attr('class','texts')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', 2)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
      .text(function(d) { return d.person_name;})
			.on("mouseover", function(d) {
				d3.selectAll('.' + d.person_en)
						.style("stroke","white")
						.style("opacity", 1)
						.style('stroke-width','4px')
						.classed('selected_link', true);
			})
			.on("mouseout",function(d){
				d3.selectAll('.selected_link')
						.style("stroke","#DDD")
						.style("opacity",0.1)
						.style('stroke-width','2px')
						.classed('selected_link', false);
			});

  var sim = d3.forceSimulation(nodes)
					.force('charge', d3.forceManyBody().strength(-30))            // default : strength =  -30
          .force('center', d3.forceCenter (W/2 ,H/2))
					.force('collide', d3.forceCollide( function(d) { return 200 * (+d.link_cnt) / MAX_L ; }))
					.force('link', d3.forceLink(links).id(function (d) {return d.person_code;}))
					.on('tick', onTick);


  function onTick() {
      nodesSel
          .style('transform', function (d) {
						d.x = Math.max(d.r, Math.min(d.x, W-d.r))
						d.y = Math.max(d.r, Math.min(d.y, H-d.r))
						 return 'translate(' + (d.x - d.r) + 'px, ' + (d.y - d.r) + 'px)';});
      textsSel
          .style('transform', function (d) {return 'translate(' + d.x + 'px, ' + (d.y + d.r) + 'px)';});
			linksSel
		     .attr('x1', function(d) {return d.source.x;})
         .attr('y1', function(d) {return d.source.y;})
				 .attr('x2', function(d) {return d.target.x;})
		     .attr('y2', function(d) {return d.target.y;})

	  }
	}