import * as fs from 'fs';

import { IEdge } from 'types/edges';
import { Vertex } from 'types/vertex';

export function parseSteinLibFile(fileName: string) {
    const edges: IEdge[] = [];
    const terminals: Vertex[] = [];

    const fileContent = fs.readFileSync(fileName, 'utf8');
    const lines = fileContent.split('\n');

    while (lines.length > 0) {
        const line = lines.shift();

        if (line === 'SECTION Graph') {
            parseGraphSection();
        }

        if (line === 'SECTION Terminals') {
            parseTerminalsSection();
        }
    }

    return { edges, terminals };

    function parseGraphSection() {
        lines.shift(); // skip number of nodes line
        lines.shift(); // skip number of edges line

        let line = lines.shift();
        while (line !== 'END') {
            const [type, src, dst, cost] = line.split(' ');

            const edge = { src, dst, cost: Number.parseInt(cost) };
            edges.push(edge);

            line = lines.shift();
        }
    }

    function parseTerminalsSection() {
        lines.shift(); // skip number of terminals line

        let line = lines.shift();
        while (line !== 'END') {
            const [type, vertex] = line.split(' ');

            terminals.push(vertex);

            line = lines.shift();
        }
    }
}

export function parseRFile(fileName: string) {
    let edges: IEdge[] = [];
    const terminals: Vertex[] = [];
    const a2: IEdge[] = [];

    const blocked: IEdge[] = [];

    const fileContent = fs.readFileSync(fileName, 'utf8');
    const lines = fileContent.split('\n');
    let line = lines.shift();
    
    while (lines.length > 0) {
        if (line === 'ARCS') {
            parseArcsR(lines);
        }

        if (line === 'BLOCKAGES') {
            parseBlockagesR(lines);
        }

        if (line === 'TERMINALS') {
            parseTerminals(lines);
        }

        line = lines.shift();
    }
    
    edges = edges.filter(e => !blocked.find(b => b.src === e.src && b.dst === e.dst));
    produceA2();
    
    return { edges, terminals };

    function parseArcsR(lines: string[]) {
        let line = lines.shift();
    
        while (line.length > 0) {
            const [src, dst, cost] = line.split(' ');

            const edge = { src, dst, cost: Number.parseInt(cost) };
            edges.push(edge);

            line = lines.shift();
        }
    }

    function parseBlockagesR(lines: string[]) {
        let line = lines.shift();
    
        while (line.length > 0) {
            const [src, dst] = line.split(' ');

            const edge = { src, dst, cost: 0 };
            blocked.push(edge);

            line = lines.shift();
        }
    }

    function parseTerminals(lines: string[]) {
        let line = lines.shift();
    
        while (line.length > 0) {
            terminals.push(line);

            line = lines.shift();
        }
    }

    function produceA2() {
        edges.forEach(e => {

            const isBlocked = blocked.find(b => e.dst === b.src && e.src === b.dst);
            if (!isBlocked) {
                const exist = edges.find(candidata => candidata.dst === e.src && candidata.src === e.dst);
                if (!exist) {
                    edges.push({ src: e.dst, dst: e.src, cost: e.cost });
                }
            }

            e.cost = 0;
        });
    }
}

