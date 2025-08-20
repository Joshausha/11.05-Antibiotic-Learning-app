#!/usr/bin/env python3
"""
Difficulty Level Classifier for Existing Quiz Questions
Analyzes existing quiz questions and categorizes them by difficulty level
"""

import re
import json
from datetime import datetime
from typing import List, Dict, Any

class DifficultyClassifier:
    def __init__(self):
        # Keywords that indicate different difficulty levels
        self.beginner_keywords = [
            "common pathogen",
            "which of the following is",
            "what is the recommended",
            "standard treatment",
            "first-line",
            "empiric",
            "typical"
        ]
        
        self.intermediate_keywords = [
            "clinical consideration",
            "duration of therapy",
            "switch to oral",
            "culture results",
            "susceptibility testing",
            "resistance patterns",
            "moderate/severe"
        ]
        
        self.advanced_keywords = [
            "insufficient source control",
            "parenchymal brain infection",
            "cerebritis",
            "rhombencephalitis",
            "brain abscess",
            "inadequate débridement",
            "intracranial extension",
            "osteomyelitis",
            "antibiotic resistance",
            "retained vascular catheter",
            "complex infections"
        ]
        
        # Medical complexity indicators
        self.complex_conditions = [
            "meningitis",
            "mastoiditis",
            "osteomyelitis",
            "septic arthritis",
            "endocarditis",
            "retropharyngeal abscess",
            "orbital cellulitis",
            "bloodstream infection"
        ]
        
        self.basic_conditions = [
            "cellulitis",
            "pharyngitis",
            "otitis media",
            "sinusitis",
            "pneumonia",
            "uti"
        ]
    
    def analyze_question_complexity(self, question: str, explanation: str, category: str) -> str:
        """Analyze a question and return its difficulty level"""
        question_lower = question.lower()
        explanation_lower = explanation.lower()
        category_lower = category.lower()
        
        # Check for advanced keywords
        advanced_score = 0
        for keyword in self.advanced_keywords:
            if keyword in question_lower or keyword in explanation_lower:
                advanced_score += 2
        
        # Check for intermediate keywords
        intermediate_score = 0
        for keyword in self.intermediate_keywords:
            if keyword in question_lower or keyword in explanation_lower:
                intermediate_score += 1
        
        # Check for beginner keywords
        beginner_score = 0
        for keyword in self.beginner_keywords:
            if keyword in question_lower or keyword in explanation_lower:
                beginner_score += 1
        
        # Check condition complexity
        complex_condition_found = False
        basic_condition_found = False
        
        for condition in self.complex_conditions:
            if condition in question_lower or condition in explanation_lower:
                complex_condition_found = True
                break
        
        for condition in self.basic_conditions:
            if condition in question_lower or condition in explanation_lower:
                basic_condition_found = True
                break
        
        # Additional complexity indicators
        if "specific choice and duration" in explanation_lower:
            advanced_score += 2
        if "guided by culture" in explanation_lower:
            intermediate_score += 1
        if "empiric recommendations" in explanation_lower:
            beginner_score += 1
        if "depending on" in explanation_lower:
            intermediate_score += 1
        if "consider" in question_lower:
            intermediate_score += 1
        
        # Decision logic
        if advanced_score >= 2 or complex_condition_found:
            return "advanced"
        elif intermediate_score >= 2 or (intermediate_score >= 1 and not basic_condition_found):
            return "intermediate"
        elif beginner_score >= 1 or basic_condition_found:
            return "beginner"
        else:
            # Default based on category
            if category_lower in ["central nervous system", "bone/joint", "bloodstream infection"]:
                return "advanced"
            elif category_lower in ["skin and soft tissue", "respiratory", "genitourinary"]:
                return "intermediate"
            else:
                return "beginner"
    
    def classify_existing_questions(self, questions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Add difficulty levels to existing questions"""
        classified_questions = []
        
        difficulty_stats = {"beginner": 0, "intermediate": 0, "advanced": 0}
        
        for question in questions:
            # Create a copy of the question
            new_question = question.copy()
            
            # Determine difficulty
            difficulty = self.analyze_question_complexity(
                question.get("question", ""),
                question.get("explanation", ""),
                question.get("category", "")
            )
            
            # Add difficulty level
            new_question["difficulty"] = difficulty
            difficulty_stats[difficulty] += 1
            
            classified_questions.append(new_question)
        
        return classified_questions, difficulty_stats
    
    def load_existing_questions(self, filepath: str) -> List[Dict[str, Any]]:
        """Load existing questions from JavaScript file"""
        try:
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Extract the JavaScript array
            # Find the start of the array
            start_marker = "const quizQuestions = ["
            end_marker = "];"
            
            start_index = content.find(start_marker)
            if start_index == -1:
                raise ValueError("Could not find quiz questions array")
            
            start_index += len(start_marker) - 1  # Include the opening bracket
            end_index = content.rfind(end_marker)
            
            if end_index == -1:
                raise ValueError("Could not find end of quiz questions array")
            
            # Extract the JSON array
            json_content = content[start_index:end_index + 1]
            
            # Parse the JSON
            questions = json.loads(json_content)
            
            return questions
            
        except Exception as e:
            print(f"Error loading questions: {e}")
            return []
    
    def save_classified_questions(self, questions: List[Dict[str, Any]], output_file: str):
        """Save classified questions to a JavaScript file"""
        timestamp = datetime.now().isoformat()
        
        js_content = f"""/**
 * Quiz Questions Data with Difficulty Levels
 * Contains clinical questions for testing knowledge of infectious diseases and antimicrobial therapy
 * Each question includes options, correct answer index, detailed explanation, and difficulty level
 * 
 * Enhanced with difficulty classification
 * Total questions: {len(questions)}
 * Classification completed: {timestamp}
 */

const quizQuestionsWithDifficulty = {json.dumps(questions, indent=2)};

export default quizQuestionsWithDifficulty;
"""
        
        with open(output_file, 'w') as f:
            f.write(js_content)
        
        print(f"Classified {len(questions)} questions and saved to {output_file}")
        return output_file

def main():
    """Main function to classify existing questions"""
    classifier = DifficultyClassifier()
    
    # Load existing questions
    existing_questions_file = "src/data/quizQuestions.js"
    questions = classifier.load_existing_questions(existing_questions_file)
    
    if not questions:
        print("No questions found. Please check the file path.")
        return
    
    print(f"Loaded {len(questions)} existing questions")
    
    # Classify questions
    classified_questions, difficulty_stats = classifier.classify_existing_questions(questions)
    
    # Save classified questions
    output_file = "src/data/quizQuestionsWithDifficulty.js"
    classifier.save_classified_questions(classified_questions, output_file)
    
    # Print summary
    print("\n=== Difficulty Classification Summary ===")
    print(f"Total questions classified: {len(classified_questions)}")
    print("\nDifficulty distribution:")
    for difficulty, count in difficulty_stats.items():
        percentage = (count / len(classified_questions)) * 100
        print(f"  {difficulty.capitalize()}: {count} questions ({percentage:.1f}%)")
    
    print(f"\nOutput file: {output_file}")
    print("Questions ready for difficulty-based filtering!")

if __name__ == "__main__":
    main()