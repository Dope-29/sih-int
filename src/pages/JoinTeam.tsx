import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DotGrid from '@/components/DotGrid'; // Import DotGrid

const JoinTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already in a team on component mount
  useEffect(() => {
    const checkExistingTeam = async () => {
      if (!user?.email) return;

      const { data: teamMember } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('member_email', user.email)
        .single();

      if (teamMember) {
        navigate('/team-details');
      }
    };

    checkExistingTeam();
  }, [user?.email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, get the team details using the team code
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('team_code', teamCode.toUpperCase())
        .single();

      if (teamError) throw teamError;

      if (!team) {
        toast({
          title: "Team Not Found",
          description: "Please check the team code and try again.",
          variant: "destructive"
        });
        return;
      }

      // Check team capacity
      const { data: memberCount } = await supabase
        .from('team_members')
        .select('id', { count: 'exact' })
        .eq('team_id', team.id);

      if ((memberCount?.length || 0) >= 6) {
        toast({
          title: "Team is Full",
          description: "This team has reached its maximum capacity of 6 members.",
          variant: "destructive"
        });
        return;
      }

      if (!user?.email) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to join a team.",
          variant: "destructive"
        });
        return;
      }

      // Get the current user's registration details
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .select('email, full_name')
        .eq('email', user.email)
        .single();

      if (regError) {
        toast({
          title: "Registration Required",
          description: "Please complete your registration first.",
          variant: "destructive"
        });
        return;
      }

      if (!registration) {
        toast({
          title: "Registration Required",
          description: "Please complete your registration first.",
          variant: "destructive"
        });
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', team.id)
        .eq('member_email', registration.email)
        .single();

      if (existingMember) {
        // If already a member, just navigate to team details
        navigate('/team-details');
        return;
      }

      // Add user to the team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert([
          {
            team_id: team.id,
            member_email: registration.email,
            member_name: registration.full_name,
            is_leader: false,
            joined_at: new Date().toISOString()
          }
        ]);

      if (joinError) {
        console.error('Error joining team:', joinError);
        toast({
          title: "Error",
          description: "Failed to join team. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Successfully Joined Team!",
        description: `You have joined team "${team.team_name}".`
      });

      navigate('/team-details');
    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: "Error",
        description: "Failed to join team. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="max-w-md mx-auto">
            <Card className="bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">Join Team</CardTitle>
                <p className="text-sm text-gray-400">
                  Enter the team code to join an existing team
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="teamCode">Team Code *</Label>
                    <Input
                      id="teamCode"
                      placeholder="Enter 6-digit team code"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value)}
                      maxLength={6}
                      required
                      className="text-gray-400"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/team-formation')}
                      className="flex-1 bg-white/10 text-white hover:bg-white/20"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-white/10 text-white hover:bg-white/20"
                      disabled={loading}
                    >
                      {loading ? "Joining..." : "Join Team"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </section>
  );
};

export default JoinTeam;