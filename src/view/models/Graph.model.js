//  Graph
export default class {
  constructor() {
    this._nodes = new Map();
  }

  addNode(node) {
    if (this.nodes.has(node.element)) {
      return this.nodes.get(node.element);
    } else {
      this.nodes.set(node.element, node);
      this.element.appendChild(node.element);
      return node;
    }
  }

  removeNode(value) {
    const current = this.nodes.get(value);
    if (!current) return;
    for (const node of this.nodes.values()) node.removeAdjacent(current);
    this.element.removeChild(value)
    return this.nodes.delete(value);
  }

  addEdge(source, destination) {
    const sourceNode = this.addNode(source.element);
    const destinationNode = this.addNode(destination.element);
    sourceNode.addAdjacent(destinationNode);

    if (this.edgeDirection === 'UNDIRECTED') destinationNode.addAdjacent(sourceNode);

    const line = new Line({
      x1: sourceNode.centroid.x,
      y1: sourceNode.centroid.y,
      x2: destinationNode.centroid.x,
      y2: destinationNode.centroid.y,
    }, this._nodeFill, this);

    this.element.appendChild(line.element);
    sourceNode.edges.set(line.element, { nodeOrder: 0, element: line.element })
    destinationNode.edges.set(line.element, { nodeOrder: 1, element: line.element })
    this.addEdgeMode = !this.addEdgeMode;
    return [sourceNode, destinationNode];
  }

  removeEdge(sourceNode, destinationNode) {
    const sourceNode = this.vertices.get(sourceNode);
    const destinationNode = this.vertices.get(destinationNode);
    if (!(sourceNode || destinationNode)) return;

    sourceNode.removeAdjacent(destinationNode);
    if (this.edgeDirection === Graph.UNDIRECTED) destinationNode.removeAdjacent(sourceNode)
    return [sourceNode, destinationNode];
  }

  get adjacents() { return this._adjacentList };
  set adjacents(newValue) { this._adjacentList = newValue }
  get nodes() { return this._nodes };
  set nodes(newValue) { this._nodes = newValue }
}