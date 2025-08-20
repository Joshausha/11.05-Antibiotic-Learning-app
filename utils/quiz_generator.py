#!/usr/bin/env python3
"""
Antibiotic Learning App - Quiz Question Generator
Generates new quiz questions based on existing medical data patterns
"""

import json
import random
from datetime import datetime
from typing import List, Dict, Any
import os

class QuizQuestionGenerator:
    def __init__(self):
        self.antibiotic_data = {
            "Penicillin": {
                "category": "Beta-lactam",
                "class": "Penicillin",
                "mechanism": "Cell wall synthesis inhibition",
                "route": "IV/PO",
                "common_uses": ["Strep throat", "Pneumococcal infections"],
                "resistance": "Beta-lactamase producing bacteria",
                "side_effects": ["Allergic reactions", "GI upset"]
            },
            "Vancomycin": {
                "category": "Glycopeptide",
                "class": "Glycopeptide",
                "mechanism": "Cell wall synthesis inhibition",
                "route": "IV",
                "common_uses": ["MRSA infections", "C. diff colitis"],
                "resistance": "VRE (vancomycin-resistant enterococci)",
                "side_effects": ["Kidney toxicity", "Red man syndrome"]
            },
            "Ciprofloxacin": {
                "category": "Fluoroquinolone",
                "class": "Quinolone",
                "mechanism": "DNA synthesis inhibition",
                "route": "IV/PO",
                "common_uses": ["UTI", "Pseudomonas infections"],
                "resistance": "Chromosomal mutations",
                "side_effects": ["Tendon rupture", "CNS effects"]
            },
            "Ceftriaxone": {
                "category": "Beta-lactam",
                "class": "3rd generation cephalosporin",
                "mechanism": "Cell wall synthesis inhibition",
                "route": "IV/IM",
                "common_uses": ["Meningitis", "Pneumonia", "Sepsis"],
                "resistance": "ESBL producers",
                "side_effects": ["Biliary sludging", "Diarrhea"]
            },
            "Azithromycin": {
                "category": "Macrolide",
                "class": "Macrolide",
                "mechanism": "Protein synthesis inhibition (50S ribosome)",
                "route": "PO/IV",
                "common_uses": ["Atypical pneumonia", "Chlamydia", "Pertussis"],
                "resistance": "Ribosomal mutations",
                "side_effects": ["QT prolongation", "GI upset"]
            },
            "Clindamycin": {
                "category": "Lincosamide",
                "class": "Lincosamide",
                "mechanism": "Protein synthesis inhibition (50S ribosome)",
                "route": "PO/IV",
                "common_uses": ["Anaerobic infections", "Skin infections"],
                "resistance": "Inducible resistance",
                "side_effects": ["C. diff colitis", "Diarrhea"]
            },
            "Gentamicin": {
                "category": "Aminoglycoside",
                "class": "Aminoglycoside",
                "mechanism": "Protein synthesis inhibition (30S ribosome)",
                "route": "IV/IM",
                "common_uses": ["Gram-negative infections", "Synergy with beta-lactams"],
                "resistance": "Enzymatic inactivation",
                "side_effects": ["Nephrotoxicity", "Ototoxicity"]
            },
            "Meropenem": {
                "category": "Beta-lactam",
                "class": "Carbapenem",
                "mechanism": "Cell wall synthesis inhibition",
                "route": "IV",
                "common_uses": ["ESBL producers", "Severe infections"],
                "resistance": "Carbapenemases",
                "side_effects": ["Seizures", "Diarrhea"]
            }
        }
        
        self.pathogen_data = {
            "Staphylococcus aureus": {
                "gram_stain": "Positive",
                "shape": "Cocci",
                "arrangement": "Clusters",
                "common_sites": ["Skin", "Soft tissue", "Bloodstream"],
                "resistance_patterns": ["MRSA", "Beta-lactamase production"],
                "virulence_factors": ["Toxins", "Biofilm formation"]
            },
            "Escherichia coli": {
                "gram_stain": "Negative",
                "shape": "Rod",
                "arrangement": "Single",
                "common_sites": ["Urinary tract", "Bloodstream", "Intra-abdominal"],
                "resistance_patterns": ["ESBL", "Carbapenemase"],
                "virulence_factors": ["Adhesins", "Toxins"]
            },
            "Streptococcus pneumoniae": {
                "gram_stain": "Positive",
                "shape": "Cocci",
                "arrangement": "Pairs/chains",
                "common_sites": ["Respiratory tract", "Meninges", "Bloodstream"],
                "resistance_patterns": ["Penicillin resistance", "Macrolide resistance"],
                "virulence_factors": ["Capsule", "Pneumolysin"]
            },
            "Pseudomonas aeruginosa": {
                "gram_stain": "Negative",
                "shape": "Rod",
                "arrangement": "Single",
                "common_sites": ["Respiratory tract", "Urinary tract", "Wounds"],
                "resistance_patterns": ["Intrinsic resistance", "Efflux pumps"],
                "virulence_factors": ["Biofilm", "Exotoxins"]
            }
        }
        
        self.clinical_scenarios = {
            "UTI": {
                "symptoms": ["Dysuria", "Frequency", "Urgency", "Suprapubic pain"],
                "diagnostics": ["Urinalysis", "Urine culture", "Nitrites", "Leukocyte esterase"],
                "complications": ["Pyelonephritis", "Sepsis", "Renal abscess"],
                "risk_factors": ["Female sex", "Sexual activity", "Catheter use"]
            },
            "Pneumonia": {
                "symptoms": ["Fever", "Cough", "Dyspnea", "Chest pain"],
                "diagnostics": ["Chest X-ray", "CBC", "Blood cultures", "Sputum culture"],
                "complications": ["Respiratory failure", "Sepsis", "Pleural effusion"],
                "risk_factors": ["Age", "Immunocompromise", "Chronic lung disease"]
            },
            "Meningitis": {
                "symptoms": ["Fever", "Headache", "Neck stiffness", "Altered mental status"],
                "diagnostics": ["Lumbar puncture", "CSF analysis", "Blood cultures", "CT head"],
                "complications": ["Brain abscess", "Seizures", "Hearing loss"],
                "risk_factors": ["Age extremes", "Immunocompromise", "CSF leak"]
            },
            "Sepsis": {
                "symptoms": ["Fever", "Tachycardia", "Hypotension", "Altered mental status"],
                "diagnostics": ["Blood cultures", "Lactate", "Procalcitonin", "Imaging"],
                "complications": ["Shock", "Multi-organ failure", "Death"],
                "risk_factors": ["Immunocompromise", "Chronic illness", "Invasive procedures"]
            }
        }
        
        self.question_templates = [
            {
                "type": "pathogen_identification",
                "template": "A {age}-year-old {gender} presents with {symptoms}. Gram stain shows {gram_stain} {shape} in {arrangement}. What is the most likely pathogen?",
                "difficulty": "beginner"
            },
            {
                "type": "antibiotic_mechanism",
                "template": "Which antibiotic works by {mechanism}?",
                "difficulty": "intermediate"
            },
            {
                "type": "resistance_pattern",
                "template": "A patient with {infection} has an isolate resistant to {antibiotic}. What is the most likely resistance mechanism?",
                "difficulty": "advanced"
            },
            {
                "type": "clinical_scenario",
                "template": "A {age}-year-old {gender} with {risk_factors} presents with {symptoms}. What is the most appropriate empiric antibiotic therapy?",
                "difficulty": "intermediate"
            },
            {
                "type": "side_effects",
                "template": "A patient receiving {antibiotic} develops {side_effect}. What should be the next step in management?",
                "difficulty": "intermediate"
            }
        ]
    
    def generate_pathogen_identification_question(self) -> Dict[str, Any]:
        """Generate a question about pathogen identification"""
        pathogen_name = random.choice(list(self.pathogen_data.keys()))
        pathogen = self.pathogen_data[pathogen_name]
        
        age = random.randint(20, 80)
        gender = random.choice(["male", "female"])
        symptoms = random.choice([
            "fever and chills",
            "cough and dyspnea",
            "dysuria and frequency",
            "headache and neck stiffness"
        ])
        
        question = f"A {age}-year-old {gender} presents with {symptoms}. Gram stain shows {pathogen['gram_stain']} {pathogen['shape']} in {pathogen['arrangement']}. What is the most likely pathogen?"
        
        # Create options with correct answer and distractors
        options = [pathogen_name]
        other_pathogens = [p for p in self.pathogen_data.keys() if p != pathogen_name]
        options.extend(random.sample(other_pathogens, 3))
        random.shuffle(options)
        
        correct_index = options.index(pathogen_name)
        
        return {
            "question": question,
            "options": options,
            "correct": correct_index,
            "explanation": f"{pathogen_name} is a {pathogen['gram_stain']} {pathogen['shape']} that commonly causes infections at {', '.join(pathogen['common_sites'])}.",
            "category": "Pathogen Identification",
            "difficulty": "beginner",
            "conditionId": "pathogen_identification"
        }
    
    def generate_antibiotic_mechanism_question(self) -> Dict[str, Any]:
        """Generate a question about antibiotic mechanisms"""
        antibiotic_name = random.choice(list(self.antibiotic_data.keys()))
        antibiotic = self.antibiotic_data[antibiotic_name]
        
        question = f"Which antibiotic works by {antibiotic['mechanism']}?"
        
        # Create options with correct answer and distractors
        options = [antibiotic_name]
        other_antibiotics = [a for a in self.antibiotic_data.keys() if a != antibiotic_name]
        options.extend(random.sample(other_antibiotics, 3))
        random.shuffle(options)
        
        correct_index = options.index(antibiotic_name)
        
        return {
            "question": question,
            "options": options,
            "correct": correct_index,
            "explanation": f"{antibiotic_name} is a {antibiotic['class']} that works by {antibiotic['mechanism']}. It is commonly used for {', '.join(antibiotic['common_uses'])}.",
            "category": "Antibiotic Mechanisms",
            "difficulty": "intermediate",
            "conditionId": "antibiotic_mechanism"
        }
    
    def generate_resistance_question(self) -> Dict[str, Any]:
        """Generate a question about antibiotic resistance"""
        antibiotic_name = random.choice(list(self.antibiotic_data.keys()))
        antibiotic = self.antibiotic_data[antibiotic_name]
        
        infection_type = random.choice(["pneumonia", "urinary tract infection", "skin infection", "bloodstream infection"])
        
        question = f"A patient with {infection_type} has an isolate resistant to {antibiotic_name}. What is the most likely resistance mechanism?"
        
        # Create options with correct answer and distractors
        correct_mechanism = antibiotic["resistance"]
        options = [
            correct_mechanism,
            "Efflux pumps",
            "Target modification",
            "Enzymatic inactivation"
        ]
        # Remove duplicates and ensure we have 4 unique options
        options = list(set(options))
        if len(options) < 4:
            additional_options = ["Reduced permeability", "Biofilm formation", "Metabolic bypass"]
            options.extend([opt for opt in additional_options if opt not in options])
        options = options[:4]
        random.shuffle(options)
        
        correct_index = options.index(correct_mechanism)
        
        return {
            "question": question,
            "options": options,
            "correct": correct_index,
            "explanation": f"Resistance to {antibiotic_name} commonly occurs through {correct_mechanism}. This is an important consideration when selecting alternative therapy.",
            "category": "Antibiotic Resistance",
            "difficulty": "advanced",
            "conditionId": "antibiotic_resistance"
        }
    
    def generate_clinical_scenario_question(self) -> Dict[str, Any]:
        """Generate a clinical scenario question"""
        scenario_type = random.choice(list(self.clinical_scenarios.keys()))
        scenario = self.clinical_scenarios[scenario_type]
        
        age = random.randint(25, 75)
        gender = random.choice(["male", "female"])
        risk_factor = random.choice(scenario["risk_factors"])
        symptoms = random.choice(scenario["symptoms"])
        
        question = f"A {age}-year-old {gender} with {risk_factor} presents with {symptoms}. What is the most appropriate empiric antibiotic therapy?"
        
        # Select appropriate antibiotics based on scenario
        if scenario_type == "UTI":
            correct_antibiotic = "Ciprofloxacin"
            options = ["Ciprofloxacin", "Vancomycin", "Azithromycin", "Clindamycin"]
        elif scenario_type == "Pneumonia":
            correct_antibiotic = "Ceftriaxone"
            options = ["Ceftriaxone", "Gentamicin", "Clindamycin", "Ciprofloxacin"]
        elif scenario_type == "Meningitis":
            correct_antibiotic = "Ceftriaxone"
            options = ["Ceftriaxone", "Azithromycin", "Clindamycin", "Ciprofloxacin"]
        else:  # Sepsis
            correct_antibiotic = "Meropenem"
            options = ["Meropenem", "Azithromycin", "Clindamycin", "Penicillin"]
        
        random.shuffle(options)
        correct_index = options.index(correct_antibiotic)
        
        return {
            "question": question,
            "options": options,
            "correct": correct_index,
            "explanation": f"For {scenario_type}, {correct_antibiotic} is the appropriate empiric choice as it covers the most likely pathogens and has good tissue penetration.",
            "category": "Clinical Scenarios",
            "difficulty": "intermediate",
            "conditionId": f"clinical_{scenario_type.lower()}"
        }
    
    def generate_side_effects_question(self) -> Dict[str, Any]:
        """Generate a question about antibiotic side effects"""
        antibiotic_name = random.choice(list(self.antibiotic_data.keys()))
        antibiotic = self.antibiotic_data[antibiotic_name]
        
        side_effect = random.choice(antibiotic["side_effects"])
        
        question = f"A patient receiving {antibiotic_name} develops {side_effect}. What should be the next step in management?"
        
        # Create management options
        if "toxicity" in side_effect.lower():
            correct_action = "Discontinue the antibiotic and monitor levels"
            options = [
                "Discontinue the antibiotic and monitor levels",
                "Reduce the dose by half",
                "Continue at same dose",
                "Increase monitoring frequency only"
            ]
        elif "allergic" in side_effect.lower():
            correct_action = "Discontinue immediately and consider alternative"
            options = [
                "Discontinue immediately and consider alternative",
                "Reduce the dose",
                "Add an antihistamine",
                "Continue with close monitoring"
            ]
        else:
            correct_action = "Assess severity and consider alternative if severe"
            options = [
                "Assess severity and consider alternative if severe",
                "Continue current therapy",
                "Increase the dose",
                "Add supportive therapy only"
            ]
        
        random.shuffle(options)
        correct_index = options.index(correct_action)
        
        return {
            "question": question,
            "options": options,
            "correct": correct_index,
            "explanation": f"{side_effect} is a known side effect of {antibiotic_name}. Proper management includes assessing severity and considering alternative therapy if needed.",
            "category": "Side Effects",
            "difficulty": "intermediate",
            "conditionId": "side_effects"
        }
    
    def generate_questions(self, num_questions: int = 25) -> List[Dict[str, Any]]:
        """Generate a specified number of quiz questions"""
        questions = []
        question_types = [
            self.generate_pathogen_identification_question,
            self.generate_antibiotic_mechanism_question,
            self.generate_resistance_question,
            self.generate_clinical_scenario_question,
            self.generate_side_effects_question
        ]
        
        for i in range(num_questions):
            question_generator = random.choice(question_types)
            question = question_generator()
            questions.append(question)
        
        return questions
    
    def save_questions_to_file(self, questions: List[Dict[str, Any]], filename: str = "new_quiz_questions.js"):
        """Save questions to a JavaScript file in the same format as existing data"""
        timestamp = datetime.now().isoformat()
        
        js_content = f"""/**
 * Additional Quiz Questions Data
 * Generated clinical questions for testing knowledge of infectious diseases and antimicrobial therapy
 * Each question includes options, correct answer index, and detailed explanation
 * 
 * Generated automatically by quiz_generator.py
 * Total questions: {len(questions)}
 * Generated on: {timestamp}
 */

const additionalQuizQuestions = {json.dumps(questions, indent=2)};

export default additionalQuizQuestions;
"""
        
        with open(filename, 'w') as f:
            f.write(js_content)
        
        print(f"Generated {len(questions)} questions and saved to {filename}")
        return filename

def main():
    """Main function to generate quiz questions"""
    generator = QuizQuestionGenerator()
    
    # Generate 25 new questions
    new_questions = generator.generate_questions(25)
    
    # Save to file
    output_file = generator.save_questions_to_file(new_questions)
    
    # Print summary
    print("\n=== Quiz Generation Summary ===")
    print(f"Total questions generated: {len(new_questions)}")
    
    # Count by category
    categories = {}
    difficulties = {}
    
    for question in new_questions:
        category = question.get('category', 'Unknown')
        difficulty = question.get('difficulty', 'Unknown')
        
        categories[category] = categories.get(category, 0) + 1
        difficulties[difficulty] = difficulties.get(difficulty, 0) + 1
    
    print("\nQuestions by category:")
    for category, count in categories.items():
        print(f"  {category}: {count}")
    
    print("\nQuestions by difficulty:")
    for difficulty, count in difficulties.items():
        print(f"  {difficulty}: {count}")
    
    print(f"\nOutput file: {output_file}")
    print("Questions ready for integration into the React app!")

if __name__ == "__main__":
    main()