d3.queue()
  .defer(d3.json, 'jjh_V2.json')
  .awaitAll(function(err, data){
      var tmp_json = data[0];

      render(tmp_json);
  });

function render(nodes){
var W = 0.95 * window.innerWidth;
var H = 0.95 * window.innerWidth;
var r = 15;
var K = 200;
var R = 50;

var Max_d = d3.max(nodes, function(d) {return d.d;});

var root=d3.select('#v2')
      .attr("width",W)
      .attr("height",H)

root.select('defs #svgPath2 circle')
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
  .attr('width', function(d) { return (d.r * 2); })
  .attr('height', function(d) { return (d.r * 2); })
  .attr('clip-path', 'url(#svgPath2)')
  .attr('class',function(d) {return d.person_en + '_node'} )
  .attr('href', function(d) {
    return d.d <=1 ? d.person_pic_url : 0;})
  .on('mouseover', function(d){
    var textSel = d3.select('.'+d.person_en+'_text');
    textSel
      .style('opacity',1)
      .style('transform', 'translate(' + (d.x + ( R - d.r)) + 'px, ' + (d.y + R + (R-d.r)) + 'px)')
      .style('font-size','11px');

    var nodeSel = d3.select('.'+d.person_en+'_node')
    nodeSel
      .attr('width',  R * 2)
      .attr('height', R * 2)
      .style('transfrom','translate(' + (d.x - R) + 'px, ' + ( d.y - R) + 'px)')
      .attr('href', d.person_pic_url);

    var textElement = textSel.node();
    textElement.parentNode.appendChild(textElement);
    var nodeElement = nodeSel.node();
    nodeElement.parentNode.appendChild(nodeElement);
  })
  .on('mouseout', function(d){
    d3.select('.'+d.person_en+'_text')
      .style('font-size','0px');
      // .style('transform', 'translate(' + d.x + 'px, ' + d.y + 'px)');
    d3.select('.'+d.person_en+'_node')
      .attr('width', (d.r) * 2)
      .attr('height', (d.r) * 2)
      .attr('href', d.person_pic_url);
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
  .attr('class',function(d) { return d.person_en + '_text';})
  .text(function(d) { return d.person_name;})
  .style('font-size',function(d) { return d.d<=1 ? '0px' : '0px'});
  // .style('font-size',function(d) { return d.d<=1 ? '11px' : ( d.d == 2 ? '6px' : '3px')});

var sim = d3.forceSimulation(nodes);
      //.force('charge', d3.forceManyBody().strength(-10))            // default : strength =  -30
//       .force('center', d3.forceCenter (0, 0))
//				.force('col', d3.forceCollide(function(d) { return d.r ;}))
// 				.force('radial', d3.forceRadial( function(d) { return d.d * K;}).strength(2))
//				.on('tick', onTick);
// 				.stop();
//for(i=0; i<10; i++) sim.tick();

onTick();

//	json_dat = JSON.stringify(nodes);
//	console.log(nodes[0]);
//	console.log(json_dat);


function onTick() {
  nodesSel
      .style('transform', function (d) {
        d.x = Math.max(-(W/2) + r, Math.min(d.x, (W/2)-r));
        d.y = Math.max(-(H/2) + r, Math.min(d.y, (H/2)-r));
        return 'translate(' + (d.x - d.r) + 'px, ' + ( d.y - d.r) + 'px)';});
  //textsSel
  //    .style('transform', function (d) {return 'translate(' + d.x + 'px, ' + (d.y + d.r) + 'px)';});
}
}
