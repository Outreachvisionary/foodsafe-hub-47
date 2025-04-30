
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DocumentComment } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

interface DocumentCommentsProps {
  documentId: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({ documentId }) => {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [documentId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock comments data
      const mockComments: DocumentComment[] = [
        {
          id: '1',
          document_id: documentId,
          created_at: new Date().toISOString(),
          user_id: 'user-1',
          user_name: 'John Doe',
          content: 'This document needs revision in section 3.2'
        },
        {
          id: '2',
          document_id: documentId,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user_id: 'user-2',
          user_name: 'Jane Smith',
          content: 'I approved the latest changes. Please update the version number.'
        }
      ];
      
      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create new comment object
      const newCommentObj: DocumentComment = {
        id: `comment-${Date.now()}`,
        document_id: documentId,
        created_at: new Date().toISOString(),
        user_id: 'current-user',
        user_name: 'Current User',
        content: newComment
      };
      
      // Update state
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully",
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
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none"
            />
            <Button onClick={handleSubmitComment}>Post</Button>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-muted rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{comment.user_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentComments;
