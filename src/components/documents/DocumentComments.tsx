
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Send } from 'lucide-react';
import useDocumentService from '@/hooks/useDocumentService';

interface DocumentComment {
  id: string;
  content: string;
  user_id: string;
  user_name: string;
  created_at: string;
  updated_at?: string;
}

interface DocumentCommentsProps {
  documentId: string;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({ documentId }) => {
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { loading, error, getDocumentComments, createDocumentComment } = useDocumentService();

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getDocumentComments();
      setComments(fetchedComments);
    };

    fetchComments();
  }, [documentId, getDocumentComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const comment = await createDocumentComment();
      
      if (comment) {
        setComments([...comments, comment]);
        setNewComment('');
        toast({
          description: "Comment added successfully",
        });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar>
                  <AvatarFallback>{comment.user_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{comment.user_name}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No comments yet</p>
        )}
        
        {error && (
          <div className="p-2 text-red-500 bg-red-50 rounded">
            Error loading comments
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Textarea 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleSubmit}
            disabled={isSubmitting || !newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentComments;
