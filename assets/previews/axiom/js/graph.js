export function drawGraph(target, data, onSelect, statusById={}) {
  target.replaceChildren();
  if (!window.d3) { target.textContent='The graph library could not load. Check your internet connection.'; return null; }
  const width=target.clientWidth||600, height=270, d3=window.d3;
  const svg=d3.select(target).append('svg').attr('viewBox',`0 0 ${width} ${height}`).attr('role','graphics-document').attr('aria-label','Interactive concept graph');
  const zoomLayer=svg.append('g');
  const simNodes=data.nodes.map(n=>({...n}));
  const links=data.links.map(l=>({...l,source:l.source,target:l.target}));
  const edgeLayer=zoomLayer.append('g');
  const link=edgeLayer.selectAll('line').data(links).join('line').attr('class','link').attr('aria-label',d=>d.label).style('opacity',0);
  const linkLabels=edgeLayer.selectAll('text').data(links).join('text').attr('class','link-label').attr('text-anchor','middle').text(d=>d.label).style('opacity',0);
  const node=zoomLayer.append('g').selectAll('g').data(simNodes).join('g').attr('class',d=>`node ${statusById[d.id]||'unreviewed'}`).attr('tabindex',0).attr('role','button').attr('aria-label',d=>`Concept ${d.name}${statusById[d.id]?`, ${statusById[d.id]}`:''}`).on('click',(_,d)=>onSelect(d)).on('keydown',(e,d)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(d)}}).call(d3.drag().on('start',(e,d)=>{if(!e.active)simulation.alphaTarget(.25).restart();d.fx=d.x;d.fy=d.y}).on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y}).on('end',(e,d)=>{if(!e.active)simulation.alphaTarget(0);d.fx=null;d.fy=null}));
  node.append('circle').attr('r',23).attr('fill',d=>statusById[d.id]==='missing'?'#27313c':statusById[d.id]==='partial'?'#44381f':'#102b34').attr('stroke',d=>statusById[d.id]==='missing'?'#8290a0':statusById[d.id]==='partial'?'#f5be67':'#4debd2');
  node.append('text').attr('text-anchor','middle').attr('dy','4').text(d=>d.name.length>11?d.name.slice(0,10)+'…':d.name);
  node.append('title').text(d=>d.name);
  node.style('opacity',0).transition().delay((_,i)=>i*90).duration(420).style('opacity',1);
  link.transition().delay((_,i)=>220+i*70).duration(500).style('opacity',1);
  linkLabels.transition().delay((_,i)=>420+i*70).duration(400).style('opacity',1);
  const simulation=d3.forceSimulation(simNodes).force('link',d3.forceLink(links).id(d=>d.id).distance(95)).force('charge',d3.forceManyBody().strength(-250)).force('center',d3.forceCenter(width/2,height/2)).force('collide',d3.forceCollide(34));
  simulation.on('tick',()=>{link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);linkLabels.attr('x',d=>(d.source.x+d.target.x)/2).attr('y',d=>(d.source.y+d.target.y)/2-5);node.attr('transform',d=>`translate(${d.x},${d.y})`)});
  svg.call(d3.zoom().scaleExtent([.5,3]).on('zoom',e=>zoomLayer.attr('transform',e.transform)));
  return {
    reset(){node.classed('selected',false).classed('dimmed',false);link.classed('selected-link',false);svg.transition().duration(300).call(d3.zoom().transform,d3.zoomIdentity)},
    focus(ids){
      const selected=new Set(Array.isArray(ids)?ids:[ids]);
      node.classed('selected',d=>selected.has(d.id)).classed('dimmed',d=>!selected.has(d.id));
      link.classed('selected-link',d=>selected.has(typeof d.source==='object'?d.source.id:d.source)||selected.has(typeof d.target==='object'?d.target.id:d.target));
      const points=simNodes.filter(d=>selected.has(d.id));
      if(points.length){const cx=points.reduce((sum,d)=>sum+d.x,0)/points.length;const cy=points.reduce((sum,d)=>sum+d.y,0)/points.length;svg.transition().duration(500).call(d3.zoom().transform,d3.zoomIdentity.translate(width/2-cx,height/2-cy))}
    }
  };
}
