
import React, { useState } from 'react';
import { TreeNode } from '@/types/traceability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Box, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenealogyTreeProps {
  data: TreeNode | null;
  onNodeClick?: (node: TreeNode) => void;
}

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  level: number;
  onNodeClick?: (node: TreeNode) => void;
}> = ({ node, level, onNodeClick }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleClick = () => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <div className="mt-1">
      <div 
        className="flex items-center py-1 hover:bg-gray-100 rounded cursor-pointer"
        onClick={handleClick}
      >
        <div style={{ width: `${level * 20}px` }} className="flex-shrink-0"></div>
        
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6 mr-1"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        ) : (
          <div className="w-6 mr-1"></div>
        )}
        
        {node.type === 'product' ? (
          <Box size={16} className="mr-2 text-blue-500" />
        ) : (
          <Package size={16} className="mr-2 text-green-500" />
        )}
        
        <span className={`text-sm ${node.type === 'product' ? 'font-semibold text-blue-700' : 'text-green-700'}`}>
          {node.name}
        </span>
      </div>
      
      {expanded && hasChildren && (
        <div>
          {node.children?.map((child, index) => (
            <TreeNodeComponent
              key={`${child.id}-${index}`}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const GenealogyTree: React.FC<GenealogyTreeProps> = ({ data, onNodeClick }) => {
  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Genealogy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40 text-gray-500">
            No genealogy data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Product Genealogy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-3 bg-gray-50">
          <div className="text-xs text-gray-500 mb-2 flex space-x-4">
            <div className="flex items-center">
              <Box size={14} className="text-blue-500 mr-1" /> 
              <span>Product</span>
            </div>
            <div className="flex items-center">
              <Package size={14} className="text-green-500 mr-1" /> 
              <span>Component</span>
            </div>
          </div>
          
          <div className="genealogy-tree">
            <TreeNodeComponent node={data} level={0} onNodeClick={onNodeClick} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenealogyTree;
