export const genCurvePath = (startX, startY, endX, endY) => {
    
    let curve = '';
    if(startX > endX && startY > endY  ) {

        const adjX = startX - endX;
        const adjY = (startY - endY)/4;
           
        const cx1 = startX - adjX;
        const cx2 = endX   + adjX;
        
        const cy1 = startY + adjY;
        const cy2 = endY   - adjY;
        
        curve = `${cx1}, ${cy1} ${cx2}, ${cy2}`
        
    } else {
        
        const gapX = ((startX - endX)/3) *-2;
        const gapY = (startY - endY)/-2;
        curve =` ${startX - gapX }, ${startY + gapY} ${endX + gapX}, ${endY - gapY}`;

    }

    const pd = `M${startX} ${startY} C ${curve} ${endX}, ${endY}`;
    return   pd;
}

export const initPoint   = () => `translate(${ 250 }, ${  50 } )`;
export const entryPoint  = () => `translate(${ 250 }, ${ -50 } )`;
export const nodePoint   = d  => `translate(${ d.x }, ${ d.y } )`;
export const firstNodeB   = d  => d.id === 'node-0';
export const stepsCompletedB = d => d.end === d.step;
export const steppedPass2B = d => d.paused && d.step > 2;
export const markAsFirstB  = d => ( firstNodeB(d) && ( stepsCompletedB(d) || steppedPass2B(d) ) )
export const stepSmallerThanEnd = d => d.step >= 0 && d.step < 3;
// export const nodeStrokeColor = d => markAsFirstB(d) ? 'darkorange' : 'white';
export const nodeStrokeColor = d => markAsFirstB(d) ? '#3c3f58' : 'white';
export const nodeStrokeSize  = d => markAsFirstB(d) ? 4 : 1;
export const topNodeB = d => d.paused && d.top;
export const nodeValueLocation = d => topNodeB(d) && d.step < 1 && d.step !== d.end ? `translate(${-250}, ${-220})` : `translate(${0}, ${0})`
export const nodeLocationOnEnter = d => {
    if( topNodeB(d) && stepSmallerThanEnd(d) ){
        return initPoint();
    } else {
        return nodePoint(d);
    }   
}
export const nodeLocationOnUpdate = d => {
    if(d.top && d.step === 0 && d.end > 0){
        return initPoint();
    } else if(d.top && d.step > 0 && d.step < 3 ){
        return initPoint();
    } else {
        return nodePoint(d);
    }   
}

export const linkLocationOnUpdate = d => {
    if(d.step > 1 && d.step < 3 && d.end > 0){
        return genCurvePath( d.source.x-30, d.source.y, 250+30, 50) 
    }
    if(d.step >= 0 && d.step < 2 && d.step !== d.end) return ''

    return genCurvePath( d.source.x-30, d.source.y, d.target.x+30, d.target.y) 
}
export const linkLocationOnExit = d => {
    if(d.step === d.end){
        return genCurvePath(d.target.x-30, d.target.y, 250+30, 50) 
    }
    return '';
}
const stepEqualsEnd = d => d.end === d.step;
const paused = d => d.paused;
const pointAtInit = d => genCurvePath( 250-80, 50-30, d.source.x, d.source.y  ); 
const pointAtNext = d => genCurvePath(  d.target.x-65+80, d.target.y-30, d.source.x, d.source.y); 
const pointAtLastNode = d => genCurvePath(  d.target.x-65, d.target.y-30, d.source.x, d.source.y );
const initToNext = d => genCurvePath(d.target.x+80-30, d.target.y, 250+30, 50);
const nodeToNode = d => genCurvePath( d.source.x-30, d.source.y, d.target.x+30, d.target.y);


export const headPathCoords1 = d => {
     if(((d.step === 2 && d.end > 0) || (stepEqualsEnd(d) && !paused(d))) && d.target){
         return  pointAtInit(d) 
    } else if( d.step < 2  && d.target.id !== "node-0" ){
         return  pointAtNext(d) 
    } 
    else{
        if(d.step > 1) return  pointAtLastNode(d) 
    }
    return ''
}
export const headPathCoords2 = d => {
    if((!(d.step< 2 && d.nodeCount === 1) || stepEqualsEnd(d))&& d.target ){
        if( d.step === 2 && paused ){
             return  pointAtInit(d) 
        }else
        if( d.step < 2){
             return  pointAtNext(d) 
        } else {
            // Pont to node after last node's position
            return  pointAtLastNode(d) 
        }    
    }        
    return ''
}
export const linkLocationOnEnter1 = d => d.step !== 0 ? initToNext(d) : ''
export const linkLocationOnEnter2 = d => d.step !== 0 ? nodeToNode(d) : ''
