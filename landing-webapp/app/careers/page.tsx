'use client';

import { Plus_Jakarta_Sans } from 'next/font/google';
import Navigation from '../components/Navigation';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400','600','700','800'], display: 'swap' });

export default function CareersPage() {
  return (
    <div className={`min-h-screen bg-black text-white relative overflow-x-hidden ${jakarta.className}`}>
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white/80">Careers</span>
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join us in building the future of truth verification and misinformation detection.
          </p>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
            <p className="text-white/70">
              We're looking for passionate individuals who want to make a difference in the fight against misinformation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



