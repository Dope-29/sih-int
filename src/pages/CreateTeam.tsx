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

const CreateTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    teamName: "",
    leaderEmail: "",
    leaderName: ""
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.email) {
        const { data, error } = await supabase
          .from('registrations')
          .select('full_name, email')
          .eq('email', user.email)
          .single();

        if (error) {
          console.error("Error fetching registration data:", error);
        }

        if (data) {
          setFormData(prev => ({
            ...prev,
            leaderEmail: data.email,
            leaderName: data.full_name
          }));
        }
      }
    };

    fetchUserDetails();
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Verify user is registered
      const { data: existingRegistration, error: registrationError } = await supabase
        .from('registrations')
        .select('email')
        .eq('email', formData.leaderEmail)
        .single();

      if (!existingRegistration) {
        toast({
          title: "Error",
          description: "Leader must be registered first. Please complete registration.",
          variant: "destructive"
        });
        return;
      }

      // Generate team code
      const { data: teamCode } = await supabase.rpc('generate_team_code');

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{
          team_code: teamCode,
          team_name: formData.teamName,
          leader_email: formData.leaderEmail,
          leader_name: formData.leaderName,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add leader as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: team.id,
          member_email: formData.leaderEmail,
          member_name: formData.leaderName,
          is_leader: true,
          joined_at: new Date().toISOString()
        }]);

      if (memberError) throw memberError;

      toast({
        title: "Team Created Successfully!",
        description: `Your team code is: ${teamCode}. Share this with your team members.`
      });

      // Navigate to team details page
      navigate('/team-details');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive"
      });
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
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">Create Team</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="teamName">Team Name *</Label>
                    <Input
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                      required
                      className="text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaderName">Leader Name</Label>
                    <Input
                      id="leaderName"
                      value={formData.leaderName}
                      disabled
                      readOnly
                      className="text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaderEmail">Leader Email</Label>
                    <Input
                      id="leaderEmail"
                      type="email"
                      value={formData.leaderEmail}
                      disabled
                      readOnly
                      className="text-gray-400"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/team-formation')} className="flex-1 bg-white/10 text-white hover:bg-white/20">
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 bg-white/10 text-white hover:bg-white/20">Create Team</Button>
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

export default CreateTeam;