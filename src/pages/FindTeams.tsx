import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

interface Team {
  id: string;
  team_name: string;
  team_code: string;
  leader_name: string;
  created_at: string;
  member_count: number;
}

const FindTeams = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Get all open teams
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, team_name, team_code, leader_name, created_at')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (teamsError) {
          console.error('Error fetching teams:', teamsError);
          toast({
            title: "Error Loading Teams",
            description: "Failed to load teams. Please try again.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        if (!teamsData || teamsData.length === 0) {
          setTeams([]);
          setLoading(false);
          return;
        }

        // Get member counts in parallel for all teams
        const countPromises = teamsData.map(team =>
          supabase
            .from('team_members')
            .select('id', { count: 'exact', head: true })
            .eq('team_id', team.id)
        );

        const countResults = await Promise.all(countPromises);

        // Combine team data with member counts
        const formattedTeams: Team[] = teamsData.map((team, index) => ({
          id: team.id,
          team_name: team.team_name,
          team_code: team.team_code,
          leader_name: team.leader_name,
          created_at: team.created_at,
          member_count: countResults[index].count || 0
        }));

        setTeams(formattedTeams);
      } catch (error) {
        console.error('Error in FindTeams:', error);
        toast({
          title: "Error",
          description: "Failed to load teams. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [toast]);

  const handleJoinTeam = (teamCode: string) => {
    navigate('/join-team', { state: { teamCode } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-official-blue">Available Teams</CardTitle>
              <p className="text-sm text-muted-foreground">
                Browse and join available teams for SIH Internals
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading teams...</div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No teams available at the moment.</p>
                  <Button
                    onClick={() => navigate('/create-team')}
                    className="mt-4"
                  >
                    Create a Team
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {teams.map((team) => (
                    <Card key={team.id}>
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{team.team_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Led by {team.leader_name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{team.member_count} members</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleJoinTeam(team.team_code)}
                          variant="outline"
                        >
                          Join Team
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate('/team-formation')}
                  className="flex-1"
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FindTeams;
