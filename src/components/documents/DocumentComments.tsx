
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocumentService } from '@/hooks/useDocumentService';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface DocumentCommentsProps {
  documentId: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({ documentId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const documentService = useDocumentService();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [documentId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await documentService.fetchDocumentComments(documentId);
      setComments(fetchedComments || []);
    } catch (error) {
      console.error('Error fetching document comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await documentService.addDocumentComment({
        document_id: documentId,
        content: newComment,
        user_id: 'currentUser',
        user_name: 'Current User'
      });
      
      setNewComment('');
      fetchComments();
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center p-4">
          <p>Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.user_name?.slice(0, 2).toUpperCase() || 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{comment.user_name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500">
                    {comment.created_at ? format(new Date(comment.created_at), 'PPp') : 'Unknown date'}
                  </p>
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 pt-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default DocumentComments;
