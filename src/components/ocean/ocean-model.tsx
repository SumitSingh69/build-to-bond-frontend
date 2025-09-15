"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";

interface Question {
  question: string;
  options: string[];
}

interface OceanData {
  OCEAN_Questions: {
    Openness: Question[];
    Conscientiousness: Question[];
    Extraversion: Question[];
    Agreeableness: Question[];
    Neuroticism: Question[];
  };
}

interface OceanModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const OceanModel: React.FC<OceanModelProps> = ({ isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const oceanData: OceanData = {
    OCEAN_Questions: {
      Openness: [
        {
          question: "I enjoy exploring new ideas and experiences.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
        {
          question: "I am curious about many different things.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
      ],
      Conscientiousness: [
        {
          question: "I like to keep things organized and planned.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
        {
          question: "I work hard to achieve my goals.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
      ],
      Extraversion: [
        {
          question: "I feel energized when I am around other people.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
        {
          question:
            "I enjoy being the center of attention in social situations.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
      ],
      Agreeableness: [
        {
          question: "I try to be kind and considerate toward others.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
        {
          question: "I am willing to cooperate to resolve conflicts.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
      ],
      Neuroticism: [
        {
          question: "I often feel worried or anxious.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
        {
          question: "I get upset easily when things go wrong.",
          options: [
            "Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
        },
      ],
    },
  };

  const allQuestions = [
    ...oceanData.OCEAN_Questions.Openness.map((q, i) => ({
      ...q,
      category: "Openness",
      index: i,
    })),
    ...oceanData.OCEAN_Questions.Conscientiousness.map((q, i) => ({
      ...q,
      category: "Conscientiousness",
      index: i,
    })),
    ...oceanData.OCEAN_Questions.Extraversion.map((q, i) => ({
      ...q,
      category: "Extraversion",
      index: i,
    })),
    ...oceanData.OCEAN_Questions.Agreeableness.map((q, i) => ({
      ...q,
      category: "Agreeableness",
      index: i,
    })),
    ...oceanData.OCEAN_Questions.Neuroticism.map((q, i) => ({
      ...q,
      category: "Neuroticism",
      index: i,
    })),
  ];

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
  const questionKey = `${currentQuestion?.category}-${currentQuestion?.index}`;
  const currentAnswer = answers[questionKey];
  const totalQuestionsAnswered = Object.keys(answers).length;
  const allQuestionsAnswered = totalQuestionsAnswered === allQuestions.length;

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Convert answers from option indices to actual option text
      const answersArray = Object.entries(answers).map(([questionKey, optionIndex]) => {
        // Find the question to get the option text
        const questionIndex = parseInt(questionKey.split('-')[1]);
        const category = questionKey.split('-')[0];
        
        let question;
        switch(category) {
          case 'Openness':
            question = oceanData.OCEAN_Questions.Openness[questionIndex];
            break;
          case 'Conscientiousness':
            question = oceanData.OCEAN_Questions.Conscientiousness[questionIndex];
            break;
          case 'Extraversion':
            question = oceanData.OCEAN_Questions.Extraversion[questionIndex];
            break;
          case 'Agreeableness':
            question = oceanData.OCEAN_Questions.Agreeableness[questionIndex];
            break;
          case 'Neuroticism':
            question = oceanData.OCEAN_Questions.Neuroticism[questionIndex];
            break;
          default:
            return null;
        }
        
        return question?.options[optionIndex];
      }).filter(answer => answer !== null);

      const data = await apiRequest('/users/personality-score', {
        method: 'POST',
        body: JSON.stringify({
          answers: answersArray
        }),
      }) as {
        success: boolean;
        message?: string;
        data?: Record<string, unknown>;
      };

      if (data.success) {
        alert("Personality assessment completed successfully!");
      } else {
        throw new Error(data.message || 'Failed to submit assessment');
      }

      setAnswers({});
      setCurrentQuestionIndex(0);
      onClose();
    } catch (error) {
      console.error("Error submitting OCEAN assessment:", error);
      alert("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-xl mx-auto shadow-2xl border-0 bg-white max-h-[80vh] overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                OCEAN Personality Test
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Question {currentQuestionIndex + 1} of {allQuestions.length}
                {totalQuestionsAnswered > 0 && (
                  <span className="ml-2 text-primary">
                    ({totalQuestionsAnswered} answered)
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full bg-muted rounded-full h-1.5 mb-5">
            <div
              className="bg-gradient-to-r from-primary to-primary-600 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / allQuestions.length) * 100
                }%`,
              }}
            />
          </div>

          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                currentQuestion?.category === "Openness"
                  ? "bg-primary-50 text-primary-700"
                  : currentQuestion?.category === "Conscientiousness"
                  ? "bg-primary-100 text-primary-800"
                  : currentQuestion?.category === "Extraversion"
                  ? "bg-primary-200 text-primary-900"
                  : currentQuestion?.category === "Agreeableness"
                  ? "bg-primary-50 text-primary-600"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {currentQuestion?.category}
            </span>
          </div>

          <div className="mb-5">
            <h3 className="text-lg font-medium text-foreground leading-relaxed">
              {currentQuestion?.question}
            </h3>
          </div>

          <div className="space-y-2 mb-5 max-h-68 overflow-y-auto">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full p-3 text-left rounded-lg border transition-all duration-200 text-sm ${
                  currentAnswer === index
                    ? "border-primary bg-primary-50 text-primary-900 shadow-sm"
                    : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full border-2 mr-3 flex items-center justify-center ${
                      currentAnswer === index
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {currentAnswer === index && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-muted">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 text-muted-foreground border-muted hover:bg-muted"
              size="sm"
            >
              <ChevronLeft className="w-3 h-3" />
              Previous
            </Button>

            <div className="flex gap-2">
              {!isLastQuestion ? (
                <Button
                  onClick={handleNext}
                  disabled={currentAnswer === undefined}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
                  size="sm"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered || isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                      Submitting...
                    </>
                  ) : allQuestionsAnswered ? (
                    "Complete Test"
                  ) : (
                    `Answer all questions (${totalQuestionsAnswered}/${allQuestions.length})`
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OceanModel;
