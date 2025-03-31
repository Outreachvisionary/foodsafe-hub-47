
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, PencilLine, Save, X } from 'lucide-react';
import { DocumentComment } from '@/types/document-comment';
import { useDocumentService } from '@/hooks/useDocumentService';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface DocumentCommentsProps {
  documentId: string;
}

const DocumentComments = ({ documentId }: DocumentCommentsProps) => {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { toast } = useToast();
  const documentService = useDocumentService();
  
  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [documentId]);
  
  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };
  
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await documentService.getDocumentComments(documentId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      const comment = await documentService.createDocumentComment({
        document_id: documentId,
        user_id: currentUser.id,
        user_name: currentUser.email || 'User',
        content: newComment.trim(),
      });
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast({
        title: 'Comment Added',
        description: 'Your comment has been added successfully',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };
  
  const handleSaveEdit = async (commentId: string) => {
    if (!editedContent.trim()) return;
    
    try {
      await documentService.updateDocumentComment(commentId, {
        content: editedContent.trim(),
      });
      
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: editedContent.trim(), updated_at: new Date().toISOString() }
            : comment
        )
      );
      
      setEditingCommentId(null);
      toast({
        title: 'Comment Updated',
        description: 'Your comment has been updated successfully',
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
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      await documentService.deleteDocumentComment(commentId);
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast({
        title: 'Comment Deleted',
        description: 'Comment has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading comments...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {currentUser && (
        <div className="flex gap-3 items-start">
          <Avatar>
            <AvatarFallback>{currentUser.email?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{comment.user_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{comment.user_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {comment.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      {comment.updated_at && comment.updated_at !== comment.created_at && ' (edited)'}
                    </div>
                  </div>
                </div>
                
                {currentUser && currentUser.id === comment.user_id && (
                  <div className="flex gap-2">
                    {editingCommentId !== comment.id ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditComment(comment.id, comment.content)}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleSaveEdit(comment.id)}
                        >
                          <Save className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingCommentId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {editingCommentId === comment.id ? (
                <Input
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full mt-2"
                />
              ) : (
                <p className="text-sm">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentComments;
