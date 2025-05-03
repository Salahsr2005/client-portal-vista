
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Euro } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgramCard from '../ProgramCard';
import { getMatchExplanation, getBudgetBreakdown } from "@/services/ProgramMatchingService";

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
                          {getMatchExplanation(program).split('\n').map((line, i) => {
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
                          })}
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
                          {getBudgetBreakdown(program).split('\n').map((line, i) => {
                            if (line.startsWith('##')) {
                              return <h4 key={i} className="text-md font-medium mb-2">{line.replace('## ', '')}</h4>;
                            } 
                            if (line.startsWith('###')) {
                              return <h5 key={i} className="text-sm font-medium mt-2 mb-1">{line.replace('### ', '')}</h5>;
                            }
                            if (line.startsWith('*')) {
                              return (
                                <div key={i} className="flex items-start mb-1">
                                  <span className="mr-2">•</span>
                                  <span>{line.replace('* ', '')}</span>
                                </div>
                              );
                            }
                            if (line.startsWith('_')) {
                              return <div key={i} className="text-xs text-muted-foreground ml-4">{line}</div>;
                            }
                            return <p key={i}>{line}</p>;
                          })}
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
