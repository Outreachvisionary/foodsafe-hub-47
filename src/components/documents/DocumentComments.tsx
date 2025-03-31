
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';
import { Send, Trash2, Edit2 } from 'lucide-react';
import documentService from '@/services/documentService';

interface Comment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

interface DocumentCommentsProps {
  documentId: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({ documentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  
  const fetchComments = async () => {
    try {
      setLoading(true);
      // Fetch comments from your API
      const commentsData = await documentService.getDocumentComments(documentId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (documentId) {
      fetchComments();
    }
  }, [documentId]);
  
  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setSubmitting(true);
      
      const newComment = {
        document_id: documentId,
        user_id: user?.id || 'anonymous',
        user_name: user?.email || 'Anonymous User',
        content: comment,
        created_at: new Date().toISOString()
      };
      
      // Save comment to your API
      const savedComment = await documentService.createDocumentComment(newComment);
      
      setComments(prev => [savedComment, ...prev]);
      setComment('');
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted successfully',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditContent(content);
  };
  
  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    try {
      setSubmitting(true);
      
      // Update comment through your API
      await documentService.updateDocumentComment(commentId, {
        content: editContent,
        updated_at: new Date().toISOString()
      });
      
      setComments(prev => 
        prev.map(c => 
          c.id === commentId 
            ? { ...c, content: editContent, updated_at: new Date().toISOString() } 
            : c
        )
      );
      
      setEditingCommentId(null);
      setEditContent('');
      
      toast({
        title: 'Comment updated',
        description: 'Your comment has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      // Delete comment through your API
      await documentService.deleteDocumentComment(commentId);
      
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      toast({
        title: 'Comment deleted',
        description: 'The comment has been deleted successfully',
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
  
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="border border-border rounded-md bg-white shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Comments and Feedback
        </h3>
      </div>
      
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src={user?.avatar_url || ''} alt={user?.email || 'User'} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.email ? getUserInitials(user.email) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment or feedback..."
              className="resize-none border-border/60 focus:border-accent focus:ring-accent min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!comment.trim() || submitting}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white"
              >
                {submitting ? (
                  <>Posting...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4 mt-4 max-h-[400px] overflow-y-auto">
        <h4 className="text-sm font-medium text-muted-foreground mb-4">
          {comments.length === 0 ? 'No comments yet' : 
            comments.length === 1 ? '1 Comment' : 
            `${comments.length} Comments`}
        </h4>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div 
                key={comment.id} 
                className="bg-muted/10 rounded-md p-4 shadow-sm border border-border/50 hover:border-accent/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getUserInitials(comment.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{comment.user_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        {comment.updated_at && comment.updated_at !== comment.created_at && (
                          <span className="ml-2 italic">(edited)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {user?.id === comment.user_id && (
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditComment(comment.id, comment.content)}
                        className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="resize-none border-border/60 focus:border-accent focus:ring-accent min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={!editContent.trim() || submitting}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white"
                      >
                        {submitting ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-foreground whitespace-pre-wrap">
                    {comment.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentComments;
