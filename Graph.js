export class Graph {
    constructor(){
        // Omg it's an empty Map!
        this.AdjList = new Map();
        this.vertexData = new Map();
    }

    addVertex(v, vData) {
        // Sets the vertex v in list to an empty list (adds it!)
        this.AdjList.set(v, []);
        this.vertexData.set(v, vData);
    }

    addEdge(v, w, undirected = true) {
        this.AdjList.get(v).push(w);

        if (undirected) {
            this.AdjList.get(w).push(v);
        }
    }
    
    getEdges(v) {
        return this.AdjList.get(v);
    }

    getData(v) {
        return this.vertexData.get(v);
    }

    setData(v, vData) {
        this.vertexData.set(v, vData);
    }

    // Prints the vertex and adjacency list
    printGraph()
    {
        // get all the vertices
        var get_keys = this.AdjList.keys();
    
        // iterate over the vertices
        for (var i of get_keys) {
            // get the corresponding adjacency list
            // for the vertex
            var get_values = this.AdjList.get(i);
            var conc = "";
    
            // iterate over the adjacency list
            // concatenate the values into a string
            for (var j of get_values)
                conc += j + " ";
    
            // print the vertex and its adjacency list
            console.log(i + " -> " + conc);
        }
    }

}