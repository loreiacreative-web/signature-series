import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Download, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Map as MapIcon,
  Compass,
  Hammer,
  ScrollText
} from 'lucide-react';
import { cn } from './lib/utils';
import { FormData, PERSONALITY_OPTIONS, FREQUENCY_OPTIONS, Result } from './types';
import { generateResult } from './logic';
import confetti from 'canvas-confetti';

export default function App() {
  const [step, setStep] = useState<'portal' | 'consultation' | 'forge' | 'emailGate' | 'blueprint'>('portal');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    product: '',
    personality: [],
    feeling: '',
    idealCustomer: '',
    coreQuestion: '',
    misconception: '',
    struggle: '',
    frequency: '1–2x week',
    passionTopic: '',
    email: ''
  });
  const [result, setResult] = useState<Result | null>(null);

  const questions = [
    { 
      id: 'businessName', 
      label: "What's your business name?", 
      placeholder: "e.g. Loreia Creative",
      type: 'text'
    },
    { 
      id: 'product', 
      label: "What do you sell? (product or service)", 
      placeholder: "e.g. Brand Strategy for Founders",
      type: 'text'
    },
    { 
      id: 'personality', 
      label: "Describe your brand personality (pick up to 3)", 
      type: 'multi-select',
      options: PERSONALITY_OPTIONS
    },
    { 
      id: 'feeling', 
      label: "What ONE feeling do you want people to have when they interact with your brand?", 
      placeholder: "e.g. Empowered, Seen, Luxurious",
      type: 'text'
    },
    { 
      id: 'idealCustomer', 
      label: "Who is your ideal customer?", 
      placeholder: "e.g. Visionary founders in tech",
      type: 'text'
    },
    { 
      id: 'coreQuestion', 
      label: "What's the #1 question your customers ask before buying?", 
      placeholder: "e.g. How do I start my brand world?",
      type: 'text'
    },
    { 
      id: 'misconception', 
      label: "What's a common misconception about your industry?", 
      placeholder: "e.g. Branding is just a logo",
      type: 'text'
    },
    { 
      id: 'struggle', 
      label: "What's one struggle your customers face that you help with?", 
      placeholder: "e.g. Feeling invisible in a crowded market",
      type: 'text'
    },
    { 
      id: 'frequency', 
      label: "How often can you realistically post?", 
      type: 'select',
      options: FREQUENCY_OPTIONS
    },
    { 
      id: 'passionTopic', 
      label: "What's ONE topic you could talk about for hours?", 
      placeholder: "e.g. The power of storytelling",
      type: 'text'
    }
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('forge');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      setStep('portal');
    }
  };

  useEffect(() => {
    if (step === 'forge') {
      const generate = async () => {
        try {
          const generated = await generateResult(formData);
          setResult(generated);
          setStep('emailGate');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E67E22', '#F39C12', '#FFC300']
          });
        } catch (error) {
          console.error("Generation failed", error);
          setStep('consultation');
        }
      };
      generate();
    }
  }, [step, formData]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePersonality = (option: string) => {
    const current = formData.personality;
    if (current.includes(option)) {
      updateFormData('personality', current.filter(o => o !== option));
    } else if (current.length < 3) {
      updateFormData('personality', [...current, option]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {step === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl w-full text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="inline-block p-3 bg-honey/10 rounded-full mb-4"
              >
                <Sparkles className="w-12 h-12 text-saffron" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight saffron-text">
                Find Your <br />
                <span className="text-deep-ink italic">Signature Series</span>
              </h1>
              <p className="text-xl md:text-2xl text-deep-ink/70 max-w-2xl mx-auto font-light">
                Architect a content world that resonates. Stop guessing what to post and start building your legacy.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => setStep('consultation')}
                className="gold-button flex items-center gap-2 text-lg group"
              >
                Begin The Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="pt-12 opacity-50 flex items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-honey flex items-center justify-center mb-2">
                  <MapIcon className="w-6 h-6 text-saffron" />
                </div>
                <span className="text-xs uppercase tracking-widest">Map Your World</span>
              </div>
              <div className="w-12 h-px bg-honey/30" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-honey flex items-center justify-center mb-2">
                  <Hammer className="w-6 h-6 text-saffron" />
                </div>
                <span className="text-xs uppercase tracking-widest">Forge The Lore</span>
              </div>
              <div className="w-12 h-px bg-honey/30" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-honey flex items-center justify-center mb-2">
                  <ScrollText className="w-6 h-6 text-saffron" />
                </div>
                <span className="text-xs uppercase tracking-widest">Claim Your Blueprint</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'consultation' && (
          <motion.div
            key="consultation"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl w-full glass-card p-8 md:p-12 space-y-8 relative overflow-hidden"
          >
            {/* Map Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-end text-xs uppercase tracking-widest font-bold text-saffron">
                <span>The Architect's Journey</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="map-progress-container">
                <div 
                  className="map-progress-bar" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} 
                />
                <div 
                  className="absolute top-0 h-full flex items-center transition-all duration-500"
                  style={{ left: `${((currentQuestion + 1) / questions.length) * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <Compass className="w-4 h-4 text-deep-ink animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-deep-ink">
                {questions[currentQuestion].label}
              </h2>

              <div className="min-h-[120px]">
                {questions[currentQuestion].type === 'text' && (
                  <input
                    autoFocus
                    type="text"
                    value={formData[questions[currentQuestion].id as keyof FormData] as string}
                    onChange={(e) => updateFormData(questions[currentQuestion].id as keyof FormData, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    placeholder={questions[currentQuestion].placeholder}
                    className="w-full bg-transparent border-b-2 border-honey/50 py-4 text-2xl focus:border-saffron outline-none transition-colors placeholder:text-deep-ink/20"
                  />
                )}

                {questions[currentQuestion].type === 'multi-select' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {questions[currentQuestion].options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => togglePersonality(option)}
                        className={cn(
                          "px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                          formData.personality.includes(option)
                            ? "border-saffron bg-saffron/10 text-saffron"
                            : "border-honey/20 hover:border-honey/50 text-deep-ink/60"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {questions[currentQuestion].type === 'select' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[currentQuestion].options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          updateFormData('frequency', option);
                          handleNext();
                        }}
                        className={cn(
                          "px-6 py-4 rounded-xl border-2 transition-all text-left flex items-center justify-between",
                          formData.frequency === option
                            ? "border-saffron bg-saffron/10 text-saffron"
                            : "border-honey/20 hover:border-honey/50 text-deep-ink/60"
                        )}
                      >
                        {option}
                        {formData.frequency === option && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-deep-ink/60 hover:text-deep-ink transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  questions[currentQuestion].type === 'text' 
                    ? !(formData[questions[currentQuestion].id as keyof FormData] as string).trim()
                    : questions[currentQuestion].type === 'multi-select'
                    ? formData.personality.length === 0
                    : false
                }
                className="gold-button flex items-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? 'Forge My Series' : 'Next Step'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'forge' && (
          <motion.div
            key="forge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-honey rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Hammer className="w-12 h-12 text-saffron" />
              </motion.div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold saffron-text animate-pulse">Architecting your world...</h2>
              <p className="text-deep-ink/60 font-light italic">Consulting the Lore of {formData.businessName}</p>
            </div>
          </motion.div>
        )}

        {step === 'emailGate' && (
          <motion.div
            key="emailGate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl w-full glass-card p-8 md:p-12 text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-block p-3 bg-honey/10 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-saffron" />
              </div>
              <h2 className="text-3xl font-bold text-deep-ink">Your Blueprint is Ready!</h2>
              <p className="text-lg text-deep-ink/70 font-light">
                We've architected your signature series. Enter your email below to unlock the full blueprint and receive a PDF copy.
              </p>
            </div>

            <div className="space-y-4">
              <input
                autoFocus
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && formData.email && setStep('blueprint')}
                placeholder="architect@yourworld.com"
                className="w-full bg-transparent border-b-2 border-honey/50 py-4 text-2xl text-center focus:border-saffron outline-none transition-colors placeholder:text-deep-ink/20"
              />
              <button
                onClick={() => formData.email && setStep('blueprint')}
                disabled={!formData.email || !formData.email.includes('@')}
                className="gold-button w-full text-lg"
              >
                Unlock My Blueprint
              </button>
            </div>
          </motion.div>
        )}

        {step === 'blueprint' && result && (
          <motion.div
            key="blueprint"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl w-full space-y-12 pb-20"
          >
            <div className="text-center space-y-4 no-print">
              <div className="inline-block px-4 py-1 rounded-full bg-saffron/10 text-saffron text-sm font-bold tracking-widest uppercase">
                Your Signature Series Blueprint
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest text-deep-ink/40 font-bold">Recommended Series Titles</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {result.seriesNames.map((name, idx) => (
                    <span key={idx} className={cn(
                      "px-4 py-2 rounded-full border-2 text-lg font-bold transition-all",
                      idx === 0 ? "border-saffron bg-saffron text-white scale-110 shadow-lg" : "border-honey/30 text-deep-ink/60"
                    )}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xl text-deep-ink/60 italic pt-4">Archetype: {result.archetype}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="glass-card p-8 border-l-4 border-l-saffron">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Compass className="w-6 h-6 text-saffron" />
                    Why This Works
                  </h3>
                  <p className="text-deep-ink/80 leading-relaxed font-light">
                    {result.whyItWorks}
                  </p>
                </div>

                <div className="glass-card p-8 space-y-6 no-print">
                  <h3 className="text-xl font-bold">Next Steps</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => window.print()}
                      className="w-full gold-button flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </button>
                    <a 
                      href="https://selar.com/ti17j67q87" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-honey text-saffron font-semibold hover:bg-saffron hover:text-white transition-all"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Alignment Call
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 px-4">
                  <ScrollText className="w-6 h-6 text-saffron" />
                  The 10-Episode Roadmap
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.episodes.map((episode) => (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: episode.id * 0.1 }}
                      className="glass-card p-6 hover:border-saffron/30 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-honey/10 text-saffron flex items-center justify-center font-bold text-sm">
                          {episode.id}
                        </span>
                        <div className="space-y-2">
                          <h4 className="font-bold text-lg leading-tight group-hover:text-saffron transition-colors">
                            {episode.title}
                          </h4>
                          <p className="text-sm text-deep-ink/50 font-light">
                            {episode.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-12 text-center space-y-6 bg-gradient-to-br from-saffron/5 to-clementine/5 no-print">
              <h2 className="text-3xl font-bold">Ready to turn these ideas into scroll-stopping posts?</h2>
              <p className="text-xl text-deep-ink/70 max-w-2xl mx-auto font-light">
                You have the roadmap. Now let us build the world. The <strong>Starter Story Pack</strong> takes your first 5 ideas and turns them into done-for-you carousels.
              </p>
              <a 
                href="https://selar.com/97176h44b6"
                target="_blank"
                rel="noopener noreferrer"
                className="gold-button text-lg inline-block"
              >
                Claim Your Starter Story Pack
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 left-0 w-full text-center text-xs uppercase tracking-[0.3em] text-deep-ink/30 pointer-events-none no-print">
        Loreia — Architecting Visionary Brand Worlds
      </footer>
    </div>
  );
}
