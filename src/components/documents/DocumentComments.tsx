
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatDistance } from 'date-fns';
import { Send } from 'lucide-react';
import { DocumentComment } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import useDocumentService from '@/hooks/useDocumentService';

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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const documentService = useDocumentService();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const fetchedComments = await documentService.getDocumentComments();
        setComments(fetchedComments);
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

    fetchComments();
  }, [documentId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const createdComment = await documentService.createDocumentComment(
        documentId,
        currentUserId,
        currentUserName,
        newComment
      );

      if (createdComment) {
        setComments((prev) => [...prev, createdComment]);
        setNewComment('');
        toast({
          title: 'Comment added',
          description: 'Your comment has been added successfully',
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    try {
      return formatDistance(new Date(dateStr), new Date(), { addSuffix: true });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(comment.user_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {getInitials(currentUserName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] resize-none"
            />
            <Button
              size="sm"
              className="ml-auto"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentComments;
