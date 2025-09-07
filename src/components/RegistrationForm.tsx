import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  email: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  department: string;
  batch: string;
  yearOfStudy: string;
}

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    fullName: "",
    gender: "",
    phoneNumber: "",
    department: "",
    batch: "",
    yearOfStudy: ""
  });


  const departments = [
    "Computer Science Engineering",
    "Electronics & Communication",
    "Electrical & Electronics",
    "Mechanical Engineering",
    "Civil Engineering"
  ];

  const batches = ["S1", "S3", "S5", "S7"];
  const yearsOfStudy = ["First Year", "Second Year", "Third Year", "Fourth Year"];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['email', 'fullName', 'gender', 'phoneNumber', 'department', 'batch', 'yearOfStudy'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }

    try {
      // First check if this email is already in team_members
      const { data: teamMemberData } = await supabase
        .from('team_members')
        .select('id')
        .eq('member_email', formData.email)
        .maybeSingle();

      // If user already has a team, redirect them
      if (teamMemberData) {
        toast({
          title: "Already in a Team",
          description: "This email is already registered and part of a team.",
          variant: "destructive"
        });
        navigate('/team-details');
        return;
      }

      // Check if already registered
      const { data: existingReg } = await supabase
        .from('registrations')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingReg) {
        toast({
          title: "Already Registered",
          description: "You can now proceed to create or join a team.",
          variant: "info"
        });
        navigate('/team-formation');
        return;
      }

      // If not registered, save to Supabase
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            email: formData.email,
            full_name: formData.fullName,
            gender: formData.gender,
            phone_number: formData.phoneNumber,
            department: formData.department,
            batch: formData.batch,
            year_of_study: formData.yearOfStudy,
          }
        ]);

      if (error) {
        toast({
          title: "Registration Failed",
          description: "An error occurred during registration. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Registration Successful!",
        description: "Your registration has been submitted successfully."
      });

      // Navigate to Team Formation page
      navigate('/team-formation');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-black bg-opacity-70 text-white border-2 border-blue-500 shadow-blue-500/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-400">
          Smart India Hackathon - Internals
        </CardTitle>
        <p className="text-gray-400">CEM Registration</p>
        <p className="text-sm text-gray-400">Register for SIH Internals (CEM)</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Personal Details</h3>
            <p className="text-sm text-gray-400 mb-4">Tell us about yourself</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-gray-800 bg-opacity-50 text-white border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  className="bg-gray-800 bg-opacity-50 text-white border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="bg-gray-800 bg-opacity-50 text-white border-gray-600">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="e.g., +91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  required
                  className="bg-gray-800 bg-opacity-50 text-white border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Academic Details</h3>
            <p className="text-sm text-gray-400 mb-4">Your study information</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="bg-gray-800 bg-opacity-50 text-white border-gray-600">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="batch">Batch *</Label>
                <Select onValueChange={(value) => handleInputChange('batch', value)}>
                  <SelectTrigger className="bg-gray-800 bg-opacity-50 text-white border-gray-600">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yearOfStudy">Year of Study *</Label>
                <Select onValueChange={(value) => handleInputChange('yearOfStudy', value)}>
                  <SelectTrigger className="bg-gray-800 bg-opacity-50 text-white border-gray-600">
                    <SelectValue placeholder="Select Year of Study" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearsOfStudy.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex-1 bg-white/10 text-white hover:bg-white/20 border-gray-600"
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;