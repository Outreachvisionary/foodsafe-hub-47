
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Trash2, Edit, Save } from 'lucide-react';
import { DocumentComment } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useDocumentService } from '@/hooks/useDocumentService';
import { format } from 'date-fns';

interface DocumentCommentsProps {
  documentId: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({ documentId }) => {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const documentService = useDocumentService();

  useEffect(() => {
    loadComments();
  }, [documentId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const loadedComments = await documentService.getDocumentComments(documentId);
      setComments(loadedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to comment',
          variant: 'destructive',
        });
        return;
      }
      
      await documentService.createDocumentComment({
        document_id: documentId,
        user_id: user.id,
        user_name: user.full_name || user.email || 'Anonymous',
        content: newComment
      });
      
      setNewComment('');
      loadComments();
      
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await documentService.deleteDocumentComment(commentId);
        setComments(comments.filter(c => c.id !== commentId));
        
        toast({
          title: 'Success',
          description: 'Comment deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete comment',
          variant: 'destructive',
        });
      }
    }
  };

  const startEditing = (comment: DocumentComment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async (commentId: string) => {
    try {
      await documentService.updateDocumentComment(commentId, {
        content: editContent
      });
      
      setComments(comments.map(c => 
        c.id === commentId 
          ? { ...c, content: editContent, updated_at: new Date().toISOString() } 
          : c
      ));
      
      setEditingId(null);
      setEditContent('');
      
      toast({
        title: 'Success',
        description: 'Comment updated successfully',
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment',
        variant: 'destructive',
      });
    }
  };

  const canEditOrDelete = (comment: DocumentComment) => {
    if (!user) return false;
    return user.id === comment.user_id || user.role === 'admin';
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Comments</h3>
      
      {isLoading ? (
        <div className="py-4 text-center text-muted-foreground">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">No comments yet</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-muted/30 p-3 rounded-md">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.user_name?.substring(0, 2).toUpperCase() || 'UN'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatDate(comment.updated_at || comment.created_at)}
                        {comment.updated_at && comment.updated_at !== comment.created_at && 
                          ' (edited)'}
                      </span>
                    </div>
                    
                    {canEditOrDelete(comment) && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => startEditing(comment)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive hover:text-destructive" 
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => saveEdit(comment.id)}
                        >
                          <Save className="h-3.5 w-3.5 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mt-1">{comment.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user?.full_name?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!newComment.trim()}>
          <Send className="h-4 w-4 mr-1" />
          Send
        </Button>
      </form>
    </div>
  );
};

export default DocumentComments;
