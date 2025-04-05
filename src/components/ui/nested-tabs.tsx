
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface NestedTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    children?: Array<{
      id: string;
      label: string;
      icon?: React.ReactNode;
    }>;
  }[];
  onTabChange?: (value: string) => void;
  defaultOpenGroups?: string[];
}

export function NestedTabs({ 
  tabs, 
  onTabChange, 
  className, 
  defaultOpenGroups = [],
  ...props 
}: NestedTabsProps) {
  const [openGroups, setOpenGroups] = React.useState<string[]>(defaultOpenGroups);
  const [activeTab, setActiveTab] = React.useState<string>(props.defaultValue as string || "");

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs 
      {...props} 
      className={cn("w-full", className)} 
      onValueChange={handleTabChange}
      value={activeTab}
    >
      <TabsList className="flex flex-wrap h-auto p-1 mb-6 bg-muted/20">
        {tabs.map(tab => (
          tab.children ? (
            <div key={tab.id} className="relative">
              <Collapsible 
                open={openGroups.includes(tab.id)}
                onOpenChange={() => toggleGroup(tab.id)}
                className="min-w-[150px]"
              >
                <CollapsibleTrigger asChild>
                  <div 
                    className={cn(
                      "flex items-center px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer",
                      "hover:bg-muted/50 transition-colors duration-200 mr-1",
                      openGroups.includes(tab.id) && "bg-muted/30"
                    )}
                  >
                    {tab.icon && <span className="mr-2">{tab.icon}</span>}
                    {tab.label}
                    <ChevronDown 
                      className={cn(
                        "ml-1 h-4 w-4 transition-transform duration-200",
                        openGroups.includes(tab.id) && "transform rotate-180"
                      )} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute mt-1 py-1 bg-background border rounded-md shadow-lg z-10 min-w-[180px]">
                  {tab.children.map(child => (
                    <TabsTrigger
                      key={child.id}
                      value={child.id}
                      className={cn(
                        "justify-start w-full rounded-none px-4 py-2",
                        activeTab === child.id && "bg-primary/10 text-primary"
                      )}
                      onClick={() => setOpenGroups([])}
                    >
                      {child.icon && <span className="mr-2">{child.icon}</span>}
                      {child.label}
                    </TabsTrigger>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn("flex items-center px-3 py-1.5 mr-1")}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          )
        ))}
      </TabsList>
      {tabs.map(tab => (
        <React.Fragment key={`content-${tab.id}`}>
          {!tab.children && (
            <TabsContent value={tab.id}>
              {props.children && Array.isArray(props.children) 
                ? props.children.find((content: any) => content.props.value === tab.id) 
                : props.children}
            </TabsContent>
          )}
          {tab.children && tab.children.map(child => (
            <TabsContent key={`content-${child.id}`} value={child.id}>
              {props.children && Array.isArray(props.children) 
                ? props.children.find((content: any) => content.props.value === child.id) 
                : props.children}
            </TabsContent>
          ))}
        </React.Fragment>
      ))}
    </Tabs>
  );
}
