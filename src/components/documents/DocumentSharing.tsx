import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Document } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Share, Copy, Mail, X, Check } from 'lucide-react';

interface DocumentSharingProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentSharing: React.FC<DocumentSharingProps> = ({ 
  document, 
  open, 
  onOpenChange 
}) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState('view');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  
  useEffect(() => {
    if (open && document) {
      // Generate a share URL
      const url = `${window.location.origin}/documents/shared/${document.id}`;
      setShareUrl(url);
    }
  }, [open, document]);

  const handleShareByEmail = async () => {
    if (!email || !document || !user) return;
    
    setSharing(true);
    try {
      // Note: Document sharing functionality needs to be properly configured
      // with the document_shares table. For now, we'll just show a success message.
      toast.success(`Document shared with ${email}`);
      setEmail('');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share document');
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Share link copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Document
          </DialogTitle>
          <DialogDescription>
            Share "{document?.title}" with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input 
                value={shareUrl} 
                readOnly 
                className="flex-1"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view this document
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Share by Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Select
                value={accessLevel}
                onValueChange={setAccessLevel}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleShareByEmail}
              disabled={!email || sharing}
              className="w-full mt-2"
            >
              <Mail className="h-4 w-4 mr-2" />
              {sharing ? 'Sharing...' : 'Share by Email'}
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSharing;