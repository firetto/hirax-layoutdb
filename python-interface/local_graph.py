"""
local_graph.py

Contains the LocalGraph class, which contains an igraph.Graph instance and some methods to access and modify it.
Used for subgraphs in a GraphInterface.

Anatoly Zavyalov, 2021
"""

from log_to_file import log_to_file
from datetime import datetime

import igraph

class LocalGraph():
    """

    A wrapper class for an igraph.Graph instance.

    :ivar graph: Contains the igraph Graph.
    """

    graph: igraph.Graph


    def __init__(self) -> None:
        """
        Instantiate an empty igraph.Graph instance.        
        """

        self.graph = igraph.Graph()


    def create_from_connections_undirected(self, vertex_connections: list) -> None:
        """
        Instantiate a simple undirected igraph.Graph given pairs of vertices to connect.

        :param vertex_connections: A list of the format [(name1, name2), (name3, name4), ...] where name# represents the names of the vertices.
        :type vertex_connections: list[tuple[str, str]]
        """

        # See https://igraph.org/python/doc/tutorial/tutorial.html#setting-and-retrieving-attributes for help regarding igraph vertex/edge attributes.

        now = datetime.now()


        # vertex_properties[<PROPERTY>][i] denotes the <PROPERTY> value of the i'th vertex in the local graph.
        vertex_properties = {}

        # Dictionary of style {..., <i'th vertex name>: i, ...}.   
        vertex_name_to_ind = {}

        # List of 2-tuples containing the indices of the pairs of vertices to be added (instead of the names).
        vertex_index_connections = []

        # How many distinct vertices have been added so far
        vertices_so_far = 0

        for pair in vertex_connections:

            # the two indices of the two ends of the connection
            indices = []

            for i in range(len(pair)):

                # pair[i] is a dictionary with two keys: 'properties' and 'type'.
                properties = pair[i]['properties'] # This is a dictionary pointing to ARRAYS
                type = pair[i]['type'] # This is a STRING.

                properties['type'] = [type] # Just to make it consistent

                # TinkerPop maintains a **LIST** of values per key for vertex properties, so you must extract the first element from this list.
                name = properties['name'][0]

                if name not in vertex_name_to_ind:
                    vertex_name_to_ind[name] = vertices_so_far

                    for key in properties:
                        if key not in vertex_properties:
                            vertex_properties[key] = []

                        vertex_properties[key].append(properties[key][0]) # Extract the property from the list

                    vertices_so_far += 1


                indices.append(vertex_name_to_ind[name])

            vertex_index_connections.append(tuple(indices))

        self.graph = igraph.Graph(vertex_index_connections)

        for key in vertex_properties:
            self.graph.vs[key] = vertex_properties[key]

        self.graph.vs['label'] = self.graph.vs['name']


    def find_shortest_paths(self, name1: str, name2: str):
        """
        Given two vertices labelled with <name1> and <name2>, return the SHORTEST paths between the vertices.

        See https://igraph.org/python/doc/api/igraph._igraph.GraphBase.html#get_all_shortest_paths for documentation.

        :param name1: name property of the vertex to start the traversal at
        :type name1: str
        :param name2: name property of the vertex to end the traversal at
        :type name2: str
        """

        # TODO: maybe perform a check to see if the vertices exist?

        return self.graph.get_all_shortest_paths(name1, to=name2, weights=None, mode='all')
        

    def visualize_graph(self, target: str) -> None:
        """
        Export the graph as an image to :param target:.

        :param target: File location to export the file to. Should be in PNG, PDF, SVG or PostScript format.
        :type target: str
        """

        igraph.plot(self.graph, target=target)
    