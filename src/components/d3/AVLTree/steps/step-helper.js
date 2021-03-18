export class AVLNode {
    constructor(value, index = 0) {
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

const showFocus = root => root.focus ? ` [${root.value}] ` : root.value

const showUpdates = root => `[${root.value}, ${root.height}, (${root.leftHeight}, ${root.rightHeight}), ${root.balanceFactor} ]`
export const simplifyUpdates = root => {

    if (!root) return 'null'

    if (!root.leftChild && !root.rightChild) return `${showUpdates(root)}`

    return ` ${showUpdates(root)} > { ${simplifyUpdates(root.leftChild)}, ${simplifyUpdates(root.rightChild)} }`

}

export const simplify = root => {

    if (!root) return 'null'

    if (!root.leftChild && !root.rightChild) return `${showFocus(root)}`

    return ` ${showFocus(root)} > { ${simplify(root.leftChild)}, ${simplify(root.rightChild)} }`

}

export const duplicateRoot = root => {

    if (!root) return null;

    return {
        ...root,
        leftChild: duplicateRoot(root.leftChild),
        rightChild: duplicateRoot(root.rightChild)
    }

}

export const isLeaf = (root) => {
    return !root.leftChild && !root.rightChild
}

export const findRoot = (root, value) => {
    if (!root) return null;

    if (value === root.value) return root

    if (value < root.value) {
        return findRoot(root.leftChild, value)
    } else
        if (value > root.value) {
            return findRoot(root.rightChild, value)
        }
}

const __insert = (root, data) => {

    if (!data) return false;

    const { value, index, stepped } = data;

    if (!root) {
        return new AVLNode(value, index, stepped)
    }

    root.last = false;
    if (value < root.value) {
        return { ...root, leftChild: __insert(root.leftChild, data) }
    } else {
        return { ...root, rightChild: __insert(root.rightChild, data) }
    }

}

export const insert = (root, data) => {

    const exist = findRoot(root, data.value)

    if (exist) return root

    return __insert(root, data)

}

const calcHeight = root => {

    if (!root) return 0;

    if (root && root.left !== undefined && root.right !== undefined) {
        return Math.max(root.left, root.right) + 1
    }

    return Math.max(calcHeight(root.leftChild), calcHeight(root.rightChild)) + 1

}

export const balanceFactor = root => {

    if (!root) return 0;

    if (root && root.left !== undefined && root.right !== undefined) {
        return root.left - root.right
    }

    return calcHeight(root.leftChild) - calcHeight(root.rightChild);
}

export const isLeftHeavy = root => {
    return balanceFactor(root) > 1;
}

export const isRightHeavy = root => {
    return balanceFactor(root) < -1;
}

export const leftRotate = (root) => {
    const { rightChild } = root;
    const { leftChild } = rightChild;
    const updateRoot = { ...root, rightChild: leftChild ? { ...leftChild } : null }
    const newRoot = { ...rightChild, leftChild: { ...updateRoot } }

    return { ...newRoot };
}

export const rightRotate = (root) => {
    const { leftChild } = root;
    const { rightChild } = leftChild;
    const updateRoot = { ...root, leftChild: rightChild ? { ...rightChild } : null }
    const newRoot = { ...leftChild, rightChild: { ...updateRoot } }

    return { ...newRoot };
}

export const balance = (root) => {

    if (!root) return null;

    if (isLeftHeavy(root)) {

        if (balanceFactor(root.leftChild) < 0) {
            root.leftChild = { ...leftRotate(root.leftChild) }
        }

        return { ...rightRotate(root) }

    } else if (isRightHeavy(root)) {

        if (balanceFactor(root.rightChild) > 0) {
            root.rightChild = { ...rightRotate(root.rightChild) };
        }

        return { ...leftRotate(root) };

    }
    return { ...root };
}

export const clearPath = (root, value) => {

    if (!root) return null;

    if (!value || value === root.value) return root;

    root.focus = false

    root.status = ''

    if (value < root.value) {
        return { ...root, leftChild: clearPath(root.leftChild, value) }
    } else {
        return { ...root, rightChild: clearPath(root.rightChild, value) }
    }
}

export const clearRoot = (root) => {

    if (!root) return null;

    root.focus = false

    root.status = ''

    return {
        ...root,
        leftChild: clearRoot(root.leftChild),
        rightChild: clearRoot(root.rightChild)
    }

}

const calcSides = (root, x = 0, y = 0) => {
    if (!root) return 0;
    const leftSide = calcSides(root.leftChild, x - 1, y + 1);
    const rightSide = calcSides(root.rightChild, x + 1, y + 1);

    return leftSide + rightSide + 1
}

const setLeaf = (root) => {
    return {
        ...root,
        height: 0,
        balanceFactor: 0,
        leftHeight: -1,
        rightHeight: -1,

    }
}

export const updateRoot = (root, col = 0, row = 0) => {

    if (!root) return null;

    if (isLeaf(root)) return setLeaf(root)

    const leftChild = updateRoot(root.leftChild, row + 1, col - 1);
    const rightChild = updateRoot(root.rightChild, row + 1, col + 1);

    // PostOrder

    const leftHeight = calcHeight(root.leftChild);
    const rightHeight = calcHeight(root.rightChild);
    const height = calcHeight(root);

    const leftSide = calcSides(root.leftChild, row + 1, col - 1)
    const rightSide = calcSides(root.rightChild, row + 1, col + 1);
    const width = leftSide + rightSide + 1;

    const bFactor = balanceFactor(root)

    return {
        ...root,
        leftChild: leftChild ? { ...leftChild } : null,
        rightChild: rightChild ? { ...rightChild } : null,
        leftHeight,
        rightHeight,
        height,
        balanceFactor: bFactor,
        leftSide,
        rightSide,
        width,
        col,
        row,
    }
}

export const genNodeHash = (arr, index = 0) => {
    if (arr.length === 0) return {}
    const [first, ...rest] = arr
    const node = { value: first, index: (first.index || index) }
    return { [index]: node, ...genNodeHash(rest, index + 1) }
}

export const hashToArray = obj => Object.keys(obj).map(d => ({ ...obj[d], index: +d }))

export const insertWithoutBalance = (data, root = null) => {
    const arr = Array.isArray(data) ? data : hashToArray(data)
    return arr.reduce((a, c) => insert(a, c), root)
}
export const cleanUpResult = result => {

    let newRoot = result.root

    newRoot = clearRoot(result.root)
    newRoot = updateRoot(newRoot)

    return {
        ...result,
        root: { ...newRoot, status: '' },
        msg: '',
        done: true,
        active: true,
        taskDone: result.taskDone
    }
} 
