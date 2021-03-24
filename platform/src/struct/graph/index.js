import Node from './node';
import Stack from '../stack';
import HashMap from '../map';
import Queue from '../queue';

class Graph {
  constructor(edgeDirection = Graph.DIRECTED) {
    this.nodes = new HashMap();
    this.edgeDirection = edgeDirection;
  }

  addVertex(value) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    }
    const vertex = new Node(value);
    this.nodes.set(value, vertex);
    return vertex;
  }

  removeVertex(value) {
    const current = this.nodes.get(value);
    if (current) {
      Array.from(this.nodes.values()).forEach((node) => node.removeAdjacent(current));
    }
    return this.nodes.delete(value);
  }

  addEdge(source, destination) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);

    sourceNode.addAdjacent(destinationNode);

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationNode.addAdjacent(sourceNode);
    }

    return [sourceNode, destinationNode];
  }

  removeEdge(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);

      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationNode.removeAdjacent(sourceNode);
      }
    }

    return [sourceNode, destinationNode];
  }

  areAdjacents(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      return sourceNode.isAdjacent(destinationNode);
    }

    return false;
  }

  static* dfs(first) {
    yield* Graph.graphSearch(first, Stack);
  }

  static* bfs(first) {
    yield* Graph.graphSearch(first, Queue);
  }

  static* graphSearch(first, Type = Stack) {
    const visited = new Map();
    const visitList = new Type();

    visitList.add(first);

    while (!visitList.isEmpty()) {
      const node = visitList.remove();
      if (node && !visited.has(node)) {
        yield node;
        visited.set(node);
        node.getAdjacents().forEach((adj) => visitList.add(adj));
      }
    }
  }

  areConnected(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      const bfsFromFirst = Graph.bfs(sourceNode);
      for (const node of bfsFromFirst) {
        if (node === destinationNode) {
          return true;
        }
      }
    }

    return false;
  }

  findPath(source, destination, path = new Map()) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);
    const newPath = new Map(path);

    if (!destinationNode || !sourceNode) return [];

    newPath.set(sourceNode);

    if (source === destination) {
      return Array.from(newPath.keys());
    }

    for (const node of sourceNode.getAdjacents()) {
      if (!newPath.has(node)) {
        const nextPath = this.findPath(node.value, destination, newPath);
        if (nextPath.length) {
          return nextPath;
        }
      }
    }

    return [];
  }

  findAllPaths(source, destination, path = new Map()) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);
    const newPath = new Map(path);

    if (!destinationNode || !sourceNode) return [];

    newPath.set(sourceNode);

    if (source === destination) {
      return [Array.from(newPath.keys())];
    }

    const paths = [];
    sourceNode.getAdjacents().forEach((node) => {
      if (!newPath.has(node)) {
        const nextPaths = this.findAllPaths(node.value, destination, newPath);
        nextPaths.forEach((nextPath) => paths.push(nextPath));
      }
    });
    return paths;
  }
}

Graph.UNDIRECTED = Symbol('directed graph');
Graph.DIRECTED = Symbol('undirected graph');

export default Graph;
