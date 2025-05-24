'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import { BrainCircuit, CheckCircle2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile?: UserProfile | null;
  viewedUserProfile?: UserProfile | null;
}

const AiAnalysisDialog: React.FC<AiAnalysisDialogProps> = ({ 
  isOpen, 
  onClose, 
  currentUserProfile,
  viewedUserProfile 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<string[]>([]);
  const [compatibilityScore, setCompatibilityScore] = useState(0);

  const sharedSkills = useMemo(() => {
    if (!currentUserProfile?.skills || !viewedUserProfile?.skills) return [];
    return currentUserProfile.skills.filter(skill => viewedUserProfile.skills.includes(skill));
  }, [currentUserProfile, viewedUserProfile]);

  const sharedInterests = useMemo(() => {
    if (!currentUserProfile?.interests || !viewedUserProfile?.interests) return [];
    return currentUserProfile.interests.filter(interest => viewedUserProfile.interests.includes(interest));
  }, [currentUserProfile, viewedUserProfile]);
  
  const sharedProjectAreas = useMemo(() => {
    if (!currentUserProfile?.projectAreas || !viewedUserProfile?.projectAreas) return [];
    return currentUserProfile.projectAreas.filter(area => viewedUserProfile.projectAreas.includes(area));
  }, [currentUserProfile, viewedUserProfile]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setAnalysisResult([]);
      setCompatibilityScore(0);

      // Simulate API call and analysis
      const timer = setTimeout(() => {
        if (currentUserProfile && viewedUserProfile) {
          const points: string[] = [];
          let score = 0;

          if (sharedSkills.length > 0) {
            points.push(`You both share ${sharedSkills.length} skill(s): ${sharedSkills.join(", ")}.`);
            score += sharedSkills.length * 20;
          }

          if (sharedInterests.length > 0) {
            points.push(`Common interests in ${sharedInterests.join(", ")} could spark great conversations.`);
            score += sharedInterests.length * 15;
          }
          
          if (sharedProjectAreas.length > 0) {
            points.push(`You're both interested in project areas like ${sharedProjectAreas.join(", ")}.`);
            score += sharedProjectAreas.length * 25;
          }

          if (currentUserProfile.department === viewedUserProfile.department) {
            points.push(`Being in the same department (${currentUserProfile.department}) is a plus for understanding each other's academic context.`);
            score += 10;
          }
          
          if (Math.abs(parseInt(currentUserProfile.year) - parseInt(viewedUserProfile.year)) <= 1 ){
            points.push(`Similar academic years might mean shared experiences or course knowledge.`);
            score +=5;
          }

          if (points.length === 0) {
            points.push("While you both have unique profiles, there aren't many direct overlaps in listed skills or interests. However, diverse perspectives can be valuable!");
          }

          setAnalysisResult(points);
          setCompatibilityScore(Math.min(100, Math.max(0, score))); // Cap score between 0-100
        }
        setIsLoading(false);
      }, 2500); // Simulate delay

      return () => clearTimeout(timer);
    }
  }, [isOpen, currentUserProfile, viewedUserProfile, sharedSkills, sharedInterests, sharedProjectAreas]);

  const getScoreColor = (score: number) => {
    if (score > 75) return "text-green-500";
    if (score > 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreText = (score: number) => {
    if (score > 75) return "Excellent Match";
    if (score > 50) return "Good Potential";
    if (score > 25) return "Some Overlap";
    return "Could Be Complementary";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-4 bg-gradient-to-br from-purple-600 via-primary to-accent text-primary-foreground">
                <DialogTitle className="text-2xl font-semibold flex items-center">
                  <BrainCircuit className="w-7 h-7 mr-2.5 shrink-0" />
                  Gemini AI Match Analysis
                </DialogTitle>
                {viewedUserProfile && <DialogDescription className="text-sm text-primary-foreground/80 mt-1">
                  Analyzing potential synergy between you and {viewedUserProfile.firstName} {viewedUserProfile.lastName}.
                </DialogDescription>}
              </DialogHeader>
              
              <div className="p-6 min-h-[250px] flex flex-col justify-center items-center">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
                    <p className="font-semibold text-lg text-foreground">Analyzing profiles...</p>
                    <p className="text-sm text-muted-foreground">Gemini is comparing skills, interests, and project goals.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
                    className="w-full space-y-4 text-sm"
                  >
                    <div className="text-center mb-5">
                        <p className={`text-4xl font-bold ${getScoreColor(compatibilityScore)}`}>{compatibilityScore}%</p>
                        <p className={`text-base font-semibold ${getScoreColor(compatibilityScore)}`}>{getScoreText(compatibilityScore)}</p>
                    </div>
                    {analysisResult.map((point, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: index * 0.15 + 0.3 }}}
                        className="flex items-start gap-2.5 p-2.5 bg-muted/70 rounded-md border border-border/70"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{point}</span>
                      </motion.div>
                    ))}
                    {compatibilityScore < 30 && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: analysisResult.length * 0.15 + 0.3 }}}
                            className="flex items-start gap-2.5 p-2.5 bg-blue-500/10 rounded-md border border-blue-500/30"
                        >
                            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-blue-700 dark:text-blue-300">Low overlap can sometimes lead to the most innovative collaborations by bringing diverse perspectives together!</span>
                        </motion.div>
                    )}
                  </motion.div>
                )}
              </div>

              <DialogFooter className="p-4 border-t bg-muted/50">
                <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AiAnalysisDialog; 