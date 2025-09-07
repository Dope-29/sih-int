import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProcessSteps = () => {
  const steps = [
    {
      number: 1,
      title: "Individual Registration",
      description: "(closes on 17 Sept)",
      color: "bg-blue-800 bg-opacity-50 text-blue-400"
    },
    {
      number: 2,
      title: "Form a Team of 6 members",
      description: "(atleast 1 female team member) - Use codes from respective team leads to join those teams",
      color: "bg-blue-800 bg-opacity-50 text-blue-400"
    },
    {
      number: 3,
      title: "Select Problem Statement",
      description: "Choose a problem statement from SIH",
      color: "bg-blue-800 bg-opacity-50 text-blue-400"
    },
    {
      number: 4,
      title: "Kickoff & Mentorship",
      description: "Meet your team & assigned mentor",
      color: "bg-blue-800 bg-opacity-50 text-blue-400"
    },
    {
      number: 5,
      title: "Idea Development",
      description: "Guided sessions + mentor support",
      color: "bg-blue-800 bg-opacity-50 text-blue-400"
    },
    {
      number: 6,
      title: "Final Pitching (Ideathon)",
      description: "Pitch your solution & get shortlisted for next level of SIH",
      color: "bg-blue-800 bg-opacity-50 text-blue-400"
    }
  ];

  return (
    <Card className="w-full max-w-2xl bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-blue-400">
          SIH 2025 Internals Process
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-2">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${step.color} flex items-center justify-center font-bold text-sm`}>
                {step.number}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessSteps;