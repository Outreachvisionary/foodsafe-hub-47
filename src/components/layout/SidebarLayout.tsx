import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from 'next-themes'
import { useUser } from '@/contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon, Menu, Settings, User, HelpCircle, LogOut, Languages } from 'lucide-react';

interface SidebarContextProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

const AppSidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useUser();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="absolute left-4 top-4 h-6 w-6 md:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-64">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigate your workspace.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="documents">
              <AccordionTrigger className="data-[state=open]:bg-secondary hover:bg-secondary rounded-md">Documents</AccordionTrigger>
              <AccordionContent>
                <Link to="/documents/list" className="block px-4 py-2 hover:bg-accent rounded-md">All Documents</Link>
                <Link to="/documents/new" className="block px-4 py-2 hover:bg-accent rounded-md">New Document</Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="modules">
              <AccordionTrigger className="data-[state=open]:bg-secondary hover:bg-secondary rounded-md">Modules</AccordionTrigger>
              <AccordionContent>
                <Link to="/haccp" className="block px-4 py-2 hover:bg-accent rounded-md">HACCP</Link>
                <Link to="/training" className="block px-4 py-2 hover:bg-accent rounded-md">Training</Link>
                <Link to="/internal-audits" className="block px-4 py-2 hover:bg-accent rounded-md">Internal Audits</Link>
                <Link to="/supplier-management" className="block px-4 py-2 hover:bg-accent rounded-md">Supplier Management</Link>
                <Link to="/traceability" className="block px-4 py-2 hover:bg-accent rounded-md">Traceability</Link>
                <Link to="/capa" className="block px-4 py-2 hover:bg-accent rounded-md">CAPA</Link>
                <Link to="/complaint-management" className="block px-4 py-2 hover:bg-accent rounded-md">Complaint Management</Link>
                <Link to="/non-conformance" className="block px-4 py-2 hover:bg-accent rounded-md">Non-Conformance</Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="admin">
              <AccordionTrigger className="data-[state=open]:bg-secondary hover:bg-secondary rounded-md">Administration</AccordionTrigger>
              <AccordionContent>
                <Link to="/organization" className="block px-4 py-2 hover:bg-accent rounded-md">Organization</Link>
                <Link to="/facilities" className="block px-4 py-2 hover:bg-accent rounded-md">Facilities</Link>
                <Link to="/reports" className="block px-4 py-2 hover:bg-accent rounded-md">Reports</Link>
                <Link to="/standards" className="block px-4 py-2 hover:bg-accent rounded-md">Standards</Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <SheetClose asChild>
          <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary h-8 w-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18"/><path d="M6 6 18 18"/>
            </svg>
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <AppSidebar />
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative rounded-full h-8 w-8 overflow-hidden border transition-shadow hover:shadow-md"
                aria-label="Open user menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || "https://github.com/shadcn.png"} alt={user?.full_name || "User"} />
                  <AvatarFallback>{user?.full_name?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-2 underline underline-offset-4">
                <Languages className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Spanish</DropdownMenuItem>
              <DropdownMenuItem>French</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-2 underline underline-offset-4">
                {theme === "dark" ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <HelpCircle className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && window.location.pathname !== '/') {
      navigate('/');
    }
  }, [user, navigate]);
  
  const getLanguageSetting = () => {
    if (user?.preferences?.language) {
      return user.preferences.language;
    }
    return 'en'; // Default to English
  };
  
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
