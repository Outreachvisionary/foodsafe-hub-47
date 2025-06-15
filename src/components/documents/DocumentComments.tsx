
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { DocumentComment } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

interface DocumentCommentsProps {
  documentId: string;
  currentUserId: string;
  currentUserName: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({
  documentId,
  currentUserId,
  currentUserName
}) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock comments for demo
  useEffect(() => {
    const mockComments: DocumentComment[] = [
      {
        id: '1',
        document_id: documentId,
        user_id: 'user1',
        user_name: 'John Doe',
        content: 'Please review the regulatory compliance section before final approval.',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        document_id: documentId,
        user_id: 'user2',
        user_name: 'Jane Smith',
        content: 'Updated the safety procedures as requested. Ready for review.',
        created_at: new Date(Date.now() - 172800000).toISOString(),
      }
    ];
    setComments(mockComments);
  }, [documentId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment: DocumentComment = {
        id: Math.random().toString(),
        document_id: documentId,
        user_id: currentUserId,
        user_name: currentUserName,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      
      toast({
        title: 'Comment added',
        description: 'Your comment has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new comment */}
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.user_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.user_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentComments;
