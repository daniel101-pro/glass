import { useState, useRef, useEffect, type JSX } from "react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from "recharts";

const navigationTabs = [
  { id: "conversations", label: "Conversations", active: true },
  { id: "documents", label: "Documents", active: false },
  { id: "images", label: "Images & Video", active: false },
  { id: "social", label: "Social Media", active: false },
  { id: "everyday", label: "Everyday Use", active: false },
];

interface DeepfakeGrowthChartProps {
  activeTab: string;
}

const DeepfakeGrowthChart = ({ activeTab }: DeepfakeGrowthChartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Chart data based on active tab
  const getChartData = () => {
    switch (activeTab) {
      case 'deepfakes':
        return [
          { year: "2019", value: 8000, fill: "#85b5d9" },
          { year: "2025", value: 550000, fill: "#eef9fd" },
        ];
      case 'misinformation':
        return [
          { year: "2019", value: 50000, fill: "#ff9a9e" },
          { year: "2025", value: 350000, fill: "#ffd4b8" },
        ];
      case 'trust':
        return [
          { year: "2019", value: 90, fill: "#a8e6cf" },
          { year: "2025", value: 42, fill: "#dcedc1" },
        ];
      default:
        return [
          { year: "2019", value: 8000, fill: "#85b5d9" },
          { year: "2025", value: 550000, fill: "#eef9fd" },
        ];
    }
  };

  const getYAxisFormatter = () => {
    if (activeTab === 'trust') {
      return (value: number) => `${value}%`;
    }
    return (value: number) => `${(value / 1000).toFixed(0)}k`;
  };

  // Update animation key when activeTab changes
  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, [activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimationKey(prevKey => prevKey + 1);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = chartRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const data = getChartData();
  const formatYAxis = getYAxisFormatter();

  return (
    <div 
      ref={chartRef}
      className="flex flex-col justify-center items-center gap-[10px] w-full max-w-[682px] h-[550px] sm:h-[600px] lg:h-[928px] px-4"
    >
      <div className="flex flex-col items-center p-[20px] sm:p-[30px] gap-[20px] w-full h-full bg-[#749fbf99] rounded-[20px] sm:rounded-[30px]">
        <div className="flex flex-row justify-center items-end w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={animationKey}
              data={data}
              margin={{ top: 40, right: 20, left: 10, bottom: 40 }}
              style={{ outline: 'none' }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#c0ddef" opacity={0.3} />
              <XAxis
                dataKey="year"
                stroke="#eef9fd"
                fontSize={14}
                tick={{ fontWeight: "bold" }}
              />
              <YAxis
                stroke="#eef9fd"
                fontSize={12}
                tickFormatter={formatYAxis}
              />
              <Bar
                dataKey="value"
                radius={[10, 10, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
                animationBegin={0}
                isAnimationActive={isVisible}
                pointerEvents="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill} 
                  />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  fill="#eef9fd" 
                  fontSize={14}
                  fontWeight="bold"
                  formatter={(label) => {
                    if (typeof label !== 'number') return label;
                    return activeTab === 'trust' 
                      ? `${label}%` 
                      : `${(label / 1000).toFixed(0)}k`;
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-row justify-center items-center p-[12px_0px] gap-[10px] w-full max-w-[595px]">
          <div className="font-['Instrument_Sans'] font-semibold text-[20px] sm:text-[30px] lg:text-[40px] text-center tracking-[-1px] text-[#c0ddef]">
            {activeTab === 'deepfakes' && "That's a 60-70× increase (6,600%)."}
            {activeTab === 'misinformation' && "Misinformation spreads 6x faster than true news."}
            {activeTab === 'trust' && "Only 42% trust social media to separate fact from fiction."}
          </div>
        </div>
        <p className="w-full max-w-[622px] font-['Instrument_Sans'] font-medium text-[16px] sm:text-[20px] lg:text-[25px] leading-[1.4] text-center tracking-[-1px] text-[#C0DDEF]">
          {activeTab === 'deepfakes' && "Every day, AI-generated content and deepfakes flood our feeds. It's harder than ever to know what's real and what's not. Glass gives you clarity."}
          {activeTab === 'misinformation' && "False information spreads rapidly across platforms, making it challenging to distinguish fact from fiction. Glass helps you cut through the noise."}
          {activeTab === 'trust' && "In an era of information overload, trust in digital content is at an all-time low. Glass provides the verification tools you need to stay informed."}
        </p>
      </div>
    </div>
  );
};

export const HeaderSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState('deepfakes');
  const [videoTab, setVideoTab] = useState('conversations');

  // YouTube video IDs for each tab (random videos)
  const youtubeVideoIds = {
    conversations: 'dQw4w9WgXcQ', // Sample video - replace with your choice
    documents: 'jNQXAC9IVRw', // Sample video - replace with your choice
    images: '9bZkp7q19f0', // Sample video - replace with your choice
    social: 'kJQP7kiw5Fk', // Sample video - replace with your choice
    everyday: 'fJ9rUzIMcZQ', // Sample video - replace with your choice
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=1&rel=0&modestbranding=1`;
  };

  return (
    <section className="relative w-full bg-[#85b5d9] overflow-hidden min-h-screen z-0">
   {/* Background Vector - visible only on extra-large screens (xl) and up */}
<div className="absolute z-[-1] w-[300px] h-[300px] hidden xl:block animate-breathe">
  <img
    alt="Vector background"
    src="/Frame2147223669.png"
  />
</div>

      {/* See Through */}
      <section id="see-through" className="relative z-10">
        <div className="flex flex-col w-full max-w-[1015px] mx-auto items-center gap-12 sm:gap-24 py-[27px] px-4">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <div className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[40px] lg:text-[50px] tracking-[-2px] text-[#c0ddef]">
                See through the
              </div>
              <div className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[40px] lg:text-[50px] text-[#eef9fd]">
                Glass
              </div>
            </div>
            <div className="max-w-[744px] font-['Instrument_Sans'] font-medium text-[#eef9fd] text-[16px] sm:text-[20px] lg:text-[25px] text-center tracking-[-1px] leading-[1.4]">
              Glass works in the background, scanning the world around you — text,
              images, audio, and video — to separate fact from fiction in real
              time.
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            <Tabs value={videoTab} onValueChange={setVideoTab} className="w-full">
              <TabsList className="flex flex-wrap justify-center gap-4 bg-transparent">
                {navigationTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`font-['Instrument_Sans'] font-semibold text-[18px] sm:text-[22px] lg:text-[26px] transition-all ${
                      videoTab === tab.id
                        ? "text-[#f3f4f9]"
                        : "text-[#c0ddef] shadow-texture"
                    }`}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="relative w-full max-w-full overflow-hidden rounded-lg bg-black/10" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                key={videoTab}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={getYouTubeEmbedUrl(youtubeVideoIds[videoTab as keyof typeof youtubeVideoIds])}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <Button 
              onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full sm:w-[184px] h-[44px] px-4 py-[10px] bg-[#ffffff0f] text-[#F3F4F9] rounded-[30px] border border-[#c0ddef] text-[16px] sm:text-[20px] hover:bg-[#ffffff1a] transition-colors"
            >
              Get Early Access
            </Button>
          </div>
        </div>
      </section>

      {/* Blur Section */}
       <div className="translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms] absolute  right-[-50px] w-[334px] h-[412px] flex hidden lg:block">
        <div className=" w-[314.64px] h-[357.84px]  relative animate-breathe" style={{ animationDelay: '1s' }}>
          <img
            className="absolute"
            alt="Frame"
            src="./Frame2147223472.png"
          />
        </div>
      </div>
      <section id="blur" className="relative z-10">
        <div className="flex flex-col items-center gap-8 sm:gap-16 w-full max-w-[782px] mx-auto py-16 px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <div className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[40px] lg:text-[50px] text-[#c0ddef]">
                The truth shouldn't be
              </div>
              <div className="font-['Instrument_Sans'] font-semibold text-[28px] sm:text-[40px] lg:text-[50px] text-white blur-[2px]">
                blurry.
              </div>
            </div>
            <div className="font-['Instrument_Sans'] font-medium text-[16px] sm:text-[20px] lg:text-[25px] leading-[1.4] text-center text-[#eef9fd]">
              Every day, fake news, AI-generated content, and distorted information flood our feeds. It's harder than ever to know what's real and what's not. Glass gives you clarity.
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-wrap justify-center gap-4 text-[18px] sm:text-[22px] lg:text-[26px] font-semibold">
              <button 
                onClick={() => setActiveTab('deepfakes')}
                className={`${activeTab === 'deepfakes' ? 'text-[#f3f4f9]' : 'text-[#c0ddef] shadow-texture'} cursor-pointer`}
              >
                Deepfakes
              </button>
              <button 
                onClick={() => setActiveTab('misinformation')}
                className={`${activeTab === 'misinformation' ? 'text-[#f3f4f9]' : 'text-[#c0ddef] shadow-texture'} cursor-pointer`}
              >
                Misinformation
              </button>
              <button 
                onClick={() => setActiveTab('trust')}
                className={`${activeTab === 'trust' ? 'text-[#f3f4f9]' : 'text-[#c0ddef] shadow-texture'} cursor-pointer`}
              >
                Trust & Verification
              </button>
            </div>
            <div className="w-full">
              <DeepfakeGrowthChart activeTab={activeTab} />
            </div>
          </div>

          <Button 
            onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full sm:w-[184px] h-[44px] px-4 py-[10px] bg-[#ffffff0f] rounded-[30px] border border-[#c0ddef] text-[16px] sm:text-[20px] hover:bg-[#ffffff1a] transition-colors text-[#F3F4F9] font-['Instrument_Sans']"
          >
            Start using Glass
          </Button>
        </div>
      </section>
      {/* */}
 {/* Features Showcase */}
<section id="why" className="relative z-10 w-full py-20 px-4">
  <div className="flex flex-col items-center gap-16 w-full max-w-6xl mx-auto">

    {/* Title */}
    <div className="flex flex-wrap justify-center gap-x-3">
      <h2 className="font-['Instrument_Sans'] font-semibold text-4xl sm:text-5xl text-[#C0DDEF]">
        Why
      </h2>
      <h2 className="font-['Instrument_Sans'] font-semibold text-4xl sm:text-5xl text-white">
        Glass
      </h2>
    </div>

    {/* Features Grid - This outer gap-6 separates the two main columns */}
    <div className="flex flex-col lg:flex-row gap-6 w-full">

      {/* Left Column - The gap is removed here */}
      <div className="flex flex-col w-full lg:w-1/2 gap-6">
        {/* Card: Sharp Accuracy (Top Card) */}
        <div className="flex flex-col justify-between rounded-[34px] border border-white/20 bg-[#749fbf99] backdrop-blur-xl p-8 h-full">
          <div>
            <h3 className="font-['Instrument_Sans'] font-medium text-2xl text-white">
              Sharp Accuracy
            </h3>
          </div>
          <img
            src="/sharp-accuracy.png"
            alt="Sharp Accuracy UI showing a fact-check"
            className="w-full rounded-2xl my-12"
          />
          <p className="font-['Instrument_Sans'] text-sm text-white leading-relaxed">
            Every claim, every source, every detail checked against the strongest signals. No fluff—just truth.
          </p>
        </div>

        {/* Card: Transparent Proof (Bottom Card) */}
        <div className="flex flex-col justify-between rounded-[34px] border border-white/20 bg-[#749FBF99] backdrop-blur-xl p-8 h-full">
          <div>
            <h3 className="font-['Instrument_Sans'] font-medium text-2xl text-white">
              Transparent Proof
            </h3>
          </div>
          <img
            src="/transparent-proof.png"
            alt="Transparent Proof UI showing data sources"
            className="w-full rounded-2xl my-12"
          />
          <p className="font-['Instrument_Sans'] text-sm text-white leading-relaxed">
            We don't just say what's real—we show you why. Evidence, context, and reasoning you can trust.
          </p>
        </div>
      </div>

      {/* Right Column - The gap is removed here */}
      <div className="flex flex-col w-full lg:w-1/2">
        {/* Card: Built for Speed (Top Card) */}
        <div className="flex flex-col justify-between rounded-t-[34px] border-t border-x border-white/20 bg-[#749fbf99] backdrop-blur-xl p-8 h-full">
          <div>
            <h3 className="font-['Instrument_Sans'] font-medium text-2xl text-white">
              Built for Speed
            </h3>
          </div>
          <img
            src="/built-for-speed.png"
            alt="Built for Speed UI showing a toggle"
            className="w-full rounded-2xl my-12 self-center left-0"
          />
          <p className="font-['Instrument_Sans'] text-sm text-white leading-relaxed">
            Get Answers in seconds. Forget hours of digging. Hit ⌘+/ (or Ctrl+/) to fact-check instantly—right where you are.
          </p>
        </div>

        {/* Card: Always With You (Bottom Card) */}
        <div className="flex flex-col justify-between rounded-b-[34px] border-b border-x border-white/20 bg-[#749fbf99] backdrop-blur-xl p-8 h-full">
          <div>
            <h3 className="font-['Instrument_Sans'] font-medium text-2xl text-white">
              Always With You
            </h3>
          </div>
          <img
            src="/always-with-you.png"
            alt="Always With You UI showing another toggle"
            className="w-full rounded-2xl my-12 self-center"
          />
          <p className="font-['Instrument_Sans'] text-sm text-white leading-relaxed">
            Glass lives where you are—your browser, your chats, your workflow. No switching apps, no friction.
          </p>
        </div>
      </div>
    </div>

    {/* CTA Button */}
    <div className="pt-4">
       <button 
         onClick={() => { window.location.hash = '#waitlist'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
         className="w-auto px-8 py-2 bg-white/10 rounded-full border border-blue-200/50 text-white text-lg hover:bg-white/20 transition-colors"
       >
          Get Early Access
       </button>
    </div>

  </div>
</section>


    </section>
  );
};
