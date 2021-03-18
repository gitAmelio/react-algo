import { select } from 'd3-selection'
import prettyFormat from 'pretty-format'

import * as D from './selections-helpers'

const t = 400;

const getTopInfo = (index, nodes) => {
    if(index === nodes.length-1){
        const {step, end} = nodes[index]
        return {
            nodeCount: nodes.length,
            step: step,
            end:  end,
            top: true
        }
    }
    return {}
}  

const createLink = (sourceIndex, targetIndex, nodes, paused) => {
   
    let source = {}
    if(sourceIndex < 0){
        source.x = 40;
        source.y = 20;
    } else {
        source = nodes[targetIndex];
    }
    const target = nodes[targetIndex];

    return  {
        index: sourceIndex,
        id: `[${sourceIndex}]->[${targetIndex}]`,
        source,
        target,
        value: 0.1,
        paused,
        
        ...getTopInfo(targetIndex, nodes)
    }

}

const updateHead = (headData, x=40, y=30) => {      
    const data = [headData]

    const head = //initHead()
     select('.head')
            .attr('transform', `translate(${x},${y})`)
            .select('.head-shape')
                .attr('width', '40px')        
                .attr('height', '40px')        
                .attr('stroke', '#43455c')
                .attr('stroke-width', '4')
                .attr('fill', '#3c3f58')
                .attr('rx', '5px');

     
    if( headData.paused && headData.step > 1 ){
        head
            .transition()
                .duration(t)
                .attr('rx', '45px')
                .attr('stroke', 'white')
                .attr('stroke-width', 1)
    }                
    
    select('.head-path')
        .data(data)
        .attr('fill', 'transparent')
        .attr('stroke', '#8489c1')
        .attr('marker-start', 'url(#mP2)')
        .transition()
        .duration(t)
        .attr('d', D.headPathCoords1)
    .transition()
        .duration(t)
        .attr('marker-start','url(#mP)')
        .attr('d', D.headPathCoords2);
      
}

function rectClass(d) {
    
    if (d.status !== ''){
        return d.status;
    }else
    if (d.stepped) {
        return 'stepped';
    } else 
    if (d.last) {
        return 'last';
    } else {
        return ''
    }
}

const nodeShape = 'rect'
const enterNode = (shape='rect') => (selection ) => {
    const node = selection.append('g')
        .attr('id', getId)
        .attr('class', d=>d.top ? "node top" : "node")
        .attr('transform', d => `translate(${ 0 }, ${ -50 } )`);
    
    if (shape === 'rect'){
        node
            .attr('transform', D.entryPoint)
            .transition()
            .duration(t)
            .attr('transform', D.initPoint)
            .transition()
            .duration(t)
            .attr('transform', d =>  D.nodeLocationOnEnter(d)  )
    }else{
        node
            .transition()
            .duration(t)
            .attr('transform', d=> {
                       return  D.nodePoint(d)
                    }
                )
    }    

    if(nodeShape === 'circle'){
        node.append('circle')
            .attr('r', 25)
            .attr('fill', 'pink')
            .attr('fill', 'transparent');
    }   else {
        node.append('rect')
            .attr('class', rectClass)
            .attr('stroke', d=>d.stepped ? 'yellow' : 'white')
            .attr('width', '50px')
            .attr('height', '50px')
            .attr('fill', 'pink')
            .attr('rx', ()=>shape === 'rect' ? '10px' : '45px' )
            .attr('transform', 'translate(-25, -25)')
            .attr('fill', 'transparent');
    } 
    if(shape === 'rect'){
        node.append('text')
            .attr('class', 'index')
            .text(getIndex)
            .attr('text-anchor', 'middle')
            .attr('y', '40px')
            .attr('font-family', 'sans')
            .attr('font-size', '0.8rem')
            .attr('fill', '#6c78b3');

        node.append('text')
            .attr('class','value')
            .text(d=>d.val)
            .attr('text-anchor', 'middle')
            .attr('y', '5px')
            .attr('font-family', 'sans')
            .attr('fill', 'white')  
            .attr('transform', D.nodeValueLocation);


    } else {

        node.append('text')
            .attr('class','height')
            .text(d=>d.height)
            .attr('text-anchor', 'middle')
            .attr('y', '-14px')
            .attr('font-family', 'sans')
            .attr('font-size', '0.6rem')
            .attr('fill', '#6c78b3'); 
            
        node.append('text')
            .attr('class','left')
            .text(d=>d.leftHeight)
            .attr('text-anchor', 'middle')
            .attr('y', '15px')
            .attr('x', '-14px')
            .attr('font-family', 'sans')
            .attr('font-size', '0.6rem')
            .attr('fill', '#6c78b3');     

        node.append('text')
            .attr('class','right')
            .text(d=>d.rightHeight)
            .attr('text-anchor', 'middle')
            .attr('y', '15px')
            .attr('x', '14px')
            .attr('font-family', 'sans')
            .attr('font-size', '0.6rem')
            .attr('fill', '#6c78b3');     

        node.append('text')
            .attr('class','value')
            .text(d=>d.val)
            .attr('text-anchor', 'middle')
            .attr('y', '5px')
            .attr('font-family', 'sans')
            .attr('fill', 'white')  
            .attr('font-size', '0.8rem');

        /* uncomment to display node index*/ 
        // node.append('text')
        //     .attr('class','index')
        //     .text(d=>d.index)
        //     .attr('text-anchor', 'middle')
        //     .attr('y', '40px')
        //     .attr('font-family', 'sans')
        //     .attr('fill', 'white')  
        //     .attr('font-size', '0.8rem');
 
    }

    node.append('title')
        .text(d => prettyFormat(d))    


    selection.select('#node-0 rect')
        .transition()
        .duration(t)
        .attr('stroke', D.nodeStrokeColor )    
        .attr('stroke-width', D.nodeStrokeSize )      

}

function getId(d){
    return `node-${d.index}`
}
function getIndex(d){
    return d.index
}

const updateNode = (shape='rect') => selection => {
 

    selection.select('rect')
        .attr('class', rectClass )
        .attr('stroke', d=>d.stepped ? 'yellow' : 'white');

        
    if(shape === 'rect'){
        selection
            .attr('class', d=>d.top ? "node top" : "node")
            .transition()
            .duration(t)
            .attr('transform', d => {
                return D.nodeLocationOnUpdate(d)
            })

        selection.select('.top text.value')
            .text(d=>d.value)
            .attr('fill', 'white')
            .transition()
            .attr('transform', D.nodeValueLocation);

        selection.select('text.index')
            .text(getIndex)
            .attr('fill', '#6c78b3');  
    }else{

        selection
            .attr('id', getId)    
            .transition()
            .duration(t)
            .attr('transform', d => {
                return D.nodePoint(d)
            })

        selection.select('text.value')
            .text(d=>d.value)
            .attr('fill', 'white')
            .transition()


        selection.select('text.height')
            .text(d=>d.height)
            .attr('text-anchor', 'middle')
            .attr('y', '-14px')
            .attr('font-family', 'sans')
            .attr('font-size', '0.6rem')
            .attr('fill', '#6c78b3'); 
            
        selection.select('text.left')
            .text(d=>d.leftHeight)
            .attr('text-anchor', 'middle')
            .attr('y', '15px')
            .attr('x', '-14px')
            .attr('font-family', 'sans')
            .attr('font-size', '0.6rem')
            .attr('fill', '#6c78b3');     

        selection.select('text.right')
            .text(d=>d.rightHeight)
            .attr('text-anchor', 'middle')
            .attr('y', '15px')
            .attr('x', '14px')
            .attr('font-family', 'sans')
            .attr('font-size', '0.6rem')
            .attr('fill', '#6c78b3');     

    }

    selection.select('title')
        .text(d => prettyFormat(d))    
    
    // make first node the end node    
    selection.select('#node-0 rect')
        .transition()
        .duration(t)
        .attr('stroke', D.nodeStrokeColor)    
        .attr('stroke-width', D.nodeStrokeSize)   
}

const exitNode = (shape='rect') => selection => {
    if((shape==='rect') ){
        selection
            .transition()
                .duration(t)
                .attr('transform', d=> {
                   
                    return D.initPoint(d)
                })
            .transition()
                .duration(t)
                .attr('transform',  D.entryPoint)
            .remove()
    } else {
        selection
        .transition()
            .duration(t)
            .attr('transform',  D.entryPoint)
        .remove()
    }

}

const enterLinkPath = selection => {
    selection.append('path')
        .attr('id', d=>`link-${d.id}`)
        .attr('class', 'link')
        .attr('stroke', '#8489c1')
        .attr('stroke-width', 1)
        .attr('fill', 'transparent')
        .attr('marker-start', d => ((d.source.y > d.target.y)  &&
                                    (d.source.x < d.target.x)) ? 'url(#mP)' : 'url(#mP2)' )
        .attr('d', d => D.genCurvePath( d.target.x-35, d.target.y, 280, -50) )
        .transition()
            .duration(t)
            .attr('d', D.linkLocationOnEnter1)
        .transition()
            .duration(t)
            .attr('d', D.linkLocationOnEnter2)
}
    
const updateLinkPath = selection => {
    selection.transition()
        .duration(t)
        .attr('marker-start', d => (d.source.y > d.target.y) ? 'url(#mP)' : 'url(#mP2)' )
        .attr('d', D.linkLocationOnUpdate)
}

const exitLinkPath = selection => {
    selection
        .transition()
        .duration(t)
        .attr('d', D.linkLocationOnExit)
        .remove();
}

const enterLineLink = selection => {
    selection.append('line')
        .attr('id', d=>`link-${d.id}`)
        .attr('class', d=>`link ${rectClass(d)}`)
        .attr('stroke', '#8489c1')
        .attr('stroke-width', 1)
        .attr('fill', 'transparent')
        .attr('marker-end',  'url(#mP2)') 
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        .transition()
            .duration(t)
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
        .transition()
            .duration(t)
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
}
    
const updateLineLink = selection => {
    selection.transition()
        .duration(t)
        .attr('class', d=>`link ${rectClass(d)}`)
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
}

const exitLineLink = selection => {
    selection
        .transition()
        .duration(t)
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        .remove();
}

const addNodes = (svg, nodes, nodeType='rect') => {
    const enterNodeType = nodeType === 'rect'
                        ? enterNode('rect')
                        : enterNode('circle');
    const updateNodeType = nodeType === 'rect'
                        ? updateNode('rect')
                        : updateNode('circle');
    const exitNodeType = nodeType === 'rect'
                        ? exitNode('rect')
                        : exitNode('circle');                    


    svg.select('.nodes')
        .selectAll('g.node')
        .data(nodes, d => d.index)
        .join(
            enterNodeType,
            updateNodeType,
            exitNodeType
        )
}

const addPathLinks = (svg, links) => {
    svg.select('.links')
    .selectAll('path')
    .data(links)
    .join(
        enterLinkPath,
        updateLinkPath,
        exitLinkPath
    )
}

const addLineLinks = (svg, links) => {
    svg.select('.links')
    .selectAll('line')
    .data(links)
    .join(
        enterLineLink,
        updateLineLink,
        exitLineLink
    )
}

export const showSelection = (svg, graph) => {

    const {nodes, links, paused, nodeType, linkType } = graph.current;
    
    if(graph.current.head){
        // Add a head node
        const headLink = createLink(-1, links.length, nodes, paused)
        updateHead(headLink) 
    }


    // Add path for every link in the dataset
    if(linkType === 'line'){
        addLineLinks(svg, links)
    } else {
        addPathLinks(svg, links)
    }
            
    // Add g for every node in the dataset     
    addNodes(svg, nodes, nodeType)

}



