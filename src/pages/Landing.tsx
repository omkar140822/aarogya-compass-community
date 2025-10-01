import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Users, TrendingUp, Award, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Community-Powered Knowledge</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Ask Questions,
              <span className="text-primary"> Share Knowledge</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Aarogya Q&A, where curious minds meet expert answers. Get help from our community or share your expertise with others.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="w-full sm:w-auto shadow-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/questions">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Browse Questions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Aarogya Q&A?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A platform designed to facilitate meaningful knowledge exchange
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ask Anything
                </h3>
                <p className="text-muted-foreground">
                  Post your questions and get answers from knowledgeable community members
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Active Community
                </h3>
                <p className="text-muted-foreground">
                  Join a vibrant community of experts and learners helping each other
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Quality Content
                </h3>
                <p className="text-muted-foreground">
                  Upvote the best answers to help others find quality information quickly
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft hover:shadow-medium transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Build Reputation
                </h3>
                <p className="text-muted-foreground">
                  Share your knowledge and earn recognition from the community
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border shadow-medium bg-gradient-hero text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-90" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Join thousands of users sharing knowledge and helping each other grow
                </p>
                <Link to="/auth?mode=signup">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="shadow-soft"
                  >
                    Create Your Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;
