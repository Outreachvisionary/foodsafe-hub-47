
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Box, Factory, Truck, Store, Download, ZoomIn, ZoomOut, MousePointer } from 'lucide-react';
import { GraphData, GraphNode, GraphEdge, PartnerType } from '@/types/traceability';

interface SupplyChainVisualizationProps {
  data: GraphData | null;
  onNodeClick?: (nodeId: string) => void;
}

// Define colors for different node types
const nodeColors: Record<string, string> = {
  'Supplier': '#4ade80',    // Green
  'Manufacturer': '#3b82f6', // Blue
  'Distributor': '#f97316',  // Orange
  'Retailer': '#a855f7'      // Purple
};

// Define node icon components
const nodeIcons: Record<string, React.ReactNode> = {
  'Supplier': <Box size={20} />,
  'Manufacturer': <Factory size={20} />,
  'Distributor': <Truck size={20} />,
  'Retailer': <Store size={20} />
};

const SupplyChainVisualization: React.FC<SupplyChainVisualizationProps> = ({ 
  data,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Function to create a simple force-directed layout
  const createLayout = (
    nodes: GraphNode[], 
    edges: GraphEdge[], 
    width: number, 
    height: number
  ) => {
    // Simple layout - nodes in a circle
    const radius = Math.min(width, height) * 0.35;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Assign positions to nodes in a circle
    const positionedNodes = nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    return { nodes: positionedNodes, edges };
  };

  // Download SVG function
  const downloadSVG = () => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    
    // Add name spaces
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supply-chain-visualization.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle zoom functions
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };
  
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };
  
  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
  };

  // Render the supply chain visualization
  const renderVisualization = () => {
    if (!data || !data.nodes.length) {
      return (
        <div className="flex justify-center items-center h-80 text-gray-500">
          No supply chain data available
        </div>
      );
    }

    const width = 800;
    const height = 500;
    
    // Create a simple layout
    const layout = createLayout(data.nodes, data.edges, width, height);
    
    // Create a map for easy node lookup
    const nodeMap = layout.nodes.reduce((map, node) => {
      map.set(node.id, node);
      return map;
    }, new Map<string, GraphNode & { x: number; y: number }>());
    
    // Render nodes
    const renderedNodes = layout.nodes.map((node) => {
      const color = nodeColors[node.type] || '#888888';
      const icon = nodeIcons[node.type] || <Box size={20} />;
      const isSelected = node.id === selectedNode;
      
      return (
        <g 
          key={`node-${node.id}`} 
          transform={`translate(${node.x}, ${node.y})`}
          className="cursor-pointer"
          onClick={() => handleNodeClick(node.id)}
        >
          <circle 
            r={isSelected ? 30 : 25} 
            fill={color} 
            opacity={0.8}
            stroke={isSelected ? '#000000' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
          />
          <foreignObject 
            width="40" 
            height="40" 
            x="-20" 
            y="-20"
            className="pointer-events-none"
          >
            <div className="flex justify-center items-center h-full text-white">
              {icon}
            </div>
          </foreignObject>
          <text 
            y="40" 
            textAnchor="middle" 
            className="text-xs font-medium"
          >
            {node.label}
          </text>
        </g>
      );
    });
    
    // Render edges
    const renderedEdges = layout.edges.map((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const strokeDasharray = edge.label === 'Distributes' ? '5,5' : 'none';
      
      return (
        <g key={`edge-${edge.id}`}>
          <line 
            x1={sourceNode.x} 
            y1={sourceNode.y} 
            x2={targetNode.x} 
            y2={targetNode.y}
            stroke="#999999"
            strokeWidth="1.5"
            strokeDasharray={strokeDasharray}
          />
          <text
            x={(sourceNode.x + targetNode.x) / 2}
            y={(sourceNode.y + targetNode.y) / 2 - 5}
            textAnchor="middle"
            className="text-xs text-gray-600"
            fill="#666666"
          >
            {edge.label}
          </text>
        </g>
      );
    });
    
    return (
      <div className="w-full overflow-hidden relative">
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <Button 
            variant="outline" 
            size="icon"
            onClick={zoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={downloadSVG} 
            title="Download SVG"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4 text-sm text-center">
          <span className="inline-flex items-center mr-4">
            <span className="w-3 h-3 inline-block bg-green-400 rounded-full mr-1"></span> Supplier
          </span>
          <span className="inline-flex items-center mr-4">
            <span className="w-3 h-3 inline-block bg-blue-500 rounded-full mr-1"></span> Manufacturer
          </span>
          <span className="inline-flex items-center mr-4">
            <span className="w-3 h-3 inline-block bg-orange-500 rounded-full mr-1"></span> Distributor
          </span>
          <span className="inline-flex items-center">
            <span className="w-3 h-3 inline-block bg-purple-500 rounded-full mr-1"></span> Retailer
          </span>
        </div>
        
        <div 
          className="overflow-hidden border rounded-md bg-gray-50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg 
            ref={svgRef} 
            width="100%" 
            height="500"
            viewBox={`0 0 ${width} ${height}`}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center'
            }}
          >
            <g>
              {renderedEdges}
              {renderedNodes}
            </g>
          </svg>
        </div>
        
        <div className="flex justify-center mt-2 text-sm text-gray-500">
          <MousePointer className="h-4 w-4 mr-1" /> Click and drag to pan, use zoom buttons to zoom in/out
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supply Chain Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {renderVisualization()}
      </CardContent>
    </Card>
  );
};

export default SupplyChainVisualization;
