
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { DocumentComment } from '@/types/document';

interface DocumentCommentsProps {
  documentId: string;
  currentUserId: string;
  currentUserName: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({
  documentId,
  currentUserId,
  currentUserName,
}) => {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [documentId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      // For demonstration, we'll create some mock comments
      const mockComments: DocumentComment[] = [
        {
          id: '1',
          document_id: documentId,
          content: 'This looks good to me. Ready for review.',
          user_id: 'user1',
          user_name: 'Sarah Johnson',
          created_at: '2023-08-15T10:30:00Z',
        },
        {
          id: '2',
          document_id: documentId,
          content: 'Please update section 3.2 with the latest regulations.',
          user_id: 'user2',
          user_name: 'David Chen',
          created_at: '2023-08-16T14:15:00Z',
        },
      ];
      
      setComments(mockComments);
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
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    try {
      // In a real application, you'd save to the database
      // For now, we'll simulate adding a comment
      const mockNewComment: DocumentComment = {
        id: `temp-${Date.now()}`,
        document_id: documentId,
        content: newComment,
        user_id: currentUserId,
        user_name: currentUserName,
        created_at: new Date().toISOString(),
      };
      
      setComments([...comments, mockNewComment]);
      setNewComment('');
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add your comment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(comment.user_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-semibold">{comment.user_name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
        
        <div className="pt-4 border-t">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handleSubmitComment} 
              disabled={!newComment.trim() || isLoading}
            >
              {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentComments;
