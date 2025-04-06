
import React, { useEffect, useRef, useState } from 'react';
import { GraphData } from '@/types/traceability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface SupplyChainVisualizationProps {
  data: GraphData | null;
  onNodeClick?: (nodeId: string) => void;
}

const SupplyChainVisualization: React.FC<SupplyChainVisualizationProps> = ({ data, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Function to draw the visualization
  const drawVisualization = () => {
    if (!data || !containerRef.current) return;
    
    const container = containerRef.current;
    container.innerHTML = '';
    
    const width = container.clientWidth;
    const height = 400;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Create group for zoom and pan
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${position.x},${position.y}) scale(${zoom})`);
    
    // Create defs for markers (arrows)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '8');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('orient', 'auto');
    
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    arrowPath.setAttribute('fill', '#888');
    marker.appendChild(arrowPath);
    defs.appendChild(marker);
    svg.appendChild(defs);
    
    // Simple force-directed layout
    const nodeRadius = 30;
    const nodeSpacing = 150;
    
    // Position nodes in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    const nodePositions: { [key: string]: { x: number, y: number } } = {};
    
    // Calculate node positions
    data.nodes.forEach((node, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      nodePositions[node.id] = { x, y };
    });
    
    // Draw edges
    data.edges.forEach(edge => {
      const sourcePos = nodePositions[edge.source];
      const targetPos = nodePositions[edge.target];
      
      if (sourcePos && targetPos) {
        // Calculate angle for the arrow
        const dx = targetPos.x - sourcePos.x;
        const dy = targetPos.y - sourcePos.y;
        const angle = Math.atan2(dy, dx);
        
        // Adjust start and end points to be on the circles' edges
        const startX = sourcePos.x + nodeRadius * Math.cos(angle);
        const startY = sourcePos.y + nodeRadius * Math.sin(angle);
        const endX = targetPos.x - nodeRadius * Math.cos(angle);
        const endY = targetPos.y - nodeRadius * Math.sin(angle);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX.toString());
        line.setAttribute('y1', startY.toString());
        line.setAttribute('x2', endX.toString());
        line.setAttribute('y2', endY.toString());
        line.setAttribute('stroke', '#888');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        g.appendChild(line);
        
        // Edge label
        const labelX = (startX + endX) / 2;
        const labelY = (startY + endY) / 2 - 10;
        
        const edgeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        edgeLabel.setAttribute('x', labelX.toString());
        edgeLabel.setAttribute('y', labelY.toString());
        edgeLabel.setAttribute('text-anchor', 'middle');
        edgeLabel.setAttribute('font-size', '10');
        edgeLabel.setAttribute('fill', '#666');
        edgeLabel.textContent = edge.label;
        g.appendChild(edgeLabel);
      }
    });
    
    // Draw nodes
    data.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      
      if (pos) {
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('transform', `translate(${pos.x},${pos.y})`);
        nodeGroup.setAttribute('data-node-id', node.id);
        nodeGroup.style.cursor = 'pointer';
        
        // Node circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', nodeRadius.toString());
        
        // Set color based on node type
        let fillColor = '#3b82f6';
        switch (node.type) {
          case 'Supplier':
            fillColor = '#10b981';
            break;
          case 'Manufacturer':
            fillColor = '#3b82f6';
            break;
          case 'Distributor':
            fillColor = '#f59e0b';
            break;
          case 'Retailer':
            fillColor = '#8b5cf6';
            break;
        }
        
        circle.setAttribute('fill', fillColor);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        nodeGroup.appendChild(circle);
        
        // Node label
        const nodeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nodeLabel.setAttribute('text-anchor', 'middle');
        nodeLabel.setAttribute('dominant-baseline', 'middle');
        nodeLabel.setAttribute('fill', '#fff');
        nodeLabel.setAttribute('font-size', '10');
        nodeLabel.setAttribute('pointer-events', 'none');
        nodeLabel.textContent = node.label;
        
        // Add word wrapping for long names
        if (node.label.length > 10) {
          nodeLabel.textContent = '';
          const words = node.label.split(' ');
          words.forEach((word, i) => {
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.setAttribute('x', '0');
            tspan.setAttribute('dy', i === 0 ? '-0.5em' : '1.2em');
            tspan.textContent = word;
            nodeLabel.appendChild(tspan);
          });
        }
        
        nodeGroup.appendChild(nodeLabel);
        
        // Node type label
        const typeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeLabel.setAttribute('text-anchor', 'middle');
        typeLabel.setAttribute('y', nodeRadius + 15);
        typeLabel.setAttribute('fill', '#666');
        typeLabel.setAttribute('font-size', '10');
        typeLabel.textContent = node.type;
        nodeGroup.appendChild(typeLabel);
        
        // Handle node click
        nodeGroup.addEventListener('click', () => {
          if (onNodeClick) {
            onNodeClick(node.id);
          }
        });
        
        g.appendChild(nodeGroup);
      }
    });
    
    svg.appendChild(g);
    container.appendChild(svg);
  };
  
  // Handle zoom and pan
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  useEffect(() => {
    drawVisualization();
  }, [data, zoom, position]);
  
  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Supply Chain Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-60 text-gray-500">
            No supply chain data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Supply Chain Visualization</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef} 
          className="border rounded-md bg-gray-50" 
          style={{ height: '400px', overflow: 'hidden', position: 'relative' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        ></div>
        
        <div className="flex justify-center mt-4 text-xs gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Supplier</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>Manufacturer</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span>Distributor</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>Retailer</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyChainVisualization;
