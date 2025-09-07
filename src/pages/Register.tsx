import RegistrationForm from "@/components/RegistrationForm";
import ProcessSteps from "@/components/ProcessSteps";
import DotGrid from '@/components/DotGrid';

const Register = () => {
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Right Side - Process Steps (appears first on mobile) */}
            <div className="flex justify-center lg:justify-start lg:order-last">
              <ProcessSteps />
            </div>

            {/* Left Side - Registration Form (appears second on mobile) */}
            <div className="flex justify-center lg:order-first">
              <RegistrationForm />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Register;