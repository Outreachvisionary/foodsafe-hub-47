
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Pencil, Save, Bell, EyeOff, Lock, Globe, Shield, UserCog, Palette, FileCheck } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    department: user?.department || '',
    avatar_url: user?.avatar_url || '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    desktop: true,
    taskReminders: true,
    auditNotices: true,
    documentExpiry: true,
    trainingDue: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactMode: false,
    highContrast: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // In a real application, this would update the user profile in Supabase
      if (updateUserProfile) {
        await updateUserProfile({
          ...formData
        });
      }
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: checked }));
  };

  const handleAppearanceChange = (key: string, value: any) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
    
    if (key === 'theme') {
      // This would actually change the theme in a real application
      toast({
        title: "Theme changed",
        description: `Theme set to ${value}.`,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account preferences and system settings"
      />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Account Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details and personal information</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleEdit}
                className="flex items-center gap-1"
              >
                {isEditing ? <Save size={16} /> : <Pencil size={16} />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-semibold text-muted-foreground">{formData.fullName?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        disabled={true} // Email should not be editable in most systems
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        name="department" 
                        value={formData.department} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={user?.role || 'User'} 
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  Notification Channels
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your devices</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                      <p className="text-sm text-muted-foreground">Show notifications on your desktop</p>
                    </div>
                    <Switch 
                      id="desktop-notifications"
                      checked={notificationSettings.desktop}
                      onCheckedChange={(checked) => handleNotificationChange('desktop', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-muted-foreground" />
                  Event Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about task due dates</p>
                    </div>
                    <Switch 
                      id="task-reminders"
                      checked={notificationSettings.taskReminders}
                      onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="audit-notices">Audit Notices</Label>
                      <p className="text-sm text-muted-foreground">Receive audit schedules and results</p>
                    </div>
                    <Switch 
                      id="audit-notices"
                      checked={notificationSettings.auditNotices}
                      onCheckedChange={(checked) => handleNotificationChange('auditNotices', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="document-expiry">Document Expiry</Label>
                      <p className="text-sm text-muted-foreground">Get alerted when documents are about to expire</p>
                    </div>
                    <Switch 
                      id="document-expiry"
                      checked={notificationSettings.documentExpiry}
                      onCheckedChange={(checked) => handleNotificationChange('documentExpiry', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="training-due">Training Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming training requirements</p>
                    </div>
                    <Switch 
                      id="training-due"
                      checked={notificationSettings.trainingDue}
                      onCheckedChange={(checked) => handleNotificationChange('trainingDue', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  Theme Settings
                </h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Theme Mode</Label>
                    <div className="flex gap-4">
                      <Button 
                        variant={appearanceSettings.theme === 'light' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => handleAppearanceChange('theme', 'light')}
                      >
                        Light
                      </Button>
                      <Button 
                        variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => handleAppearanceChange('theme', 'dark')}
                      >
                        Dark
                      </Button>
                      <Button 
                        variant={appearanceSettings.theme === 'system' ? 'default' : 'outline'} 
                        className="flex-1"
                        onClick={() => handleAppearanceChange('theme', 'system')}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
                    </div>
                    <Switch 
                      id="compact-mode"
                      checked={appearanceSettings.compactMode}
                      onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch 
                      id="high-contrast"
                      checked={appearanceSettings.highContrast}
                      onCheckedChange={(checked) => handleAppearanceChange('highContrast', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Authentication
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Two-Factor Authentication
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                  Privacy
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-log">Activity Logging</Label>
                      <p className="text-sm text-muted-foreground">Log your activity for compliance purposes</p>
                    </div>
                    <Switch id="activity-log" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">Share usage data to improve the system</p>
                    </div>
                    <Switch id="data-sharing" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  Sessions
                </h3>
                <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                  Sign Out From All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
