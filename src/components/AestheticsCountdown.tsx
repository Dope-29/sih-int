import { useEffect, useState } from "react";

const AestheticsCountdown = () => {
  // Hardcoded hackathon details (can be made dynamic later if needed)
  const registrationEndDate = new Date("2025-09-19T10:00:00");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = registrationEndDate.getTime() - now.getTime();

      // Calculate time left
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      // Update state
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // Stop countdown if time is up
      if (difference < 0) {
        clearInterval(interval);
        setTimeLeft("Hackathon Started!");
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    // Changed from section to div, removed h-screen, overflow-hidden, and relative
    <div className="text-white py-10"> {/* Added padding for spacing */}
      {/* Removed Dotted Grid Background */}

      {/* Content - Centered Card */}
      <div className="flex items-center justify-center"> {/* Removed relative z-10 and h-full */}
        <div className="p-10 rounded-lg border border-blue-500 bg-transparent text-center">
          <h2 className="text-2xl font-bold mb-4">Time left till Hackathon</h2>
          <p className="text-4xl font-mono font-bold">{timeLeft}</p>
        </div>
      </div>
    </div>
  );
};

export default AestheticsCountdown;