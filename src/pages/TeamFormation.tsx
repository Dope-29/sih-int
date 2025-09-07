import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DotGrid from '@/components/DotGrid'; // Import DotGrid

const TeamFormation = () => {
  const navigate = useNavigate();

  return (
    <section className="text-white" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#1a1a1a"
          activeColor="#0000FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={2.5}
        />
      </div>
      <div className="flex items-center justify-center min-h-screen" style={{ position: 'relative', zIndex: 2 }}>
        <main className="container mx-auto py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-400 mb-2">
                Smart India Hackathon - Internals
              </CardTitle>
              <p className="text-lg font-medium text-blue-300">(UCER) Registration</p>
              <p className="text-sm text-gray-400">
                Register for SIH Internals (UCER)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Formation Section */}
              <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-6 w-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-green-300">Team Formation</h3>
                </div>
                <p className="text-sm text-green-400 mb-6">
                  Create a new team or join using the team code. This stage is optional.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => navigate('/create-team')}
                    className="flex flex-col items-center gap-2 h-auto py-4 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="font-medium">Create Team</span>
                    <span className="text-xs opacity-90">Be a team leader & create your squad</span>
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/join-team')}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4 bg-white/10 text-white hover:bg-white/20 border-blue-500"
                  >
                    <Users className="h-6 w-6" />
                    <span className="font-medium">Join Team</span>
                    <span className="text-xs opacity-70">Enter team code to join</span>
                  </Button>
                </div>
              </div>

              {/* WhatsApp Community Section */}
              <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">Join Our WhatsApp Community</h3>
                <p className="text-sm text-blue-400 mb-4">
                  Stay updated with announcements, networking opportunities and get real SIH 2025 updates!
                </p>
                <Button
                  className="bg-white/10 text-white hover:bg-white/20"
                  onClick={() => window.open('https://chat.whatsapp.com/Dg9SQ4K0uBPF1I3r1Cz76E', '_blank')}
                >
                  Join WhatsApp Group
                </Button>
              </div>


            </CardContent>
            </Card> {/* Added missing closing tag */}
          </div>
        </main>
      </div>
    </section>
  );
};

export default TeamFormation;