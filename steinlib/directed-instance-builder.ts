import Graph from 'models/graph/graph';

import { IDirectedInstance } from 'steinlib';
import { parseRFile } from 'steinlib/parser';

export function buildDirectedInstance(steinLibFile: string): IDirectedInstance {
    const { edges, terminals } = parseRFile(steinLibFile);

    const graph = new Graph();

    edges.forEach(edge => {
        graph.addEdge({ src: edge.src, dst: edge.dst, cost: edge.cost });
    });
    const root = terminals.shift();

    if (!root) {
        throw new Error('instance doesn\'t have terminals');
    }

    return { graph, root, terminals };
}
