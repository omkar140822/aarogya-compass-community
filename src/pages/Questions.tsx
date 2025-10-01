import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import QuestionCard from "@/components/QuestionCard";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          profiles:user_id (username),
          question_likes (user_id),
          answers (id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();

    // Set up realtime subscription
    const channel = supabase
      .channel("questions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "questions" },
        () => fetchQuestions()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "question_likes" },
        () => fetchQuestions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Recent Questions</h1>
          
          <div className="space-y-4">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))
            ) : questions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No questions yet. Be the first to ask!</p>
              </div>
            ) : (
              questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onLikeUpdate={fetchQuestions}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
