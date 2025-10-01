import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, User } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
    };
    question_likes: Array<{ user_id: string }>;
    answers: Array<{ id: string }>;
  };
  onLikeUpdate?: () => void;
}

const QuestionCard = ({ question, onLikeUpdate }: QuestionCardProps) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  
  const likesCount = question.question_likes?.length || 0;
  const answersCount = question.answers?.length || 0;
  const isLiked = user && question.question_likes?.some(like => like.user_id === user.id);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to like questions");
      return;
    }

    setIsLiking(true);
    try {
      if (isLiked) {
        const { error } = await supabase
          .from("question_likes")
          .delete()
          .eq("question_id", question.id)
          .eq("user_id", user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("question_likes")
          .insert({ question_id: question.id, user_id: user.id });
        
        if (error) throw error;
      }
      onLikeUpdate?.();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Link to={`/question/${question.id}`}>
      <Card className="p-6 hover:shadow-medium transition-shadow">
        <h3 className="text-xl font-semibold text-foreground mb-2">{question.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{question.content}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={isLiked ? "text-primary" : ""}
            >
              <ThumbsUp className={`w-4 h-4 mr-1 ${isLiked ? "fill-primary" : ""}`} />
              {likesCount}
            </Button>
            <span className="flex items-center text-muted-foreground">
              <MessageSquare className="w-4 h-4 mr-1" />
              {answersCount} answers
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{question.profiles?.username}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default QuestionCard;
