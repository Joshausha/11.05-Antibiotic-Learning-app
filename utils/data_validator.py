#!/usr/bin/env python3
"""
Data Validation and Enhancement Script
Validates and enhances existing medical data for completeness and accuracy
"""

import json
import re
from datetime import datetime
from typing import List, Dict, Any, Tuple

class DataValidator:
    def __init__(self):
        # Required fields for different data types
        self.required_fields = {
            "quiz_question": ["question", "options", "correct", "explanation", "category"],
            "antibiotic": ["name", "category", "class", "mechanism", "route"],
            "pathogen": ["name", "gram_stain", "shape", "common_sites"]
        }
        
        # Data quality checks
        self.validation_rules = {
            "question_length": (50, 500),  # Characters
            "explanation_length": (100, 1000),  # Characters
            "options_count": (3, 5),  # Number of options
            "category_standardization": [
                "Genitourinary", "Respiratory", "Central Nervous System",
                "Skin and Soft Tissue Infections", "Bone/Joint",
                "Ear, Nose, and Throat", "Ophthalmologic",
                "Bloodstream Infection in Nonneonates",
                "Neonatal Fever (Term Neonates)", "Intra-abdominal"
            ]
        }
        
        # Common medical terminology standardization
        self.standardization_map = {
            "antibiotics": {
                "TMP-SMX": "Trimethoprim-sulfamethoxazole",
                "TMP/SMX": "Trimethoprim-sulfamethoxazole",
                "Bactrim": "Trimethoprim-sulfamethoxazole",
                "Zosyn": "Piperacillin-tazobactam",
                "Pip-tazo": "Piperacillin-tazobactam",
                "Vanc": "Vancomycin",
                "Zyvox": "Linezolid",
                "Cipro": "Ciprofloxacin",
                "Levo": "Levofloxacin",
                "Rocephin": "Ceftriaxone",
                "Ancef": "Cefazolin"
            },
            "pathogens": {
                "S aureus": "Staphylococcus aureus",
                "S pyogenes": "Streptococcus pyogenes",
                "S pneumoniae": "Streptococcus pneumoniae",
                "E coli": "Escherichia coli",
                "K pneumoniae": "Klebsiella pneumoniae",
                "P aeruginosa": "Pseudomonas aeruginosa",
                "GBS": "Group B Streptococcus",
                "GAS": "Group A Streptococcus"
            },
            "medical_terms": {
                "UTI": "urinary tract infection",
                "CAP": "community-acquired pneumonia",
                "VAP": "ventilator-associated pneumonia",
                "SSTI": "skin and soft tissue infection",
                "CNS": "central nervous system",
                "CSF": "cerebrospinal fluid",
                "IV": "intravenous",
                "PO": "oral",
                "IM": "intramuscular",
                "q8h": "every 8 hours",
                "q12h": "every 12 hours",
                "q24h": "every 24 hours",
                "BID": "twice daily",
                "TID": "three times daily",
                "QID": "four times daily"
            }
        }
        
        # Medical data completeness checks
        self.completeness_checks = {
            "antibiotic_spectrum": ["gram_positive", "gram_negative", "anaerobic", "atypical"],
            "resistance_mechanisms": ["beta_lactamase", "efflux_pumps", "target_modification", "permeability"],
            "side_effects": ["common", "serious", "rare"],
            "monitoring_parameters": ["levels", "toxicity", "efficacy"]
        }
    
    def validate_quiz_questions(self, questions: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[str]]:
        """Validate quiz questions for completeness and quality"""
        validated_questions = []
        issues = []
        
        for i, question in enumerate(questions):
            question_issues = []
            enhanced_question = question.copy()
            
            # Check required fields
            for field in self.required_fields["quiz_question"]:
                if field not in question or not question[field]:
                    question_issues.append(f"Question {i+1}: Missing or empty field '{field}'")
            
            # Validate question length
            if "question" in question:
                q_len = len(question["question"])
                min_len, max_len = self.validation_rules["question_length"]
                if q_len < min_len or q_len > max_len:
                    question_issues.append(f"Question {i+1}: Question length {q_len} outside range {min_len}-{max_len}")
            
            # Validate explanation length
            if "explanation" in question:
                exp_len = len(question["explanation"])
                min_len, max_len = self.validation_rules["explanation_length"]
                if exp_len < min_len or exp_len > max_len:
                    question_issues.append(f"Question {i+1}: Explanation length {exp_len} outside range {min_len}-{max_len}")
            
            # Validate options count
            if "options" in question:
                opt_count = len(question["options"])
                min_count, max_count = self.validation_rules["options_count"]
                if opt_count < min_count or opt_count > max_count:
                    question_issues.append(f"Question {i+1}: Options count {opt_count} outside range {min_count}-{max_count}")
            
            # Validate correct answer index
            if "correct" in question and "options" in question:
                if question["correct"] >= len(question["options"]):
                    question_issues.append(f"Question {i+1}: Correct answer index {question['correct']} out of range")
            
            # Standardize category
            if "category" in question:
                original_category = question["category"]
                standardized_category = self.standardize_category(original_category)
                if standardized_category != original_category:
                    enhanced_question["category"] = standardized_category
                    question_issues.append(f"Question {i+1}: Category standardized from '{original_category}' to '{standardized_category}'")
            
            # Enhance question with medical terminology standardization
            enhanced_question = self.standardize_medical_terminology(enhanced_question)
            
            # Add missing fields if possible
            if "difficulty" not in enhanced_question:
                enhanced_question["difficulty"] = self.infer_difficulty(enhanced_question)
            
            if "conditionId" not in enhanced_question:
                enhanced_question["conditionId"] = self.generate_condition_id(enhanced_question)
            
            validated_questions.append(enhanced_question)
            issues.extend(question_issues)
        
        return validated_questions, issues
    
    def standardize_category(self, category: str) -> str:
        """Standardize category names"""
        # Simple mapping for common variations
        category_map = {
            "Genitourinary": "Genitourinary",
            "GU": "Genitourinary",
            "Respiratory": "Respiratory",
            "Resp": "Respiratory",
            "CNS": "Central Nervous System",
            "Central Nervous System": "Central Nervous System",
            "Skin": "Skin and Soft Tissue Infections",
            "Skin and Soft Tissue": "Skin and Soft Tissue Infections",
            "Skin and Soft Tissue Infections": "Skin and Soft Tissue Infections",
            "Bone": "Bone/Joint",
            "Joint": "Bone/Joint",
            "Bone/Joint": "Bone/Joint",
            "ENT": "Ear, Nose, and Throat",
            "Ear, Nose, and Throat": "Ear, Nose, and Throat",
            "Eye": "Ophthalmologic",
            "Ophthalmologic": "Ophthalmologic",
            "Bloodstream": "Bloodstream Infection in Nonneonates",
            "Bloodstream Infection in Nonneonates": "Bloodstream Infection in Nonneonates",
            "Neonatal": "Neonatal Fever (Term Neonates)",
            "Neonatal Fever (Term Neonates)": "Neonatal Fever (Term Neonates)",
            "Intra-abdominal": "Intra-abdominal",
            "Abdominal": "Intra-abdominal"
        }
        
        return category_map.get(category, category)
    
    def standardize_medical_terminology(self, question: Dict[str, Any]) -> Dict[str, Any]:
        """Standardize medical terminology in question text"""
        enhanced_question = question.copy()
        
        # Standardize in question text
        if "question" in enhanced_question:
            text = enhanced_question["question"]
            for category, terms in self.standardization_map.items():
                for abbrev, full_term in terms.items():
                    # Case-insensitive replacement
                    text = re.sub(rf'\b{re.escape(abbrev)}\b', full_term, text, flags=re.IGNORECASE)
            enhanced_question["question"] = text
        
        # Standardize in explanation
        if "explanation" in enhanced_question:
            text = enhanced_question["explanation"]
            for category, terms in self.standardization_map.items():
                for abbrev, full_term in terms.items():
                    text = re.sub(rf'\b{re.escape(abbrev)}\b', full_term, text, flags=re.IGNORECASE)
            enhanced_question["explanation"] = text
        
        # Standardize in options
        if "options" in enhanced_question:
            standardized_options = []
            for option in enhanced_question["options"]:
                text = option
                for category, terms in self.standardization_map.items():
                    for abbrev, full_term in terms.items():
                        text = re.sub(rf'\b{re.escape(abbrev)}\b', full_term, text, flags=re.IGNORECASE)
                standardized_options.append(text)
            enhanced_question["options"] = standardized_options
        
        return enhanced_question
    
    def infer_difficulty(self, question: Dict[str, Any]) -> str:
        """Infer difficulty level from question content"""
        question_text = question.get("question", "").lower()
        explanation = question.get("explanation", "").lower()
        
        # Advanced indicators
        advanced_keywords = [
            "resistance", "mechanism", "complicated", "multiple", "failure",
            "inadequate", "insufficient", "complex", "parenchymal", "cerebritis"
        ]
        
        # Intermediate indicators
        intermediate_keywords = [
            "clinical", "consideration", "duration", "culture", "susceptibility",
            "switch", "transition", "monitoring", "guided"
        ]
        
        # Beginner indicators
        beginner_keywords = [
            "common", "typical", "standard", "first-line", "empiric",
            "recommended", "what is", "which of"
        ]
        
        # Count keyword occurrences
        advanced_count = sum(1 for kw in advanced_keywords if kw in question_text or kw in explanation)
        intermediate_count = sum(1 for kw in intermediate_keywords if kw in question_text or kw in explanation)
        beginner_count = sum(1 for kw in beginner_keywords if kw in question_text or kw in explanation)
        
        if advanced_count >= 2:
            return "advanced"
        elif intermediate_count >= 2:
            return "intermediate"
        elif beginner_count >= 1:
            return "beginner"
        else:
            return "intermediate"  # Default
    
    def generate_condition_id(self, question: Dict[str, Any]) -> str:
        """Generate a condition ID from question content"""
        category = question.get("category", "general")
        
        # Extract key terms from question
        question_text = question.get("question", "")
        
        # Common condition patterns
        condition_patterns = {
            "pneumonia": "pneumonia",
            "meningitis": "meningitis",
            "cellulitis": "cellulitis",
            "sepsis": "sepsis",
            "UTI": "uti",
            "urinary": "uti",
            "osteomyelitis": "osteomyelitis",
            "arthritis": "septic_arthritis",
            "otitis": "otitis",
            "sinusitis": "sinusitis",
            "pharyngitis": "pharyngitis",
            "abscess": "abscess",
            "bloodstream": "bloodstream_infection"
        }
        
        for pattern, condition_id in condition_patterns.items():
            if pattern.lower() in question_text.lower():
                return condition_id
        
        # Default based on category
        category_map = {
            "Respiratory": "respiratory_infection",
            "Genitourinary": "genitourinary_infection",
            "Central Nervous System": "cns_infection",
            "Skin and Soft Tissue Infections": "skin_infection",
            "Bone/Joint": "bone_joint_infection",
            "Ear, Nose, and Throat": "ent_infection",
            "Ophthalmologic": "eye_infection",
            "Bloodstream Infection in Nonneonates": "bloodstream_infection",
            "Neonatal Fever (Term Neonates)": "neonatal_fever",
            "Intra-abdominal": "intra_abdominal_infection"
        }
        
        return category_map.get(category, "general_infection")
    
    def check_data_completeness(self, data: Dict[str, Any]) -> List[str]:
        """Check data completeness and suggest enhancements"""
        issues = []
        
        # Check for missing antibiotic data
        if "antibiotics" in data:
            for antibiotic in data["antibiotics"]:
                if "spectrum" not in antibiotic:
                    issues.append(f"Antibiotic {antibiotic.get('name', 'unknown')}: Missing spectrum information")
                if "resistance_mechanisms" not in antibiotic:
                    issues.append(f"Antibiotic {antibiotic.get('name', 'unknown')}: Missing resistance mechanisms")
        
        # Check for missing pathogen data
        if "pathogens" in data:
            for pathogen in data["pathogens"]:
                if "virulence_factors" not in pathogen:
                    issues.append(f"Pathogen {pathogen.get('name', 'unknown')}: Missing virulence factors")
                if "resistance_patterns" not in pathogen:
                    issues.append(f"Pathogen {pathogen.get('name', 'unknown')}: Missing resistance patterns")
        
        return issues
    
    def generate_validation_report(self, questions: List[Dict[str, Any]], issues: List[str]) -> str:
        """Generate a comprehensive validation report"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        report = f"""
=== DATA VALIDATION REPORT ===
Generated on: {timestamp}
Total questions analyzed: {len(questions)}
Total issues found: {len(issues)}

=== SUMMARY STATISTICS ===
"""
        
        # Calculate statistics
        categories = {}
        difficulties = {}
        
        for question in questions:
            category = question.get("category", "Unknown")
            difficulty = question.get("difficulty", "Unknown")
            
            categories[category] = categories.get(category, 0) + 1
            difficulties[difficulty] = difficulties.get(difficulty, 0) + 1
        
        report += "\nQuestions by category:\n"
        for category, count in sorted(categories.items()):
            percentage = (count / len(questions)) * 100
            report += f"  {category}: {count} ({percentage:.1f}%)\n"
        
        report += "\nQuestions by difficulty:\n"
        for difficulty, count in sorted(difficulties.items()):
            percentage = (count / len(questions)) * 100
            report += f"  {difficulty}: {count} ({percentage:.1f}%)\n"
        
        report += "\n=== IDENTIFIED ISSUES ===\n"
        if issues:
            for issue in issues:
                report += f"  • {issue}\n"
        else:
            report += "  No issues found!\n"
        
        report += "\n=== RECOMMENDATIONS ===\n"
        report += "  • Review and fix any identified issues\n"
        report += "  • Consider adding more questions for underrepresented categories\n"
        report += "  • Ensure balanced difficulty distribution\n"
        report += "  • Validate medical accuracy with clinical experts\n"
        
        return report
    
    def save_validated_data(self, questions: List[Dict[str, Any]], filename: str = "validated_questions.js"):
        """Save validated questions to JavaScript file"""
        timestamp = datetime.now().isoformat()
        
        js_content = f"""/**
 * Validated and Enhanced Quiz Questions
 * Medical data validated for completeness and accuracy
 * Terminology standardized and missing fields added
 * 
 * Validated automatically by data_validator.py
 * Total questions: {len(questions)}
 * Validation completed: {timestamp}
 */

const validatedQuizQuestions = {json.dumps(questions, indent=2)};

export default validatedQuizQuestions;
"""
        
        with open(filename, 'w') as f:
            f.write(js_content)
        
        print(f"Validated {len(questions)} questions and saved to {filename}")
        return filename

def main():
    """Main validation function"""
    validator = DataValidator()
    
    # Load existing questions
    try:
        with open("src/data/quizQuestions.js", 'r') as f:
            content = f.read()
        
        # Extract questions array
        start_marker = "const quizQuestions = ["
        end_marker = "];"
        start_index = content.find(start_marker) + len(start_marker) - 1
        end_index = content.rfind(end_marker) + 1
        
        questions_json = content[start_index:end_index]
        questions = json.loads(questions_json)
        
        print(f"Loaded {len(questions)} questions for validation")
        
    except Exception as e:
        print(f"Error loading questions: {e}")
        return
    
    # Validate questions
    validated_questions, issues = validator.validate_quiz_questions(questions)
    
    # Generate report
    report = validator.generate_validation_report(validated_questions, issues)
    
    # Save report
    with open("validation_report.txt", 'w') as f:
        f.write(report)
    
    # Save validated questions
    output_file = validator.save_validated_data(validated_questions)
    
    # Print summary
    print("\n=== VALIDATION SUMMARY ===")
    print(f"Questions processed: {len(validated_questions)}")
    print(f"Issues found: {len(issues)}")
    print(f"Validation report: validation_report.txt")
    print(f"Validated questions: {output_file}")
    
    if issues:
        print("\nTop 5 issues found:")
        for issue in issues[:5]:
            print(f"  • {issue}")

if __name__ == "__main__":
    main()