#!/usr/bin/env python3
"""
Content Quality Testing Script
Tests and validates generated quiz content for medical accuracy and quality
"""

import json
import re
from datetime import datetime
from typing import List, Dict, Any, Tuple
import sys

class ContentTester:
    def __init__(self):
        # Medical accuracy checks
        self.medical_checks = {
            "antibiotic_names": [
                "penicillin", "amoxicillin", "ampicillin", "cephalexin", "ceftriaxone",
                "cefazolin", "vancomycin", "linezolid", "daptomycin", "clindamycin",
                "azithromycin", "erythromycin", "ciprofloxacin", "levofloxacin",
                "trimethoprim-sulfamethoxazole", "gentamicin", "amikacin", "tobramycin",
                "meropenem", "imipenem", "ertapenem", "piperacillin-tazobactam",
                "ceftazidime", "cefepime", "tigecycline", "colistin", "doxycycline",
                "minocycline", "rifampin", "isoniazid", "ethambutol", "pyrazinamide"
            ],
            "pathogen_names": [
                "staphylococcus aureus", "streptococcus pneumoniae", "streptococcus pyogenes",
                "enterococcus", "escherichia coli", "klebsiella pneumoniae", "pseudomonas aeruginosa",
                "acinetobacter", "haemophilus influenzae", "moraxella catarrhalis",
                "neisseria meningitidis", "neisseria gonorrhoeae", "listeria monocytogenes",
                "clostridium difficile", "bacteroides", "prevotella", "fusobacterium",
                "mycobacterium tuberculosis", "chlamydia", "mycoplasma", "legionella"
            ],
            "resistance_mechanisms": [
                "beta-lactamase", "esbl", "carbapenemase", "efflux pump", "target modification",
                "ribosomal mutation", "cell wall alteration", "enzymatic inactivation",
                "reduced permeability", "biofilm formation", "vancomycin resistance"
            ],
            "clinical_terms": [
                "meningitis", "pneumonia", "cellulitis", "sepsis", "osteomyelitis",
                "endocarditis", "pyelonephritis", "cystitis", "sinusitis", "otitis media",
                "pharyngitis", "abscess", "bacteremia", "septic arthritis", "peritonitis"
            ]
        }
        
        # Quality standards
        self.quality_standards = {
            "question_clarity": {
                "avoid_ambiguous": ["maybe", "possibly", "sometimes", "often"],
                "require_specific": ["what is", "which", "most appropriate", "next step"]
            },
            "medical_accuracy": {
                "drug_dosing": ["mg/kg", "g/day", "units", "every", "hours"],
                "duration": ["days", "weeks", "months", "until", "completion"],
                "monitoring": ["levels", "function", "toxicity", "efficacy"]
            },
            "answer_construction": {
                "avoid_absolutes": ["never", "always", "all", "none"],
                "prefer_clinical": ["based on", "according to", "evidence shows"]
            }
        }
        
        # Common medical errors to check
        self.common_errors = {
            "drug_interactions": {
                "warfarin": ["ciprofloxacin", "trimethoprim-sulfamethoxazole"],
                "digoxin": ["clarithromycin", "erythromycin"],
                "theophylline": ["ciprofloxacin", "erythromycin"]
            },
            "contraindications": {
                "penicillin_allergy": ["amoxicillin", "ampicillin", "piperacillin"],
                "pregnancy": ["doxycycline", "ciprofloxacin", "trimethoprim"],
                "renal_impairment": ["gentamicin", "vancomycin", "acyclovir"]
            },
            "resistance_patterns": {
                "mrsa": ["methicillin", "oxacillin", "nafcillin"],
                "esbl": ["ceftriaxone", "ceftazidime", "aztreonam"],
                "vre": ["vancomycin", "teicoplanin"]
            }
        }
    
    def test_medical_accuracy(self, question: Dict[str, Any]) -> List[str]:
        """Test medical accuracy of a question"""
        issues = []
        
        question_text = question.get("question", "").lower()
        explanation = question.get("explanation", "").lower()
        options = [opt.lower() for opt in question.get("options", [])]
        
        # Check for medical terminology accuracy
        for category, terms in self.medical_checks.items():
            for term in terms:
                if term in question_text or term in explanation:
                    # Verify proper usage context
                    if category == "antibiotic_names":
                        if not any(context in question_text for context in ["therapy", "treatment", "antibiotic"]):
                            issues.append(f"Antibiotic '{term}' mentioned without proper clinical context")
                    elif category == "pathogen_names":
                        if not any(context in question_text for context in ["pathogen", "bacteria", "organism", "infection"]):
                            issues.append(f"Pathogen '{term}' mentioned without proper clinical context")
        
        # Check for drug-bug mismatch
        if "mrsa" in question_text and any(drug in question_text for drug in ["penicillin", "amoxicillin", "cephalexin"]):
            issues.append("MRSA mentioned with beta-lactam antibiotics that would be ineffective")
        
        if "esbl" in question_text and any(drug in question_text for drug in ["ceftriaxone", "ceftazidime"]):
            issues.append("ESBL mentioned with cephalosporins that would be ineffective")
        
        # Check for dosing errors
        dosing_pattern = re.search(r'(\d+)\s*(mg|g|units)', question_text)
        if dosing_pattern:
            dose_value = int(dosing_pattern.group(1))
            dose_unit = dosing_pattern.group(2)
            if dose_unit == "g" and dose_value > 10:
                issues.append(f"Unusually high dose: {dose_value}{dose_unit}")
            elif dose_unit == "mg" and dose_value > 5000:
                issues.append(f"Unusually high dose: {dose_value}{dose_unit}")
        
        return issues
    
    def test_question_quality(self, question: Dict[str, Any]) -> List[str]:
        """Test question quality and construction"""
        issues = []
        
        question_text = question.get("question", "")
        explanation = question.get("explanation", "")
        options = question.get("options", [])
        
        # Check question clarity
        if len(question_text.split()) < 10:
            issues.append("Question too short - may lack sufficient clinical context")
        
        if len(question_text.split()) > 100:
            issues.append("Question too long - may be difficult to process")
        
        # Check for ambiguous language
        for ambiguous_word in self.quality_standards["question_clarity"]["avoid_ambiguous"]:
            if ambiguous_word in question_text.lower():
                issues.append(f"Ambiguous language detected: '{ambiguous_word}'")
        
        # Check answer options
        if len(options) < 3:
            issues.append("Too few answer options - should have at least 3")
        
        if len(options) > 5:
            issues.append("Too many answer options - should have at most 5")
        
        # Check for option similarity
        for i, option1 in enumerate(options):
            for j, option2 in enumerate(options[i+1:], i+1):
                similarity = self.calculate_similarity(option1, option2)
                if similarity > 0.8:
                    issues.append(f"Options {i+1} and {j+1} are too similar")
        
        # Check explanation quality
        if len(explanation.split()) < 15:
            issues.append("Explanation too short - should provide more detail")
        
        if not any(word in explanation.lower() for word in ["because", "due to", "since", "as"]):
            issues.append("Explanation lacks causal reasoning")
        
        return issues
    
    def test_difficulty_appropriateness(self, question: Dict[str, Any]) -> List[str]:
        """Test if difficulty level matches question complexity"""
        issues = []
        
        difficulty = question.get("difficulty", "intermediate")
        question_text = question.get("question", "").lower()
        explanation = question.get("explanation", "").lower()
        
        # Beginner level checks
        if difficulty == "beginner":
            advanced_terms = ["resistance", "mechanism", "pharmacokinetics", "bioavailability"]
            for term in advanced_terms:
                if term in question_text or term in explanation:
                    issues.append(f"Beginner question contains advanced term: '{term}'")
        
        # Advanced level checks
        elif difficulty == "advanced":
            basic_terms = ["common", "typical", "standard", "usual"]
            advanced_indicators = ["resistance", "mechanism", "complicated", "multiple"]
            
            if any(term in question_text for term in basic_terms):
                if not any(term in question_text for term in advanced_indicators):
                    issues.append("Advanced question may be too simple")
        
        return issues
    
    def test_resistance_scenarios(self, question: Dict[str, Any]) -> List[str]:
        """Test resistance scenario accuracy"""
        issues = []
        
        if question.get("category") == "Antibiotic Resistance Scenarios":
            question_text = question.get("question", "").lower()
            explanation = question.get("explanation", "").lower()
            
            # Check for resistance pattern accuracy
            if "mrsa" in question_text:
                if "vancomycin" not in explanation and "linezolid" not in explanation:
                    issues.append("MRSA scenario should mention appropriate anti-MRSA therapy")
            
            if "esbl" in question_text:
                if "carbapenem" not in explanation and "meropenem" not in explanation:
                    issues.append("ESBL scenario should mention carbapenem therapy")
            
            if "vre" in question_text:
                if "linezolid" not in explanation and "daptomycin" not in explanation:
                    issues.append("VRE scenario should mention appropriate anti-VRE therapy")
        
        return issues
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two text strings"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0
    
    def test_question_set(self, questions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Test a complete set of questions"""
        results = {
            "total_questions": len(questions),
            "passed": 0,
            "failed": 0,
            "issues": [],
            "summary": {},
            "recommendations": []
        }
        
        for i, question in enumerate(questions):
            question_issues = []
            
            # Run all tests
            question_issues.extend(self.test_medical_accuracy(question))
            question_issues.extend(self.test_question_quality(question))
            question_issues.extend(self.test_difficulty_appropriateness(question))
            question_issues.extend(self.test_resistance_scenarios(question))
            
            if question_issues:
                results["failed"] += 1
                results["issues"].append({
                    "question_index": i + 1,
                    "question": question.get("question", "")[:100] + "...",
                    "issues": question_issues
                })
            else:
                results["passed"] += 1
        
        # Generate summary statistics
        difficulty_dist = {}
        category_dist = {}
        
        for question in questions:
            difficulty = question.get("difficulty", "unknown")
            category = question.get("category", "unknown")
            
            difficulty_dist[difficulty] = difficulty_dist.get(difficulty, 0) + 1
            category_dist[category] = category_dist.get(category, 0) + 1
        
        pass_rate = (results["passed"] / results["total_questions"]) * 100 if results["total_questions"] > 0 else 0
        
        results["summary"] = {
            "difficulty_distribution": difficulty_dist,
            "category_distribution": category_dist,
            "pass_rate": pass_rate
        }
        
        # Generate recommendations
        if pass_rate < 80:
            results["recommendations"].append("Consider reviewing questions with issues for medical accuracy")
        
        if len(difficulty_dist) < 3:
            results["recommendations"].append("Consider adding questions of varying difficulty levels")
        
        if len(category_dist) < 5:
            results["recommendations"].append("Consider adding questions covering more clinical categories")
        
        return results
    
    def load_questions_from_file(self, filepath: str) -> List[Dict[str, Any]]:
        """Load questions from JavaScript file"""
        try:
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Extract JSON array
            if "const " in content and " = " in content:
                start_marker = content.find(" = [") + 3
                end_marker = content.rfind("];")
                json_content = content[start_marker:end_marker + 1]
                return json.loads(json_content)
            
            return []
            
        except Exception as e:
            print(f"Error loading questions from {filepath}: {e}")
            return []
    
    def generate_test_report(self, results: Dict[str, Any]) -> str:
        """Generate comprehensive test report"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        report = f"""
=== CONTENT QUALITY TEST REPORT ===
Generated on: {timestamp}

=== SUMMARY ===
Total Questions Tested: {results['total_questions']}
Passed: {results['passed']} ({results['summary']['pass_rate']:.1f}%)
Failed: {results['failed']} ({100 - results['summary']['pass_rate']:.1f}%)

=== DIFFICULTY DISTRIBUTION ===
"""
        
        for difficulty, count in results['summary']['difficulty_distribution'].items():
            percentage = (count / results['total_questions']) * 100
            report += f"{difficulty.capitalize()}: {count} ({percentage:.1f}%)\n"
        
        report += "\n=== CATEGORY DISTRIBUTION ===\n"
        for category, count in results['summary']['category_distribution'].items():
            percentage = (count / results['total_questions']) * 100
            report += f"{category}: {count} ({percentage:.1f}%)\n"
        
        report += "\n=== IDENTIFIED ISSUES ===\n"
        if results['issues']:
            for issue_set in results['issues'][:10]:  # Show top 10 issues
                report += f"\nQuestion {issue_set['question_index']}: {issue_set['question']}\n"
                for issue in issue_set['issues']:
                    report += f"  • {issue}\n"
        else:
            report += "No issues found! All questions passed quality checks.\n"
        
        report += "\n=== RECOMMENDATIONS ===\n"
        if results['recommendations']:
            for rec in results['recommendations']:
                report += f"• {rec}\n"
        else:
            report += "• Content quality is excellent - no specific recommendations\n"
        
        return report
    
    def save_test_results(self, results: Dict[str, Any], filename: str = "test_results.json"):
        """Save test results to JSON file"""
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"Test results saved to {filename}")

def main():
    """Main testing function"""
    tester = ContentTester()
    
    # Test files to check
    test_files = [
        "new_quiz_questions.js",
        "resistance_scenarios.js",
        "src/data/quizQuestionsWithDifficulty.js"
    ]
    
    all_results = {}
    
    for filename in test_files:
        print(f"\nTesting {filename}...")
        questions = tester.load_questions_from_file(filename)
        
        if questions:
            results = tester.test_question_set(questions)
            all_results[filename] = results
            
            print(f"  Loaded {len(questions)} questions")
            print(f"  Pass rate: {results['summary']['pass_rate']:.1f}%")
            print(f"  Issues found: {len(results['issues'])}")
        else:
            print(f"  No questions found in {filename}")
    
    # Generate comprehensive report
    if all_results:
        print("\n=== GENERATING COMPREHENSIVE REPORT ===")
        
        # Combine all results
        total_questions = sum(r['total_questions'] for r in all_results.values())
        total_passed = sum(r['passed'] for r in all_results.values())
        total_failed = sum(r['failed'] for r in all_results.values())
        
        combined_report = f"""
=== COMPREHENSIVE CONTENT QUALITY REPORT ===
Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

=== OVERALL SUMMARY ===
Total Questions Across All Files: {total_questions}
Total Passed: {total_passed} ({(total_passed/total_questions)*100:.1f}%)
Total Failed: {total_failed} ({(total_failed/total_questions)*100:.1f}%)

=== FILE-BY-FILE RESULTS ===
"""
        
        for filename, results in all_results.items():
            report = tester.generate_test_report(results)
            combined_report += f"\n{'='*50}\n{filename.upper()}\n{'='*50}{report}\n"
        
        # Save combined report
        with open("comprehensive_test_report.txt", 'w') as f:
            f.write(combined_report)
        
        print("Comprehensive test report saved to comprehensive_test_report.txt")
        
        # Save individual results
        for filename, results in all_results.items():
            safe_filename = filename.replace("/", "_").replace(".", "_")
            tester.save_test_results(results, f"test_results_{safe_filename}.json")
    
    else:
        print("No test files found or loaded successfully")

if __name__ == "__main__":
    main()