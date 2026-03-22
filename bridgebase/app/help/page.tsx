'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, Home, Heart, Brain, Briefcase, Scale, Bus, Users,
  ArrowRight, ArrowLeft, Check, AlertCircle, Car, Footprints,
  Phone
} from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import {
  WizardState,
  defaultWizardState,
  WIZARD_CATEGORIES,
  WIZARD_URGENCY,
  WIZARD_LANGUAGES,
  WIZARD_TRANSPORT,
  WIZARD_ELIGIBILITY,
  encodeWizardState,
} from '@/lib/wizardTypes';

const iconMap: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Bus: <Bus className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  Footprints: <Footprints className="w-6 h-6" />,
};

const TOTAL_STEPS = 5;

export default function HelpWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(defaultWizardState);

  const updateState = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const toggleEligibility = (tag: string) => {
    setState(prev => ({
      ...prev,
      eligibilityTags: prev.eligibilityTags.includes(tag)
        ? prev.eligibilityTags.filter(t => t !== tag)
        : [...prev.eligibilityTags, tag],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!state.category;
      case 2: return !!state.urgency;
      case 3: return true;
      case 4: return !!state.transport;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      const encoded = encodeWizardState(state);
      router.push(`/help/results?state=${encoded}`);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Crisis Notice */}
          {state.urgency === 'today' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-warning-surface border-l-4 border-warning"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Need immediate help?</p>
                  <p className="text-sm text-foreground-secondary mt-1">
                    Call <a href="tel:911" className="text-primary font-medium">911</a> for emergencies or{' '}
                    <a href="tel:988" className="text-primary font-medium">988</a> for crisis support
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-foreground-muted mb-2">
              <span>Step {step} of {TOTAL_STEPS}</span>
              <span>{Math.round(progressPercent)}% complete</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepContainer key="step1">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  What do you need help with?
                </h1>
                <p className="text-foreground-secondary mb-8">
                  Select the area where you need support
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WIZARD_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateState('category', cat.id)}
                      className={`p-4 text-left border transition-all ${
                        state.category === cat.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`${state.category === cat.id ? 'text-primary' : 'text-foreground-muted'}`}>
                          {iconMap[cat.icon]}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{cat.label}</p>
                          <p className="text-sm text-foreground-secondary mt-0.5">{cat.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </StepContainer>
            )}

            {step === 2 && (
              <StepContainer key="step2">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  How urgent is your need?
                </h1>
                <p className="text-foreground-secondary mb-8">
                  This helps us prioritize the most relevant resources
                </p>
                
                <div className="space-y-3">
                  {WIZARD_URGENCY.map((urgency) => (
                    <button
                      key={urgency.id}
                      onClick={() => updateState('urgency', urgency.id as WizardState['urgency'])}
                      className={`w-full p-4 text-left border transition-all ${
                        state.urgency === urgency.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{urgency.label}</p>
                          <p className="text-sm text-foreground-secondary mt-0.5">{urgency.description}</p>
                        </div>
                        {state.urgency === urgency.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </StepContainer>
            )}

            {step === 3 && (
              <StepContainer key="step3">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  Any preferences?
                </h1>
                <p className="text-foreground-secondary mb-8">
                  Help us filter for the right options (all optional)
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-border cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={state.freeOnly}
                        onChange={(e) => updateState('freeOnly', e.target.checked)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-foreground">Free or low-cost only</p>
                        <p className="text-sm text-foreground-secondary">Show only free services</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={state.walkInsOnly}
                        onChange={(e) => updateState('walkInsOnly', e.target.checked)}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-foreground">Walk-ins welcome</p>
                        <p className="text-sm text-foreground-secondary">No appointment needed</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <p className="font-medium text-foreground mb-3">Preferred language</p>
                    <div className="flex flex-wrap gap-2">
                      {WIZARD_LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => updateState('language', state.language === lang.id ? '' : lang.id)}
                          className={`px-4 py-2 text-sm border transition-all ${
                            state.language === lang.id
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border text-foreground-secondary hover:border-primary/50'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </StepContainer>
            )}

            {step === 4 && (
              <StepContainer key="step4">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  How will you get there?
                </h1>
                <p className="text-foreground-secondary mb-8">
                  We&apos;ll find resources you can actually reach
                </p>
                
                <div className="space-y-3">
                  {WIZARD_TRANSPORT.map((transport) => (
                    <button
                      key={transport.id}
                      onClick={() => updateState('transport', transport.id as WizardState['transport'])}
                      className={`w-full p-4 text-left border transition-all ${
                        state.transport === transport.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`${state.transport === transport.id ? 'text-primary' : 'text-foreground-muted'}`}>
                          {iconMap[transport.icon]}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{transport.label}</p>
                          <p className="text-sm text-foreground-secondary mt-0.5">{transport.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </StepContainer>
            )}

            {step === 5 && (
              <StepContainer key="step5">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  Tell us about your situation
                </h1>
                <p className="text-foreground-secondary mb-8">
                  Select all that apply to find resources you may qualify for
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WIZARD_ELIGIBILITY.map((elig) => (
                    <button
                      key={elig.id}
                      onClick={() => toggleEligibility(elig.id)}
                      className={`p-4 text-left border transition-all ${
                        state.eligibilityTags.includes(elig.id)
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{elig.label}</span>
                        {state.eligibilityTags.includes(elig.id) && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </StepContainer>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                step === 1
                  ? 'text-foreground-muted cursor-not-allowed'
                  : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-border text-foreground-muted cursor-not-allowed'
              }`}
            >
              {step === TOTAL_STEPS ? 'Find Resources' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Skip option */}
          {step < TOTAL_STEPS && (
            <div className="mt-4 text-center">
              <button
                onClick={handleNext}
                className="text-sm text-foreground-muted hover:text-foreground transition-colors"
              >
                Skip this step
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Crisis footer */}
      <div className="border-t border-border bg-surface py-4">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-6 text-sm">
          <a href="tel:988" className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            988 Crisis Line
          </a>
          <a href="tel:911" className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            911 Emergency
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
