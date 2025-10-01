import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ThumbsUp, User, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          profiles:user_id (username),
          question_likes (user_id)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setQuestion(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Question not found");
      navigate("/");
    }
  };

  const fetchAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("answers")
        .select(`
          *,
          profiles:user_id (username),
          answer_likes (user_id)
        `)
        .eq("question_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAnswers(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();

    const channel = supabase
      .channel("answers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "answers", filter: `question_id=eq.${id}` },
        () => fetchAnswers()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "answer_likes" },
        () => fetchAnswers()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "question_likes" },
        () => fetchQuestion()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleQuestionLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }

    const isLiked = question?.question_likes?.some((like: any) => like.user_id === user.id);
    
    try {
      if (isLiked) {
        await supabase
          .from("question_likes")
          .delete()
          .eq("question_id", id)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("question_likes")
          .insert({ question_id: id, user_id: user.id });
      }
      fetchQuestion();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAnswerLike = async (answerId: string) => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }

    const answer = answers.find(a => a.id === answerId);
    const isLiked = answer?.answer_likes?.some((like: any) => like.user_id === user.id);
    
    try {
      if (isLiked) {
        await supabase
          .from("answer_likes")
          .delete()
          .eq("answer_id", answerId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("answer_likes")
          .insert({ answer_id: answerId, user_id: user.id });
      }
      fetchAnswers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to answer");
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("answers").insert({
        question_id: id,
        user_id: user.id,
        content: newAnswer,
      });

      if (error) throw error;

      toast.success("Answer posted!");
      setNewAnswer("");
      fetchAnswers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-40 w-full" />
        </main>
      </div>
    );
  }

  const isQuestionLiked = user && question?.question_likes?.some((like: any) => like.user_id === user.id);
  const questionLikesCount = question?.question_likes?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-6">
            <h1 className="text-3xl font-bold text-foreground mb-4">{question?.title}</h1>
            <p className="text-muted-foreground mb-6 whitespace-pre-wrap">{question?.content}</p>
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuestionLike}
                className={isQuestionLiked ? "text-primary" : ""}
              >
                <ThumbsUp className={`w-5 h-5 mr-2 ${isQuestionLiked ? "fill-primary" : ""}`} />
                {questionLikesCount} Likes
              </Button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{question?.profiles?.username}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(question?.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </Card>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              {answers.length} Answers
            </h2>
            
            <div className="space-y-4 mb-6">
              {answers.map((answer) => {
                const isAnswerLiked = user && answer.answer_likes?.some((like: any) => like.user_id === user.id);
                const answerLikesCount = answer.answer_likes?.length || 0;

                return (
                  <Card key={answer.id} className="p-6">
                    <p className="text-foreground mb-4 whitespace-pre-wrap">{answer.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAnswerLike(answer.id)}
                        className={isAnswerLiked ? "text-primary" : ""}
                      >
                        <ThumbsUp className={`w-4 h-4 mr-1 ${isAnswerLiked ? "fill-primary" : ""}`} />
                        {answerLikesCount}
                      </Button>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{answer.profiles?.username}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  required
                  rows={6}
                  maxLength={5000}
                />
                <Button type="submit" disabled={submitting || !user}>
                  {submitting ? "Posting..." : "Post Answer"}
                </Button>
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    Please <a href="/auth" className="text-primary underline">login</a> to post an answer
                  </p>
                )}
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionDetail;
