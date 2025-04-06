
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeNode } from '@/types/traceability';
import { Box, Factory } from 'lucide-react';

interface GenealogyTreeProps {
  data: TreeNode;
  onNodeClick?: (node: TreeNode) => void;
}

const GenealogyTree: React.FC<GenealogyTreeProps> = ({ data, onNodeClick }) => {
  if (!data) {
    return <div>No genealogy data available</div>;
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Box className="h-4 w-4 mr-2" />;
      case 'component':
        return <Factory className="h-4 w-4 mr-2" />;
      default:
        return <Box className="h-4 w-4 mr-2" />;
    }
  };

  const renderChildren = (children?: TreeNode[]) => {
    if (!children || children.length === 0) {
      return null;
    }

    return (
      <ul className="ml-6 space-y-2">
        {children.map((child, index) => (
          <li key={index} className="relative pl-6">
            <div className="absolute left-0 top-2 w-4 h-[1px] bg-gray-300"></div>
            <div
              className={`flex items-center border rounded-md p-2 ${
                child.type === 'component' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'
              } ${onNodeClick ? 'cursor-pointer hover:bg-opacity-80' : ''}`}
              onClick={() => onNodeClick && onNodeClick(child)}
            >
              {getNodeIcon(child.type)}
              <span className="text-sm font-medium">
                {child.name}
              </span>
            </div>
            {child.children && renderChildren(child.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Genealogy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4">
          <div
            className="flex items-center border rounded-md p-3 border-green-200 bg-green-50 mb-2"
            onClick={() => onNodeClick && onNodeClick(data)}
          >
            {getNodeIcon(data.type)}
            <span className="font-medium">{data.name}</span>
          </div>
          {renderChildren(data.children)}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenealogyTree;
