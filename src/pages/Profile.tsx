import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import QuestionCard from "@/components/QuestionCard";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(data);
    };

    const fetchUserQuestions = async () => {
      const { data } = await supabase
        .from("questions")
        .select(`
          *,
          profiles:user_id (username),
          question_likes (user_id),
          answers (id)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setQuestions(data || []);
      setLoading(false);
    };

    fetchProfile();
    fetchUserQuestions();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-40 w-full mb-6" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{profile?.username}</h1>
                <p className="text-muted-foreground">Member since {new Date(profile?.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <h2 className="text-2xl font-semibold text-foreground mb-4">Your Questions</h2>
          
          <div className="space-y-4">
            {questions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">You haven't asked any questions yet.</p>
              </Card>
            ) : (
              questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
