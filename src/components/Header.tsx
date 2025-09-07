import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="bg-background border-b border-border py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="text-xl font-bold text-official-blue cursor-pointer" 
            onClick={() => navigate('/')}
          >
            IEDC Ignite
          </div>
        </div>
        {user ? (
          <Button 
            onClick={() => navigate('/team-details')}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2"
          >
            Team Details
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/register')}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2"
          >
            Register Now
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;