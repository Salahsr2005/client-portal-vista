import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Euro } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgramCard from '../ProgramCard';
import { getBudgetBreakdown, getMatchExplanation } from "@/services/ProgramMatchingService";

interface ProgramListProps {
  programs: any[];
  isGridView: boolean;
  selectedPrograms: string[];
  favoritePrograms: string[];
  showMatchDetails: { [key: string]: boolean };
  showBudgetBreakdown: { [key: string]: boolean };
  handleProgramSelect: (programId: string) => void;
  toggleFavorite: (programId: string) => void;
  toggleMatchDetails: (programId: string) => void;
  toggleBudgetBreakdown: (programId: string) => void;
  containerVariants: any;
  itemVariants: any;
}

export const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  isGridView,
  selectedPrograms,
  favoritePrograms,
  showMatchDetails,
  showBudgetBreakdown,
  handleProgramSelect,
  toggleFavorite,
  toggleMatchDetails,
  toggleBudgetBreakdown,
  containerVariants,
  itemVariants
}) => {
  if (isGridView) {
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {programs.map((program) => (
          <motion.div
            key={program.id}
            variants={itemVariants}
          >
            <ProgramCard 
              program={program}
              isSelected={selectedPrograms.includes(program.id)}
              isFavorite={favoritePrograms.includes(program.id)}
              onSelect={() => handleProgramSelect(program.id)}
              onFavorite={() => toggleFavorite(program.id)}
              isGridView={true}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {programs.map((program) => (
        <motion.div key={program.id} variants={itemVariants}>
          <ProgramCard 
            program={program}
            isSelected={selectedPrograms.includes(program.id)}
            isFavorite={favoritePrograms.includes(program.id)}
            onSelect={() => handleProgramSelect(program.id)}
            onFavorite={() => toggleFavorite(program.id)}
            isGridView={false}
          />
          
          <div className="pl-4 flex flex-wrap gap-2 mt-2">
            {program.matchScore !== undefined && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleMatchDetails(program.id)}
                className="text-xs flex items-center gap-1"
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                {showMatchDetails[program.id] ? "Hide match details" : "Show match details"}
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleBudgetBreakdown(program.id)}
              className="text-xs flex items-center gap-1"
            >
              <Euro className="h-3.5 w-3.5 mr-1" />
              {showBudgetBreakdown[program.id] ? "Hide cost breakdown" : "Show cost breakdown"}
            </Button>
          </div>
          
          <AnimatePresence>
            {showMatchDetails[program.id] && program.matchScore !== undefined && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-3 overflow-hidden bg-gradient-to-br from-white to-slate-50">
                  <CardContent className="p-4">
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          Match Details
                        </h3>
                        <div className="markdown-content whitespace-pre-wrap">
                          {typeof program.matchDetails === 'string' ? program.matchDetails.split('\n').map((line: string, i: number) => {
                            if (line.startsWith('##')) {
                              return <h4 key={i} className="text-md font-medium mb-2">{line.replace('## ', '')}</h4>;
                            } 
                            if (line.startsWith('*')) {
                              return (
                                <div key={i} className="flex items-start mb-1">
                                  <span className="mr-2">•</span>
                                  <span>{line.replace('* ', '')}</span>
                                </div>
                              );
                            }
                            return <p key={i}>{line}</p>;
                          }) : (
                            program.matchDetails && program.matchDetails.map((detail: string, i: number) => (
                              <div key={i} className="flex items-start mb-1">
                                <span className="mr-2">•</span>
                                <span>{detail}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showBudgetBreakdown[program.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-3 overflow-hidden bg-gradient-to-br from-white to-slate-50">
                  <CardContent className="p-4">
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                          <Euro className="h-5 w-5 mr-2 text-green-600" />
                          Cost Breakdown
                        </h3>
                        <div className="markdown-content whitespace-pre-wrap">
                          {(() => {
                            const breakdown = getBudgetBreakdown(program);
                            const items = [];
                            
                            // Tuition
                            items.push(<h4 key="tuition" className="text-md font-medium mt-2 mb-1">Tuition</h4>);
                            items.push(
                              <div key="tuition-val" className="flex items-start mb-1">
                                <span className="mr-2">•</span>
                                <span>€{breakdown.tuition.min.toLocaleString()} - €{breakdown.tuition.max.toLocaleString()}</span>
                              </div>
                            );
                            
                            // Living costs
                            items.push(<h4 key="living" className="text-md font-medium mt-2 mb-1">Living Costs</h4>);
                            items.push(
                              <div key="living-val" className="flex items-start mb-1">
                                <span className="mr-2">•</span>
                                <span>€{breakdown.livingCosts.min.toLocaleString()} - €{breakdown.livingCosts.max.toLocaleString()}</span>
                              </div>
                            );
                            
                            // Housing - only show if available in breakdown
                            if (breakdown.housing) {
                              items.push(<h4 key="housing" className="text-md font-medium mt-2 mb-1">Housing</h4>);
                              items.push(
                                <div key="housing-val" className="flex items-start mb-1">
                                  <span className="mr-2">•</span>
                                  <span>€{breakdown.housing.min.toLocaleString()} - €{breakdown.housing.max.toLocaleString()}</span>
                                </div>
                              );
                            }
                            
                            // Other fees
                            items.push(<h4 key="fees" className="text-md font-medium mt-2 mb-1">Other Fees</h4>);
                            
                            if (breakdown.applicationFee) {
                              items.push(
                                <div key="app-fee" className="flex items-start mb-1">
                                  <span className="mr-2">•</span>
                                  <span>Application Fee: €{breakdown.applicationFee.toLocaleString()}</span>
                                </div>
                              );
                            }
                            
                            if (breakdown.visaFee) {
                              items.push(
                                <div key="visa-fee" className="flex items-start mb-1">
                                  <span className="mr-2">•</span>
                                  <span>Visa Fee: €{breakdown.visaFee.toLocaleString()}</span>
                                </div>
                              );
                            }
                            
                            // Total
                            items.push(<h4 key="total" className="text-md font-medium mt-3 mb-1">Estimated Total</h4>);
                            items.push(
                              <div key="total-val" className="flex items-start mb-1 font-bold">
                                <span className="mr-2">•</span>
                                <span>€{breakdown.total.min.toLocaleString()} - €{breakdown.total.max.toLocaleString()}</span>
                              </div>
                            );
                            
                            return items;
                          })()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
};
