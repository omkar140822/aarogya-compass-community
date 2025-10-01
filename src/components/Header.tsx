import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageCircle, LogOut, User, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Aarogya Q&A</span>
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/ask">
                  <Button variant="default" size="sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Ask Question
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="default" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
