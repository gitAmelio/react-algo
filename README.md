# React-Algo

**An interactive visualiser for data structures and algorithms, built with React, Redux, and D3.**

Live demo → [gitAmelio.github.io/react-algo](https://gitAmelio.github.io/react-algo/)

![React Algo Logo](src/img/React-Algo-logo.png)

---

## What It Does

React-Algo lets you insert and delete values into data structures and watch exactly what happens — step by step, forwards and backwards — with animated nodes and links rendered by D3.

Currently implemented:

| Data Structure | Insert | Delete | Step-Through | Rebalancing |
|---|---|---|---|---|
| Stack / Linked List | ✅ | ✅ | ✅ | — |
| AVL Tree | ✅ | ✅ | ✅ | ✅ |

---

## Features

### Live Animated Visualisation
Every insert or delete triggers a D3-animated update — nodes and links generate, reposition, and rebalance in real time. The AVL tree recalculates balance factors, heights, and subtree widths automatically after every operation.

### Step-Through Mode
After any operation, you can step forwards or backwards through every decision the algorithm made:
- Each step highlights the active node with a **glow effect**
- Nodes requiring rotation or rebalancing glow in a **distinct colour**
- You can replay the full traversal path, rotation decisions, and final rebalance at your own pace

### AVL Tree Rebalancing
The AVL tree implementation handles all four rotation cases:
- **Left Rotate** — right-heavy imbalance
- **Right Rotate** — left-heavy imbalance
- **Left-Right Rotate** — left child is right-heavy
- **Right-Left Rotate** — right child is left-heavy

Balance factors and heights update at every affected node after each rotation.

### History-Aware Stepper
The stepper reconstructs tree state at any point in the operation history. Stepping backwards doesn't just undo — it replays the tree from scratch up to that point, ensuring the visual state is always accurate regardless of how far back you step.

---

## Architecture

```
src/
├── components/
│   └── d3/
│       ├── App.js                  # Root component — Redux store, routing
│       ├── AVLTree/
│       │   ├── AVLTreeDS.js        # Core AVL tree data structure & algorithms
│       │   ├── AVLTreeDS-helpers.js # Pure helper functions (height, balance factor, rotations)
│       │   ├── index.js            # AVL Tree React component & D3 rendering
│       │   ├── steps/
│       │   │   ├── stepper.js      # Step-through orchestration — routes to insert/delete/balance steppers
│       │   │   ├── insert.js       # Insert step logic
│       │   │   ├── delete.js       # Delete step logic
│       │   │   ├── balance.js      # Balance/rotation step logic
│       │   │   ├── step-helper.js  # Shared step utilities
│       │   │   └── index.js
│       │   ├── reducers/
│       │   │   └── avlTreeReducer.js
│       │   └── actions/
│       └── StackLL/
│           ├── index.js            # Stack/Linked List React component & D3 rendering
│           ├── stackLL-helpers.js
│           ├── reducers/
│           └── actions/
├── reducer/                        # Top-level page reducer
├── Utils/
│   ├── helpers.js                  # Shared functional utilities (empty, firstAndRest, etc.)
│   └── history.js                  # Browser history instance
└── __tests__/
    ├── insert.test.js
    ├── delete.test.js
    └── balance.test.js
```

### Key Design Decisions

**Immutable tree updates** — The AVL tree never mutates nodes in place during step-through mode. Every operation returns a new spread copy of the affected subtree (`{...root}`), keeping React's diffing and D3's transition system in sync.

**Separation of algorithm and rendering** — `AVLTreeDS.js` is a pure data structure class with no React or D3 dependencies. The D3 visualisation layer in `index.js` consumes the tree's output (`getNodesInOrder()`, `genAVLTreeLinks()`) and drives animations separately.

**History-aware stepper** — `stepper.js` doesn't store snapshots of tree state. Instead it rebuilds the tree from the operation history up to a given index, then applies the requested step. This keeps memory usage low and guarantees accuracy when stepping backwards across rebalancing events.

**Functional style throughout** — Helper functions in `Utils/helpers.js` and `AVLTreeDS-helpers.js` are pure functions. Recursive list processing uses `firstAndRest` decomposition rather than imperative loops.

---

## Getting Started

### Prerequisites
- Node.js
- Yarn

### Install & Run

```bash
git clone https://github.com/gitAmelio/react-algo.git
cd react-algo
yarn install
yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
yarn build
```

---

## Tech Stack

| | |
|---|---|
| **UI** | React 17, React Router |
| **State** | Redux, Redux Thunk |
| **Visualisation** | D3.js |
| **Styling** | CSS |
| **Testing** | Jest |
| **Deployment** | GitHub Pages |

---

## Roadmap

Planned data structures:
- [ ] Binary Search Tree
- [ ] Min/Max Heap
- [ ] Graph (BFS / DFS)
- [ ] Red-Black Tree

---

## Author

**Amelio Croza**
[github.com/gitAmelio](https://github.com/gitAmelio) · [Portfolio](https://epic-panini-af5668.netlify.app/)

---

*Built from scratch. No template. No boilerplate beyond Create React App.*