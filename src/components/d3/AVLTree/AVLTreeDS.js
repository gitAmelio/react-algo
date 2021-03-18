import * as H from '../../../Utils/helpers'
import * as H2 from './AVLTreeDS-helpers'

export class AVLNode {
    constructor(value, index=0){
        this.value = value;
        this.index = index;
        this.leftChild = null;
        this.rightChild = null;
        this.height = 0;
        this.balanceFactor = null;
        this.leftHeight = null;
        this.rightHeight = null;
        this.status = '';
        this.deleteOK = false;
        this.deleteStep = 0;
        this.dSteps = 0;
        
        this.col = null;
        this.row = null;
        
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.leftSide = 0;
        this.rightSide = 0;
        this.last = true;
    }
}

export class AVLTreeDS {

    constructor (mem = {}, root=null) {
        this.root = root;

        this.step = 0;
        this.stop = 0;
        this.done = true;
        
        this.insertPathNodes = [];

        this.branceToBrace = 30;
        this.xNodeToNode = 40;
        this.yNodeToNode = 70;

        this.currentIndex = 0
        this.currentStep = 0
        this.syncStep = 0
        this.totalSteps = 0
        this.repeat = false 
        this.dimensions = {}
        this.memoizedSteps = []
        this.status = {msg: ''}

        const {
            deleteOK,
            deleteValue,
            action,
            prevAction,
            deleteIndex,
            insertRefStep,
            balanceRefStep,
            deleteRefStep,
            memoizedSteps
        } = mem

        
        this.deleteOK       = deleteOK
        this.deleteValue    = deleteValue
        this.action         = action || ''
        this.prevAction     = prevAction || ''
        this.deleteIndex    = deleteIndex
        this.insertRefStep  = insertRefStep || 0
        this.balanceRefStep = balanceRefStep || 0
        this.deleteRefStep  = deleteRefStep || 0
        this.memoizedSteps  = memoizedSteps || []

    }

    createRoot(value, index, stepped){
        return new AVLNode(value, index, stepped);
    }

    setLeaf(root){
        return {
            ...root,
            height: 0,
            balanceFactor: 0,
            leftHeight: -1,
            rightHeight: -1,
            last: this.isLast(root)
        }
    }

    isLast(root){
        return this.last && this.last.index === root.index;
    }

    isLeaf (root) {
        return  !root.leftChild && !root.rightChild
    }
    
    isMainRoot = root => root === this.root

    isMainRoot2(root){
        if(this.root && root){
            return this.root.index === root.index
        } else {
            return false
        }
    }

     __calcX (root, parentX, side) {
         if(!root.leftSide) root.leftSide = 0
         if(!root.rightSide) root.rightSide = 0
         if(!root.width) root.width = 0
 
        if(this.isMainRoot2(root)){
            return parentX - (((((root.width/2) - (root.leftSide)) * this.xNodeToNode)));
        } else
        if(side < 0 ){
            return parentX - (((root.rightSide ) * this.xNodeToNode) + this.branceToBrace); 
        } else 
        if(side > 0 ){
            return parentX + (((root.leftSide) * this.xNodeToNode) + this.branceToBrace); 
        }else {
            return  parentX + (side * (this.xNodeToNode + this.branceToBrace))
        }
     }

     __calcY (root, parentY) {
         return root.y = parentY + this.yNodeToNode; 
     }

    __position2 (root, parentX, parentY, side=1){

        if(!root) return null;
  
        const x = this.__calcX(root, parentX, side);
        const y = this.__calcY(root, parentY);

        return {
            ...root,
            x, y,
            leftChild: this.__position2(root.leftChild,  x, y, -1),
            rightChild: this.__position2(root.rightChild, x, y,  1)
        }
    }

    xFromDimensions(dimensions){
        return dimensions.width/2 
    }   

    yFromDimensions(dimensions){
        return (
            ( dimensions.height
            -(this.yNodeToNode * (1+this.getTreeHeight())))/2
            - this.yNodeToNode 

        ) 
    }

    position(dimensions){

        if(!this.root) return;

        const x = this.xFromDimensions(dimensions)
        const y = this.yFromDimensions(dimensions)
        
        this.root = this.updateTree(this.root)

        this.root = this.__position2(this.root, x, y)
    }

    calcHeight (root) {

        if(!root) return 0;

        if(root && root.left !== undefined && root.right !== undefined){
            return Math.max(root.left, root.right)+1
        }

        return Math.max(H2.calcHeight(root.leftChild), H2.calcHeight(root.rightChild) )+1
        
    }

    setHeight (root) {
        root.height = this.__calcHeight(root)
        return root.height;
    }

    getHeight (root) {
        return H2.calcHeight(root)
    }

    getTreeHeight(){

        if(!this.root) return 0

        return H2.calcHeight(this.root)

    }

    setBalanceFactor(root){

        root.balanceFactor = H2.balanceFactor(root);

        return root.balanceFactor;

    }

    __calcSides2(root, x=0, y=0){
        if(!root) return 0;
        const leftSide  = this.__calcSides2(root.leftChild,  x - 1,  y + 1);
        const rightSide = this.__calcSides2(root.rightChild, x + 1,  y + 1);

        return leftSide + rightSide + 1
    }

    updateTree(root,  col=0, row=0){

        if(!root) return null;
        
        if(this.isLeaf(root))  return this.setLeaf(root)

        const leftChild = this.updateTree(root.leftChild,   row + 1, col - 1);
        const rightChild = this.updateTree(root.rightChild,  row + 1, col + 1);

        // PostOrder

        const leftHeight = H2.calcHeight(root.leftChild);
        const rightHeight = H2.calcHeight(root.rightChild);
        const height = H2.calcHeight(root);

        const leftSide = this.__calcSides2(root.leftChild,  row + 1,  col - 1)
        const rightSide = this.__calcSides2(root.rightChild,  row + 1, col + 1);
        const width = leftSide + rightSide + 1;

        const balanceFactor = H2.balanceFactor(root)
        
        return {
            ...root,
            leftChild: leftChild ? {...leftChild} : null, 
            rightChild: rightChild ? {...rightChild} : null, 
            leftHeight,
            rightHeight,
            height,
            balanceFactor,
            leftSide,
            rightSide,
            width,
            col,
            row,
            steppped: this.isLast(root)
        }
    }

    __height (root) {

        if(!root) return -1;

        if(this.isLeaf(root)){
            root.height = 0;
            root.balanceFactor = 0;
            root.leftHeight = -1;
            root.rightHeight = -1;
            return 0;
        } 
        const left  = this.__height(root.leftChild);
        const right = this.__height(root.rightChild);
        const leftAndRight = {left, right}
        root.leftHeight = left;
        root.rightHeight = right;
        root.height = H2.calcHeight(leftAndRight)
        root.balanceFactor = H2.balanceFactor(leftAndRight)
        this.__calcSides(root)
        
        return root.height;

    }
    
    __balanceFactor (root) {

        if(!root) return 0;

        if(root && root.left !== undefined && root.right !== undefined){
            return root.left - root.right
        }

        return H2.calcHeight(root.leftChild) - H2.calcHeight(root.rightChild);
    }

    isLeftHeavy (root) {
        return H2.balanceFactor(root) > 1;
    }

    isRightHeavy (root) {
        return H2.balanceFactor(root) < -1;
    }

    leftRotate (root) {
        const newRoot = root.rightChild;

        root.rightChild = newRoot.leftChild;
        newRoot.leftChild = root;
        
        this.__height(root);
        this.__height(newRoot);
        
        return newRoot;

    }

    rightRotate (root) {
        const newRoot = root.leftChild;  

        root.leftChild = newRoot.rightChild; 
        newRoot.rightChild = root;
        
        this.__height(root); 
        this.__height(newRoot);
        
        return newRoot;

    }

    leftRotateWS (root, step, stop) {
        const {rightChild} = root;
        const {leftChild}  = rightChild;
        const updateRoot = {...root, rightChild: leftChild ? {...leftChild} : null}
        const newRoot = {...rightChild, leftChild: {...updateRoot}}

        return {...newRoot};
    }

    rightRotateWS (root, step, stop) {
        const {leftChild} = root;
        const {rightChild}  = leftChild;
        const updateRoot = {...root, leftChild: rightChild ? {...rightChild} : null}
        const newRoot = {...leftChild, rightChild: {...updateRoot}}

        return {...newRoot};

    }

    balance(root){
        
        if(!root) return [false,false,false];

        if(H2.isLeftHeavy(root)) {
            if(H2.balanceFactor(root.leftChild) < 0){
                root.leftChild = {...H2.leftRotate(root.leftChild)}                
            }

            return [{...H2.rightRotate(root)}, 0, false]

        } else if(H2.isRightHeavy(root)) {
            if(H2.balanceFactor(root.rightChild) > 0) {
                root.rightChild = {...H2.rightRotate(root.rightChild)};
            }
            return [{...H2.leftRotate(root)}, 0, false];
            
            
        }
        return [{...root}, 0, false];
    }
    balanceWS(root, step, stop, repeat){
        let balanceStep = step;

        if(!root) return [false,false,false];

        if(H2.isLeftHeavy(root)) {

            if(H2.balanceFactor(root.leftChild) < 0){

                if(balanceStep === stop) return [{...root}, balanceStep, true]
                root.leftChild = {...H2.leftRotate(root.leftChild)}                
                    
            }
            if(balanceStep === stop) return [{...root}, balanceStep, true]
            return [{...H2.rightRotate(root, balanceStep+1, stop)}, balanceStep, false]

        } else if(H2.isRightHeavy(root)) {
            if(H2.balanceFactor(root.rightChild) > 0) {
                if(balanceStep === stop) return [{...root}, balanceStep, true]
                
                root.rightChild = {...H2.rightRotate(root.rightChild, balanceStep+1, stop)};
            }
            if(balanceStep === stop) return [{...root}, balanceStep, true];
            return [{...H2.leftRotate(root)}, balanceStep, false];
        }

        return [{...root}, balanceStep, false];

    }
    
    getStepsForbalance(root, step, stop, repeat){
        let balanceStep = step;

        if(!root) return 0;
        
        if(H2.isLeftHeavy(root)) {
            if(H2.balanceFactor(root.leftChild) < 0){
                if(balanceStep === stop) return balanceStep + 1
            }
            if(balanceStep === stop) return balanceStep + 1
        } else if(H2.isRightHeavy(root)) {
            if(H2.balanceFactor(root.rightChild) > 0) {
                if(balanceStep === stop) return balanceStep + 1
            }
            if(balanceStep === stop) return balanceStep + 1
        }

        return balanceStep;

    }
 
    __balanceWithInput(root, data, step=0, stop){
        
        if(!root || !data) return [null,null,false] 
        
        if(data.index === root.index){            
            const [bRoot, bStep, bNewRepeat] = this.balance(root)
            return [{...bRoot}, bStep, bNewRepeat];
        }     
     
        if(data.value < root.value ){
            const [tempRoot, tempStep, tempRepeat] = this.__balanceWithInput(root.leftChild, data)
            if(tempRepeat) return [{...tempRoot}, tempStep, tempRepeat]
            root.leftChild = {...tempRoot}
        } else 
        if(data.value > root.value){
            const [tempRoot, tempStep, tempRepeat] = this.__balanceWithInput(root.rightChild, data)
            if(tempRepeat) return [{...tempRoot}, tempStep, tempRepeat]
            root.rightChild = {...tempRoot}
        }

        return [root, step, false];

    }
    __balanceWithInputWS(root, data, step=0, stop){
        
        if(!root || !data) return [null,null,false] 
        
        if(data.index === root.index){            
            const [bRoot, bStep, bNewRepeat] = this.balanceWS(root, step, stop)
            return [{...bRoot}, bStep, bNewRepeat];
        }     
     
        if(data.value < root.value ){
            const [tempRoot, tempStep, tempRepeat] = this.__balanceWithInputWS(root.leftChild, data, step, stop)
            if(tempRepeat) return [{...tempRoot}, tempStep, tempRepeat]
            root.leftChild = {...tempRoot}
        } else 
        if(data.value > root.value){
            const [tempRoot, tempStep, tempRepeat] = this.__balanceWithInputWS(root.rightChild, data, step, stop)
            if(tempRepeat) return [{...tempRoot}, tempStep, tempRepeat]
            root.rightChild = {...tempRoot}
        }

        return [root, step, false];

    }
    __getStepsForbalanceWithInput(root, data, step=0, stop){
        
        if(!root || !data) return [step, false] 
        
        if(data.index === root.index){            
            const bStep = this.getStepsForbalance(root, step, stop)
            return [ bStep, !(bStep === stop)];
        }     
     
        if(data.value < root.value ){
            const [tempStep, tempRepeat] = this.__getStepsForbalanceWithInput(root.leftChild, data, step, stop)
            if(tempRepeat) return [tempStep, tempRepeat]
        } else 
        if(data.value > root.value){
            const [tempStep, tempRepeat] = this.__getStepsForbalanceWithInput(root.rightChild, data, step, stop)
            if(tempRepeat) return [tempStep, tempRepeat]
        }

        return [step, false];

    }
    insertPath(data){
        const [tempRoot, tempStep, tempRepeat] = this.__balanceWithInput(this.root, data)
        this.root = {...tempRoot}
        return [tempStep, tempRepeat]
    }
    insertPathWS(data, step, stop){
       const [tempRoot, tempStep, tempRepeat] = this.__balanceWithInputWS(this.root, data, step, stop)
       this.root = {...tempRoot}
       return [tempStep, tempRepeat]
    }

    getInsertSteps(root, step=0, stop){

        if(!this.root) return step;

        if(!root) return step;

        const value = this.last.value

        if(!root || step === stop ){
            return step
        }
        let newSteps = step;

        if(value < root.value ){
            newSteps = this.getInsertSteps(root.leftChild, step+1, stop) 
        } else 
        if(value > root.value){
            newSteps = this.getInsertSteps(root.rightChild, step+1, stop) 
        }

        if(this.isLeftHeavy(root)) {

            if(H2.balanceFactor(root.leftChild) < 0){
                newSteps =+ 1

                if(newSteps === stop) return  newSteps        
            }
            newSteps =+ 1

            if(newSteps === stop) return newSteps  

        } else if(this.isRightHeavy(root)) {

            if(H2.balanceFactor(root.rightChild) > 0) {
                newSteps =+ 1

                if(newSteps === stop) return newSteps   
            }
            newSteps =+ 1

            if(newSteps === stop) return newSteps  

        }

        return newSteps

    }
    clearLast(){

        if(!this.last) return false;

        const root = this.findRoot(this.last.value)
        if(!root) return false;
        root.last = false

    }
    getNodeIndex(value){
        if(!this.root) return null

        const root = this.findRoot(value)
        
        if(root) return root.index 

        return null
    }

    __insertWithSteps (root, data) {
     
        if(!data) return null;

        const {value, index, stepped} = data; 

        if(!root){
            if(this.last) {
                this.clearLast()
            }
            this.last = new AVLNode(value, index, stepped);

            return this.last
        } 
   
        root.last = false;

        if(value < root.value){
            root.leftChild = {...this.__insertWithSteps(root.leftChild, data)}
        } else {
            root.rightChild = {...this.__insertWithSteps(root.rightChild, data)}
        }

        this.insertPathNodes = [...this.insertPathNodes, {index: root.index, value: root.value}]
       
        return {...root}

    }
    __checkForInbalanceWS = (list, step, stop) => {

        if(H.empty(list)) return [step, false]
        
        const [first, rest] = H.firstAndRest(list);
            
        const [tempStep, tempRepeat] = this.insertPathWS(first, step, stop)
        if(tempRepeat) return [tempStep, tempRepeat]
 
        return this.__checkForInbalanceWS(rest, step, stop)

    }
    checkForInbalanceWS(step,stop){
        return this.__checkForInbalanceWS(this.insertPathNodes, step, stop)
    }

    __getStepsCheckForInbalance = (list, step, stop) => {

        if(H.empty(list)) return step
        
        const [first, rest] = H.firstAndRest(list);
            
        const [tempStep, tempRepeat] = this.__getStepsForbalanceWithInput(this.root, first, step, stop)
        if(tempRepeat) return tempStep
        
        return this.__getStepsCheckForInbalance(rest, step, stop)

    }

    getStepsCheckForInbalance(step,stop){
        return this.__getStepsCheckForInbalance(this.insertPathNodes, step, stop)
    }

    __checkForInbalance = (list) => {

        if(H.empty(list)) return [0, false]
        
        const [first, rest] = H.firstAndRest(list);

        const [tempStep, tempRepeat] = this.insertPath(first)
       
        if(tempRepeat) return [tempStep, tempRepeat]
 
        return this.__checkForInbalance(rest)

    }
    checkForInbalance(step,stop){
        return this.__checkForInbalance(this.insertPathNodes, step, stop)
    }
    
    insertWithSteps = (data) => {
        this.insertPathNodes = []

        const root = this.__insertWithSteps(this.root, data)

        this.root = root;

        const tempRepeat = this.__checkForInbalance(this.insertPathNodes)
        return tempRepeat;
        
    }
    __insert (root, data) {

        if(!data) return false;

        const {value, index, stepped} = data; 

        if(!root){
            return new AVLNode(value, index, stepped)
        } 

        root.last = false;
        if(value < root.value){
            root.leftChild = this.__insert(root.leftChild, data)
        } else {
            root.rightChild = this.__insert(root.rightChild, data)
        }

        return this.balance(root)    

    }
    insert (data) {
        this.root = this.__insert(this.root, data)
    }

    findRoot = (value) => {
        return H2.findRoot(this.root, value);
    }
    
    __nodesAtDistance = (root, distance) => {

        if(!root) return [];
        
        if(distance === 0) {
            return [root.value]
        }

        return [
            ...this.__nodesAtDistance(root.leftChild,  distance-1),
            ...this.__nodesAtDistance(root.rightChild, distance-1)
        ]

    }

    nodesAtDistance = distance => {

        if(!this.root) return []

        return this.__nodesAtDistance(this.root, distance)

    }

    __traverseLevelOrder = (start, end) => {

        if(start > end) return []
        
        return [ this.nodesAtDistance(start), ...this.__traverseLevelOrder(start+1, end) ]

    }

    traverseLevelOrder = () => {
        const h = H2.calcHeight(this.root);

        return this.__traverseLevelOrder(0, h);
    }

    __traverseInOrder(root){
        if(!root) return [];

        const {
            value,
             x, y, 
             height, 
             balanceFactor,
             leftHeight,
             rightHeight,
             col,
             width,
             leftSide,
             rightSide,
             index,
             last,
             status,
             focus 
            } = root

        
        const node = {
            id: `node-${index}`,
            index: index,
            i: index,
            val: value,
            step: 0,
            end: 0,
            paused: false,
            top: false,
            value,
            x, y,
            height,
            balanceFactor,
            leftHeight,
            rightHeight, 
            col,
            width,
            leftSide,
            rightSide,
            stepped: focus,
            last,
            status,
            focus 
        }
        
        return [
            ...this.__traverseInOrder(root.leftChild),
            node,
            ...this.__traverseInOrder(root.rightChild)
        ]
    }

    getNodesInOrder(){
        return this.__traverseInOrder(this.root)
    }

    genAVLTreeWithStep(nodes, step, stop){

        if(step === stop || stop < 0) return this;
 
        if(H.empty(nodes)) return this;

        const [first, rest] = H.firstAndRest(nodes);

        const last = stop - step === 1

        const data = {
            index: +first[0], 
            ...first[1],
            last
        }
 
        this.insertWithSteps (data)

        return this.genAVLTreeWithStep(rest, step+1, stop)

    }
   
    nodesToArray(nodes){

        if(H.empty(nodes)) return []

        const [first, rest] = H.firstAndRest(nodes)        

        const data = {
            index: +first[0], 
            deleted: false,
            ...first[1],
        }

        return [data, ...this.nodesToArray(rest)]

    }

    getDeletedNodes(nodes){

        if(H.empty(nodes)) return []
        
        const [first, rest] = H.firstAndRest(nodes)

        let data = []
      
        if(first.deleted){
           data = [ {...first} ]
        }

        return [...data, ...this.getDeletedNodes(rest)]

    }

    __deleteNodes = (deletes) => {

        if(H.empty(deletes)) return this

        const [first, rest] = H.firstAndRest(deletes)

        this.deleteNode2(first)

        return this.__deleteNodes(rest)
    
    }

    deleteNodes = (deletes) => {
   
       if(!deletes) return this 
             
       return this.__deleteNodes(deletes)
        
    }

    __simplify(root) {
        if(!root) return 'null'
        if(!root.leftChild && !root.rightChild) return `${root.value}`
    
        return ` ${root.value} > { ${this.__simplify(root.leftChild)}, ${this.__simplify(root.rightChild)} }`
    }
    simplify(){
        return this.__simplify(this.root)
    }

    genAVLTree(nodes){
        
        if( H.length(nodes) === 1 ){

            return this;

        }    

        if(H.empty(nodes)) return this;

        const [node, rest] = H.firstAndRest(nodes);

        const first = H2.nodeProperties(node)

        const last = H.length(nodes) === 1

        this.root = H2.rootInsert(this.root, first.value, first.index, last)


        return this.genAVLTree(rest)
    }

    // Creating links for Nodes 

    theta = (o,a) => Math.atan(o/a)

    adjacent = (theta, h) => Math.cos(theta) * h

    opposite = (theta, h) => Math.sin(theta) * h
    
    radiusPoints = (h, source, target) => {

        const a = source.x - target.x;
        const o = source.y - target.y;
        const theta1 = this.theta(o,a); 
        const theta2 = this.theta(a,o);
        
        let x1 = 0;
        let y1 = 0;
        if(source.x < target.x){
            x1 = source.x + this.adjacent(theta1, h); 
            y1 = source.y + this.opposite(theta1, h);
        } else {
            x1 = source.x - this.adjacent(theta1, h); 
            y1 = source.y - this.opposite(theta1, h);
        }
        
        const x2 = target.x - this.opposite(theta2, h);
        const y2 = target.y - this.adjacent(theta2, h);

        return {x1, y1, x2, y2};

    }

    createLink(source, target){
        
        return {
            index: source.value,
            id: `[${source.value}]->[${target.value}]`,
            source,
            target,
            value: 0.1,
            top: false, 
            step: target.step ,
            end:  target.end,
            stepped: source.stepped && target.stepped,
            ...this.radiusPoints( 28, source, target ) 
        }
    
    }

    genLinks(root, child){

        if(!child) return [];
        
        return  [
            ...this.genLinks(child, child.leftChild),
            this.createLink(root, child),
            ...this.genLinks(child, child.rightChild)
        ]
        
    }
    
    genAVLTreeLinks(){

        if(!this.root ) return []

        return  [
            ...this.genLinks(this.root, this.root.leftChild),
            ...this.genLinks(this.root, this.root.rightChild)
        ]

    } 
    __times = (c, n) => {
        if(n === 0) return '';
    
        return c + this.__times(c, n-1);   
    }

    stepMessage (msg, value) {

        this.status = { msg, value } 

    }

    getTargetAndParent(root, deleteData, parent, side=true, step){

        if(!root) return [root, parent, side];
        
        const {value, index} = deleteData
       
        if(root.value === value && root.index === index) {
            return [root, parent, side]
        }    
       
        if(value < root.value){

            return this.getTargetAndParent(root.leftChild, deleteData, root, true, step-1)

        } else {

            return this.getTargetAndParent(root.rightChild, deleteData, root, false, step-1)

        }
    }

    deleteNode2(deleteData){

        let focusNode = this.root
        let parent = this.root

        let isItAtLeftChild = true;

        const [target, p, side] = this.getTargetAndParent(this.root, deleteData, true)
        
        if(!target) return null

        focusNode = target
        parent = p;
        isItAtLeftChild = side;

        if(!focusNode.leftChild && !focusNode.rightChild){
            if(focusNode === this.root){

                this.root = null

            } else if(isItAtLeftChild){

                parent.leftChild = null;

            } else {

                parent.rightChild = null;

            }
        } else 
        if(!focusNode.rightChild){
            if(focusNode === this.root){

                this.root = focusNode.leftChild;

            } else
            if(isItAtLeftChild){

                parent.leftChild = focusNode.leftChild;

            } else {

                parent.rightChild = focusNode.leftChild;

            }
        } else 
        if(!focusNode.leftChild){
            if(focusNode === this.root){

                this.root = focusNode.rightChild;

            } else 
            if(isItAtLeftChild){

                parent.leftChild = focusNode.rightChild

            } else {

                parent.rightChild = focusNode.rightChild;

            }
        } else {
            const replacement = this.getReplacementNode(focusNode)
            
            if(focusNode === this.root){

                this.root = replacement;

            } else
            if(isItAtLeftChild) {

                parent.leftChild = replacement

            } else {

                parent.rightChild = replacement;

            }

            replacement.leftChild = focusNode.leftChild;
        }
        return this;
    }
    
    getReplacementNode(replacdNode) {

        let replacementParent = replacdNode;
        let replacement = replacdNode;
        
        let focusNode = replacdNode.rightChild

        while (focusNode != null){
            replacementParent = replacement;
            replacement = focusNode;
            focusNode = focusNode.leftChild;
        }

        if(replacement !== replacdNode.rightChild){
            replacementParent.leftChild = replacement.rightChild;
            replacement.rightChild = replacdNode.rightChild;
        }

        return replacement;
    }

    updateTree2 ( newRoot, dimensions, stepping) {
        this.root = newRoot

        this.position(dimensions)
   
        this.nodes = this.getNodesInOrder()
    
        this.nodesSortedByIndex = this.nodes.sort((a, b) => a.index - b.index)
    
        this.links = this.genAVLTreeLinks()
    
        return { ...this, __proto__: this.__proto__ }
    }
  
}