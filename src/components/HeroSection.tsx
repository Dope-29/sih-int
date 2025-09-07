import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added Card imports
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import DotGrid from './DotGrid';
import AestheticsCountdown from './AestheticsCountdown';
import VariableProximity from './VariableProximity';
import FadeContent from './FadeContent';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inTeam, setInTeam] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkTeamStatus = async () => {
      
      if (user && user.id) { // Ensure user and user.id are valid
        const { data, error } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("member_email", user.email)
          .single();

        if (error) {
          console.error("Supabase query error:", error); // Log the error for debugging
        }

        if (data && !error) {
          setInTeam(true);
        }
      } else {
        console.warn("User or user ID is not available, skipping team status check.");
      }
      setLoading(false);
    };

    checkTeamStatus();
  }, [user]);

  return (
    <section className="text-white" style={{ position: 'relative', zIndex: 1 }}>
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
      <div className="container mx-auto text-center px-6 py-16" style={{ position: 'relative', zIndex: 2 }}>
        {/* Official Logos */}
        <div className="flex justify-center items-center gap-16 mb-8 flex-wrap">
          <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <img src="/logos/ministry-of-education.png" alt="Ministry of Education" className="h-28" />
          </FadeContent>
          <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <img src="/logos/aicte.png" alt="AICTE" className="h-28" />
          </FadeContent>
          <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <img src="/logos/moes-innovation-cell.png" alt="MoE's Innovation Cell" className="h-28" />
          </FadeContent>
          <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <img src="/logos/smart-india-hackathon-2025.png" alt="Smart India Hackathon 2025" className="h-28" />
          </FadeContent>
        </div>

        {/* Main Title */}
        <div
          ref={containerRef}
          style={{ position: 'relative' }}
          className="mb-8" // Added mb-8 to maintain spacing
        >
          <VariableProximity
            label={'Smart India Hackathon 2025'}
            className={'variable-proximity-demo text-6xl md:text-8xl font-bold'} // Added font styles
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={100}
            falloff='linear'
          />
        </div>
        
        {/* Subtitle */}
        <h2 className="text-xl md:text-2xl mb-6 text-white/90">
          College of Engineering, Muttathara - Internal Selection
        </h2>
        
        {/* Description */}
        <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto text-white/80 leading-relaxed">
          CEM's internal selection for the nationwide innovation marathon. Ideate, build 
          and collaborate to secure your spot. Form diverse teams, showcase creativity 
          and solve real-world challenges.
        </p>

        {/* Partner Logos */}
        <div className="flex justify-center items-center gap-8 mb-8 flex-wrap">
          <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <img src="/logos/iedc-ignite.png" alt="IEDC Ignite" className="h-36" />
          </FadeContent>
          <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <img src="/logos/mulearn.png" alt="μLearn" className="h-36" />
          </FadeContent>
        </div>

        {/* Aesthetics Countdown */}
        <AestheticsCountdown />

        {/* CTA Button */}
        {loading ? (
          <p>Loading...</p>
        ) : user && inTeam ? (
          <Button 
            onClick={() => navigate('/team-details')}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
          >
            View Team Details →
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/signin')}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
          >
            Begin Registration →
          </Button>
        )}
        <div className="mt-16 text-left max-w-4xl mx-auto space-y-6">
          <p className="text-base md:text-lg leading-relaxed">
            <span className="font-bold text-blue-400">What is the Smart India Hackathon (SIH)?</span><br />
            Spearheaded by the Ministry of Education’s Innovation Cell, SIH is the world's largest open innovation model. It's a nationwide initiative where students like you tackle pressing challenges faced by government ministries, PSUs, and top industries. Whether your passion is software or hardware, SIH provides a platform to build innovative solutions that can make a real-world impact.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            <span className="font-bold text-blue-400">Why Should You Participate? Top Benefits for CE Muttathara Students</span><br />
            Participating in SIH is more than just a competition; it’s a transformative experience that can shape your future. Here’s how you benefit:
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mt-10"> {/* Changed to flex column, centered items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"> {/* First row: 3 cards */}
            {/* Card 1 */}
            <Card className="p-5 bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle>Solve Real-World Problems for Top Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Imagine developing solutions for organizations like ISRO, the Ministry of Jal Shakti, or the Ministry of Ayush. SIH gives you the chance to work on actual problem statements, from enhancing moon images to building AI-powered yoga mats and monitoring water quality in the Ganga.</p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="p-5 bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle>Launch Your Career and Gain National Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Winning or even just participating in SIH is a massive boost to your resume. Top companies and government departments scout for talent at this event. Your solution could be directly adopted and funded by a ministry, fast-tracking your career before you even graduate.</p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="p-5 bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle>Become an Entrepreneur</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Have a startup idea? SIH is the ultimate launchpad. Through initiatives like YUKTI (National Innovation Repository), winning ideas receive mentorship, funding, and incubation support. Over 100 startups have already been born from the SIH ecosystem. Your project could be next!</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[calc(2*300px+24px)]"> {/* Second row: 2 cards, centered. Assuming card width around 300px for max-w calculation */}
            {/* Card 4 */}
            <Card className="p-5 bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle>Develop Critical Skills Beyond the Classroom</CardTitle>
              </CardHeader>
              <CardContent>
                <p>SIH isn't just about coding. Through initiatives like the Design Week Celebration and IDE Bootcamps, you'll learn about product design, ergonomics, and business modeling. It’s a chance to develop a complete skill set from idea to market-ready product.</p>
              </CardContent>
            </Card>

            {/* Card 5 */}
            <Card className="p-5 bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
              <CardHeader>
                <CardTitle>Win Exciting Prizes and Build a Powerful Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Compete for significant cash prizes and connect with a vast network of mentors, industry experts, and government officials. The connections you make here can be invaluable for your future career.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-left max-w-4xl mx-auto space-y-6">
          <p className="text-base md:text-lg leading-relaxed">
            <span className="font-bold text-blue-400">SIH: A Movement of Innovation</span><br />
            <span className="font-bold">Massive Scale:</span> Over 13.91 lakh students have been a part of the SIH journey.<br />
            <span className="font-bold">Government Backing:</span> 40+ Central Ministries and various state governments actively participate and mentor teams.<br />
            <span className="font-bold">Proven Impact:</span> Dozens of projects from past SIH editions have been successfully implemented by ministries like DRDO, DST, and ISRO, solving critical national challenges.
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            <span className="font-bold text-blue-400">Get Ready to Make Your Mark!</span><br />
            The College of Engineering Muttathara encourages all aspiring innovators to take up this challenge. Start forming your teams, brainstorming ideas, and prepare to represent our college at the next Smart India Hackathon.<br /><br />
            This is your chance to learn, build, and contribute to a developed India.<br /><br />
            Stay tuned for announcements about the next edition and start your innovation journey today!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;