
import React from 'react';
import { useNavigate, useLocation , Outlet} from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarProvider
} from '@/components/ui/sidebar';
import { 
  Calendar, 
  Settings, 
  Info, 
  Bug, 
  User, 
  Home, 
  PanelLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const SidebarNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <Calendar className="h-6 w-6 text-college-600" />
          <span className="font-bold text-lg">Campus Connect</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/')} 
              onClick={() => navigate('/')}
              tooltip="Home"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/events')} 
              onClick={() => navigate('/events')}
              tooltip="Events"
            >
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isAuthenticated && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/dashboard')} 
                onClick={() => navigate('/dashboard')}
                tooltip="Dashboard"
              >
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/about')} 
              onClick={() => navigate('/about')}
              tooltip="About"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/bug-report')} 
              onClick={() => navigate('/bug-report')}
              tooltip="Report Bug"
            >
              <Bug className="h-4 w-4" />
              <span>Report Bug</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isAuthenticated && user?.role === 'admin' && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive('/admin')} 
                onClick={() => navigate('/admin')}
                tooltip="Admin"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        
        <SidebarSeparator />
        
        {isAuthenticated && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-college-100 text-college-600 text-xs">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs" 
              onClick={logout}
            >
              Log out
            </Button>
          </div>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="text-xs text-center text-muted-foreground">
            CampusEvents © {new Date().getFullYear()}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const SidebarWrapper: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <SidebarNav />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SidebarWrapper;
