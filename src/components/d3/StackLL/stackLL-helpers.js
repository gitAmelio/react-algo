import * as H from '../../../Utils/helpers'

const rowLength = (nodesPerRow, nodeInterval) => nodeInterval*(nodesPerRow-1);
const widthSpaceLeft = width => width - rowLength(4, 80);
export const xOffsetF = (dim = {width: 700}) => widthSpaceLeft(dim.width)/2;

export const xOfNodeC = (size, xOffset=300) => (index) => (( (((size-1) - index) % 4)          * 80 ) + xOffset)

export const yOfNodeC = (size, yOffset=200) => (index) => (( Math.floor( ((size-1)-index)/ 4)  * 80 ) + yOffset)

export const createNode = (x, y, nodeData, paused, top=false) => {
    const key  = nodeData[0];
    const item = nodeData[1];
    return {
        id: `node-${key}`,
        value: item.value, 
        val: item.value,
        index: key, 
        step: item.step,
        end: item.end,
        x, 
        y, 
        paused,
        top
    }
}

export const genNodesRecursive = ( nodes, paused, dimensions, dataSize ) => {
    
    if(H.empty(nodes)) return []
    
    const xOffset = xOffsetF(dimensions)

    const top = H.length(nodes) === 1;
    
    const [first, rest] = H.firstAndRest(nodes);
    const key  = first[0];
    const x = xOfNodeC(dataSize, xOffset)(key);
    const y = yOfNodeC(dataSize)(key);

    const node = createNode(x, y, first, paused, top )

    return H.consOnArray(node, genNodesRecursive(rest, paused, dimensions, dataSize))
}

export const getlastNode = (nodes) => {
    if(nodes && !H.empty(nodes)) {
        return nodes[nodes.length-1]
    } 
}

export const createLink = (sourceIndex, targetIndex, nodes) => {
    let source = {}

    if(sourceIndex < 0){
        source.x = 40;
        source.y = 20;
    } else {
        source = nodes[sourceIndex];
    }

    const target = nodes[targetIndex];
    const top = targetIndex === nodes.length-1;
    return  {
        index: sourceIndex,
        id: `[${sourceIndex}]->[${targetIndex}]`,
        source,
        target,
        value: 0.1,
        top: top, 
        step: top ? target.step : 0,
        end: top ? target.end : 0
    }

}
export const genLinks = nodes => nodes.reduce((a,c)=>{
    const index = a.length;
    if(nodes.length < 2) return [];
    return [...a, createLink(index, index+1, nodes)]
}, []);

export const generateNodeLinks = nodes => {
    const links = [];

    for(let i=0; i < nodes.length-1; i++){
        links.push(
            createLink(i, i+1, nodes)
        )
    }

    return links;
}