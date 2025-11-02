import { useState, type JSX } from "react";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export const WaitlistPage = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const API_URL = import.meta.env.VITE_API_URL || 'https://glass-qpbx.onrender.com';
    
    try {
      const response = await fetch(`${API_URL}/api/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      console.error('Waitlist submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.hash = "#hero";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-screen bg-[#85b5d9] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-150px] left-[0px] w-[361.37110115641343px] h-[590.4843871021617px] hidden xl:block opacity-50 animate-breathe">
        <img
          className="w-full h-full object-contain"
          src="./Frame2147223669.png"
          alt="Decorative frame"
        />
      </div>
      <div className="absolute top-[500px] right-[-100px] w-[300px] h-[401px] hidden lg:block opacity-30 animate-breathe" style={{ animationDelay: '1s' }}>
        <img
          className="w-full h-full object-contain"
          src="https://c.animaapp.com/mg9zrj1xAlwudc/img/vector-3.svg"
          alt="Decorative vector"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Back button - positioned at top on mobile, absolute on larger screens */}
        <button
          onClick={handleBackToHome}
          className="absolute top-4 left-4 sm:top-6 sm:left-8 md:top-8 md:left-12 flex items-center gap-2 px-3 py-2 sm:px-4 rounded-[32px] bg-[rgba(238,249,253,0.1)] backdrop-blur-md backdrop-brightness-[110%] border border-[#c0ddef] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] hover:bg-[rgba(238,249,253,0.15)] transition-all duration-300 group z-20"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-[#F3F4F9] group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline font-['Instrument_Sans'] font-medium text-[16px] sm:text-[18px] text-[#F3F4F9]">
            Back to Home
          </span>
        </button>

        {/* Main content card */}
        <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:100ms] w-full max-w-[600px] bg-[#749fbf99] backdrop-blur-xl rounded-[34px] border border-white/20 p-6 sm:p-8 md:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] mt-auto mb-auto">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="flex flex-wrap justify-center items-center gap-2 text-center">
                  <h1 className="font-['Instrument_Sans'] font-semibold text-[32px] sm:text-[40px] lg:text-[50px] tracking-[-2px] text-[#c0ddef]">
                    Join the
                  </h1>
                  <h1 className="font-['Instrument_Sans'] font-semibold text-[32px] sm:text-[40px] lg:text-[50px] tracking-[-2px] text-[#eef9fd]">
                    Waitlist
                  </h1>
                </div>
                <p className="font-['Instrument_Sans'] font-medium text-[16px] sm:text-[18px] lg:text-[20px] text-[#eef9fd] text-center leading-[1.5] max-w-[500px]">
                  Be among the first to experience Glass. Get notified when we launch and receive early access to our AI-powered fact-checking platform.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label 
                    htmlFor="email" 
                    className="font-['Instrument_Sans'] font-medium text-[16px] text-[#c0ddef]"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-[20px] bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[#c0ddef] text-[#F3F4F9] placeholder:text-[#c0ddef]/50 font-['Instrument_Sans'] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#c0ddef] focus:border-[#c0ddef] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.20)]"
                  />
                </div>

                {error && (
                  <div className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="font-['Instrument_Sans'] text-sm text-red-200">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-[50px] px-6 py-3 bg-[rgba(255,255,255,0.1)] text-[#F3F4F9] rounded-[30px] border border-[#c0ddef] text-[18px] font-['Instrument_Sans'] font-medium hover:bg-[rgba(255,255,255,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#F3F4F9] border-t-transparent rounded-full animate-spin"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </form>

              {/* Benefits */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="font-['Instrument_Sans'] font-medium text-[14px] sm:text-[16px] text-[#c0ddef] text-center mb-4">
                  What you'll get:
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Early access to Glass when we launch",
                    "Priority support and feature updates",
                    "Exclusive insights into our development progress",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[rgba(255,255,255,0.15)] border border-[#c0ddef] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#eef9fd]"></div>
                      </div>
                      <span className="font-['Instrument_Sans'] text-[14px] sm:text-[16px] text-[#eef9fd] leading-[1.5]">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[rgba(255,255,255,0.15)] border-2 border-[#eef9fd] flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#eef9fd]"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[36px] text-[#eef9fd]">
                You're on the list!
              </h2>
              <p className="font-['Instrument_Sans'] font-medium text-[16px] sm:text-[18px] text-[#c0ddef] leading-[1.5] max-w-[450px]">
                Thanks for joining! We'll send you an email at <span className="text-[#eef9fd] font-semibold">{email}</span> as soon as Glass is ready.
              </p>
              <Button
                onClick={handleBackToHome}
                className="mt-4 px-8 py-3 bg-[rgba(255,255,255,0.1)] text-[#F3F4F9] rounded-[30px] border border-[#c0ddef] text-[16px] font-['Instrument_Sans'] font-medium hover:bg-[rgba(255,255,255,0.15)] transition-all duration-300 backdrop-blur-md"
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>

        {/* Additional info */}
        <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:300ms] mt-6 sm:mt-8 text-center">
          <p className="font-['Instrument_Sans'] text-[12px] sm:text-[14px] text-[#c0ddef]">
            Questions? Contact us at{" "}
            <a 
              href="mailto:hello@glass.app" 
              className="text-[#eef9fd] hover:underline"
            >
              hello@glass.app
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

