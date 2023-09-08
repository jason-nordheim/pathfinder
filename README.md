# Pathfinder

This project implements the A\* Pathfinding Algorithm (derived from Dijkstra's algorithm) to find the best path between 2 nodes in a Graph. For simplicity, this Graph is represented as a grid.

## A\* vs Dijkstra

Both Dijkstra's algorithm and the A\* algorithm will find the shortest path between any two nodes in a graph.

The main difference is that the A* algorithm uses a "heuristic function" to prioritize which nodes are more likely to be on the shortest path to the goal. As a result, the A* algorithm will have better performance in larger graphs than Dijkstra's algorithm.

## Applications of Pathfinding Algorithms

There are many applications of pathfinding algorithms. A few are listed below:

- Games (e.g. planning character movement)
- Robotics (e.g. planning the motion of a robot)
- Networks (e.g. routing packets through a network)
- Mapping (e.g. finding the shortest path between two points on a map)

## Live Demo

You can find a live demo of the site [here](https://find-best-path.web.app/)

## Skills/Knowledge demonstrated in this project:

- Web Fundamentals
  - HTML/CSS
    - Flex box
    - CSS Grid
    - Events/Event Listeners
  - JavaScript/TypeScript
    - Classes (Object-Oriented Design)
    - Types
- React (TypeScript)
  - Native Hooks (`useEffect`, `useMemo`, `useState`)
  - Custom Hooks
  - Functional components
  - Props
- Redux Toolkit
  - Async Actions
  - Immer (immutable state updates)
  - Listener Middleware
- Unit testing using `vitest`
- Module bundling using `vite`
- Linting using `eslint`
- Deployment with Github Actions (to `firebase`)
- Understanding of data structures
  - Arrays
  - Maps
  - Queues
  - Sets
  - Hashes

> Note: the initial project was generated via the `vite` react-typescript template. [Read more](vite.README.md)
