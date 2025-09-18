import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import DotGrid from '@/components/DotGrid';
import AestheticsCountdown from '@/components/AestheticsCountdown';

type Team = {
  team_name: string;
  team_code: string;
  id: string;
  leader_email: string;
  leader_name: string;
};

type TeamMember = {
  member_name: string;
  member_email: string;
  is_leader: boolean;
  joined_at: string;
};

export default function TeamDetails() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (user?.email) {
        try {
          // 1. Get the team member data and team ID
          const { data: teamMemberData, error: teamMemberError } = await supabase
            .from("team_members")
            .select(`
              *,
              teams:team_id (
                *
              )
            `)
            .eq("member_email", user.email)
            .single();

          if (teamMemberError) {
            console.error("Error fetching team member data:", teamMemberError);
            setLoading(false);
            return;
          }

          if (!teamMemberData?.teams) {
            setLoading(false);
            return;
          }

          // Set team data
          setTeam(teamMemberData.teams as Team);

          // 2. Get all team members for this team
          const { data: membersData, error: membersError } = await supabase
            .from("team_members")
            .select(`
              member_name,
              member_email,
              is_leader,
              joined_at
            `)
            .eq("team_id", teamMemberData.teams.id)
            .order('is_leader', { ascending: false })
            .order('joined_at', { ascending: true });

          if (membersError) {
            console.error("Error fetching members data:", membersError);
            setLoading(false);
            return;
          }

          setMembers(membersData);
        } catch (error) {
          console.error("Error in fetchTeamDetails:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTeamDetails();
  }, [user?.email]);

  if (loading) {
    return (
      <section className="text-white" style={{ position: 'relative', zIndex: 1, height: '100vh' }}>
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
          <div className="container mx-auto py-10">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="text-white" style={{ position: 'relative', zIndex: 1, height: '100vh' }}>
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
      <div className="container mx-auto py-10" style={{ position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6">
            <Card className="bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Team Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center">
                  <span className="text-4xl font-mono font-bold tracking-wider">{team?.team_code}</span>
                </div>
                <p className="text-sm text-white mt-2 text-center">Share this code with your team members to let them join</p>
              </CardContent>
            </Card>

            <Card className="bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold">Team Name</h3>
                  <p className="text-lg">{team?.team_name}</p>
                </div>
                <div>
                  <h3 className="font-bold">Team Leader</h3>
                  <p>{team?.leader_name}</p>
                  <p className="text-sm text-white">{team?.leader_email}</p>
                </div>
                <div>
                  <h3 className="font-bold">Team Members ({members.length}/6)</h3>
                  <ul className="mt-2 space-y-2">
                    {members.map((member, index) => (
                      <li key={index} className="flex flex-col p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{member.member_name}</span>
                          {member.is_leader && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Leader
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-white">{member.member_email}</span>
                        <span className="text-xs text-white">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {members.length >= 6 ? (
                    <p className="text-red-500 mt-2">Team is full</p>
                  ) : (
                    <p className="text-white mt-2">
                      {6 - members.length} spots remaining
                    </p>
                  )}
                </div>
                <AestheticsCountdown />
                <div>
                  <h3 className="font-bold">Hackathon</h3>
                  <p>Smart India Hackathon 2025</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Team Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white">
                  <span className="font-semibold text-white">Important:</span> Your team must include at least one female participant to be eligible for the hackathon.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Join Our WhatsApp Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-400 mb-4">
                  Stay updated with announcements, networking opportunities and get real SIH 2025 updates!
                </p>
                <Button
                  className="bg-white/10 text-white hover:bg-white/20"
                  onClick={() => window.open('https://chat.whatsapp.com/Dg9SQ4K0uBPF1I3r1Cz76E', '_blank')}
                >
                  Join WhatsApp Group
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}