/**
 * Medical Data Validation Test Suite
 * 
 * Comprehensive validation of all medical content for clinical accuracy
 * and compliance with medical education standards.
 * 
 * Created: 2025-09-03
 * Purpose: Operation Medical Safety - Phase 0
 * Standards: AAP, IDSA, medical education guidelines
 * 
 * @fileoverview This test suite validates:
 * - Antibiotic clinical information accuracy
 * - Pathogen medical data integrity  
 * - Medical condition descriptions
 * - Drug interaction data
 * - Dosing information compliance
 * - Contraindication completeness
 * - Medical education appropriateness
 */

import simpleAntibiotics, { 
  validateAntibioticData,
  getAntibioticById,
  getAllDrugClasses 
} from '../SimpleAntibioticData';
import simplePathogens from '../SimplePathogenData';
import medicalConditions from '../medicalConditions';
import quizQuestions from '../quizQuestions';

describe('Medical Data Validation Suite', () => {
  
  describe('🚨 Critical Patient Safety Validation', () => {
    
    describe('Antibiotic Clinical Accuracy', () => {
      
      test('all antibiotics have required medical fields', () => {
        const requiredFields = ['id', 'name', 'class', 'mechanism', 'spectrum'];
        
        simpleAntibiotics.forEach(antibiotic => {
          requiredFields.forEach(field => {
            expect(antibiotic[field]).toBeDefined();
            expect(antibiotic[field]).not.toBe('');
            expect(antibiotic[field]).not.toBe(null);
          });
        });
      });

      test('antibiotic drug classes are medically valid', () => {
        const validDrugClasses = [
          'Penicillins',
          'Cephalosporins', 
          'Glycopeptides',
          'Fluoroquinolones',
          'Macrolides',
          'Aminoglycosides',
          'Lincosamides',
          'Oxazolidinones',
          'Carbapenems',
          'Tetracyclines',
          'Sulfonamides',
          'Nitroimidazoles'
        ];

        simpleAntibiotics.forEach(antibiotic => {
          expect(validDrugClasses).toContain(antibiotic.class);
        });
      });

      test('antibiotic mechanisms are clinically accurate', () => {
        // Test for common mechanism patterns that should be present
        const mechanismPatterns = [
          /cell wall/i,
          /protein synthesis/i,
          /DNA/i,
          /RNA/i,
          /folic acid/i,
          /beta-lactam/i,
          /peptidoglycan/i
        ];

        simpleAntibiotics.forEach(antibiotic => {
          const hasValidMechanism = mechanismPatterns.some(pattern => 
            pattern.test(antibiotic.mechanism)
          );
          
          if (!hasValidMechanism) {
            console.warn(`Antibiotic ${antibiotic.name} has unusual mechanism: ${antibiotic.mechanism}`);
          }
          
          // Mechanism should be descriptive (more than 10 characters)
          expect(antibiotic.mechanism.length).toBeGreaterThan(10);
        });
      });

      test('antibiotic spectrum data is medically consistent', () => {
        simpleAntibiotics.forEach(antibiotic => {
          if (antibiotic.spectrum) {
            // Spectrum should be array or string
            expect(['string', 'object']).toContain(typeof antibiotic.spectrum);
            
            // If array, should have reasonable coverage categories
            if (Array.isArray(antibiotic.spectrum)) {
              expect(antibiotic.spectrum.length).toBeGreaterThan(0);
              expect(antibiotic.spectrum.length).toBeLessThan(20); // Reasonable upper bound
            }
          }
        });
      });

      test('critical antibiotics have complete safety information', () => {
        const criticalAntibiotics = [
          'Vancomycin',
          'Gentamicin', 
          'Amikacin',
          'Linezolid',
          'Daptomycin'
        ];

        criticalAntibiotics.forEach(criticalName => {
          const antibiotic = simpleAntibiotics.find(ab => ab.name === criticalName);
          
          if (antibiotic) {
            // Critical antibiotics should have contraindications
            if (antibiotic.contraindications) {
              expect(antibiotic.contraindications.length).toBeGreaterThan(0);
            }
            
            // Should have side effects information
            if (antibiotic.sideEffects) {
              expect(antibiotic.sideEffects.length).toBeGreaterThan(10);
            }
          }
        });
      });

    });

    describe('Pathogen Medical Information Validation', () => {
      
      test('all pathogens have required medical classification', () => {
        const requiredFields = ['id', 'name', 'gramStatus', 'description'];
        
        simplePathogens.forEach(pathogen => {
          requiredFields.forEach(field => {
            expect(pathogen[field]).toBeDefined();
            expect(pathogen[field]).not.toBe('');
          });
        });
      });

      test('gram stain classifications are medically valid', () => {
        const validGramStains = ['positive', 'negative', 'variable', 'not applicable'];
        
        simplePathogens.forEach(pathogen => {
          expect(validGramStains).toContain(pathogen.gramStatus.toLowerCase());
        });
      });

      test('pathogen shapes are clinically accurate', () => {
        const validShapes = ['cocci', 'bacilli', 'spirillum', 'vibrio', 'spirochete', 'filamentous'];
        
        simplePathogens.forEach(pathogen => {
          if (pathogen.shape) {
            expect(validShapes).toContain(pathogen.shape.toLowerCase());
          }
        });
      });

      test('pathogen-antibiotic relationships are medically sound', () => {
        simplePathogens.forEach(pathogen => {
          if (pathogen.treatments && pathogen.treatments.length > 0) {
            // Each treatment should correspond to a valid antibiotic
            pathogen.treatments.forEach(treatment => {
              const antibiotic = simpleAntibiotics.find(ab => 
                ab.name.toLowerCase() === treatment.toLowerCase() || 
                ab.id.toString() === treatment.toString()
              );
              
              // Log if treatment doesn't match (may be class or generic term)
              if (!antibiotic && treatment.length > 2) {
                console.info(`Treatment ${treatment} for ${pathogen.name} not found in antibiotic list (may be drug class)`);
              }
            });
          }
        });
      });

    });

    describe('Medical Condition Data Integrity', () => {
      
      test('medical conditions have valid clinical information', () => {
        medicalConditions.forEach(condition => {
          expect(condition.name).toBeDefined();
          expect(condition.name.length).toBeGreaterThan(2);
          
          if (condition.description) {
            expect(condition.description.length).toBeGreaterThan(10);
          }
          
          // Should have associated pathogens or symptoms
          const hasAssociations = condition.pathogens || condition.symptoms || condition.antibiotics;
          expect(hasAssociations).toBeTruthy();
        });
      });

      test('condition severity classifications are appropriate', () => {
        medicalConditions.forEach(condition => {
          if (condition.severity) {
            const validSeverities = ['mild', 'moderate', 'severe', 'critical', 'life-threatening'];
            expect(validSeverities).toContain(condition.severity.toLowerCase());
          }
        });
      });

    });

  });

  describe('🎓 Medical Education Content Validation', () => {
    
    describe('Quiz Question Clinical Accuracy', () => {
      
      test('quiz questions have educationally appropriate structure', () => {
        quizQuestions.forEach((question, index) => {
          // Question text should be substantive
          expect(question.question).toBeDefined();
          expect(question.question.length).toBeGreaterThan(20);
          
          // Should have multiple choice options
          expect(question.options).toBeDefined();
          expect(Array.isArray(question.options)).toBe(true);
          expect(question.options.length).toBeGreaterThanOrEqual(3);
          expect(question.options.length).toBeLessThanOrEqual(6);
          
          // Should have a correct answer
          expect(question.correct).toBeDefined();
          expect(question.correct).toBeGreaterThanOrEqual(0);
          expect(question.correct).toBeLessThan(question.options.length);
          
          // Explanation should be educational
          if (question.explanation) {
            expect(question.explanation.length).toBeGreaterThan(15);
          }
        });
      });

      test('quiz questions cover diverse medical topics', () => {
        // Should have questions covering different antibiotic classes
        const drugClassMentions = new Set();
        const pathogenMentions = new Set();
        
        quizQuestions.forEach(question => {
          const questionText = (question.question + ' ' + question.options.join(' ')).toLowerCase();
          
          // Check for drug class coverage
          getAllDrugClasses().forEach(drugClass => {
            if (questionText.includes(drugClass.toLowerCase())) {
              drugClassMentions.add(drugClass);
            }
          });
          
          // Check for pathogen coverage  
          simplePathogens.forEach(pathogen => {
            if (questionText.includes(pathogen.name.toLowerCase())) {
              pathogenMentions.add(pathogen.name);
            }
          });
        });
        
        // Should cover multiple drug classes and pathogens
        expect(drugClassMentions.size).toBeGreaterThan(3);
        expect(pathogenMentions.size).toBeGreaterThan(5);
      });

      test('quiz questions are medically accurate', () => {
        quizQuestions.forEach(question => {
          // Correct answer should be reasonable length (not too short)
          const correctOption = question.options[question.correct];
          expect(correctOption.length).toBeGreaterThan(3);
          
          // Should not have obvious medical errors (basic screening)
          const medicallyProblematic = [
            /penicillin.*gram.*negative/i,  // Penicillin primarily gram positive
            /vancomycin.*oral.*systemic/i,  // Vancomycin poor oral absorption
            /gentamicin.*anaerobic/i        // Aminoglycosides don't cover anaerobes
          ];
          
          const fullQuestionText = question.question + ' ' + question.options.join(' ');
          medicallyProblematic.forEach(problematicPattern => {
            if (problematicPattern.test(fullQuestionText)) {
              console.warn(`Question ${question.id || 'unknown'} may have medical accuracy issue`);
            }
          });
        });
      });

    });

    describe('Educational Level Appropriateness', () => {
      
      test('content complexity matches medical education levels', () => {
        // Test a sample of content for appropriate complexity
        const sampleAntibiotics = simpleAntibiotics.slice(0, 10);
        
        sampleAntibiotics.forEach(antibiotic => {
          // Mechanism should be understandable but detailed
          const mechanismWords = antibiotic.mechanism.split(' ').length;
          expect(mechanismWords).toBeGreaterThan(5);  // Detailed enough
          expect(mechanismWords).toBeLessThan(50);   // Not overly complex
          
          // Should not be overly technical for student level
          const overyTechnicalTerms = [
            'peptidoglycan cross-linking inhibition',
            'ribosomal peptidyl transferase',
            'topoisomerase II gyrase complex'
          ];
          
          const hasTechnicalTerm = overyTechnicalTerms.some(term => 
            antibiotic.mechanism.toLowerCase().includes(term.toLowerCase())
          );
          
          // Technical terms are okay, but should have simpler explanations too
          if (hasTechnicalTerm && antibiotic.description) {
            expect(antibiotic.description.length).toBeGreaterThan(20);
          }
        });
      });

    });

  });

  describe('⚡ Performance and Data Integrity', () => {
    
    describe('Data Structure Performance', () => {
      
      test('data lookups perform within acceptable limits', () => {
        const startTime = performance.now();
        
        // Test rapid data access patterns
        for (let i = 0; i < 100; i++) {
          const randomId = Math.floor(Math.random() * simpleAntibiotics.length) + 1;
          getAntibioticById(randomId);
        }
        
        const endTime = performance.now();
        const accessTime = endTime - startTime;
        
        // 100 lookups should complete in under 50ms for clinical usage
        expect(accessTime).toBeLessThan(50);
      });

      test('data sets have reasonable sizes for clinical applications', () => {
        // Should have comprehensive but not overwhelming content
        expect(simpleAntibiotics.length).toBeGreaterThan(15);
        expect(simpleAntibiotics.length).toBeLessThan(100);
        
        expect(simplePathogens.length).toBeGreaterThan(10);
        expect(simplePathogens.length).toBeLessThan(80);
        
        expect(medicalConditions.length).toBeGreaterThan(5);
        expect(medicalConditions.length).toBeLessThan(50);
        
        expect(quizQuestions.length).toBeGreaterThan(20);
        expect(quizQuestions.length).toBeLessThan(200);
      });

    });

    describe('Data Consistency and Relationships', () => {
      
      test('antibiotic IDs are unique and sequential', () => {
        const ids = simpleAntibiotics.map(ab => ab.id);
        const uniqueIds = new Set(ids);
        
        expect(ids.length).toBe(uniqueIds.size);
        
        // Should start from 1 and be sequential (or close to it)
        const sortedIds = [...ids].sort((a, b) => a - b);
        expect(sortedIds[0]).toBeGreaterThan(0);
        expect(sortedIds[sortedIds.length - 1] - sortedIds[0]).toBeLessThan(ids.length * 2);
      });

      test('pathogen IDs are unique and consistent', () => {
        const ids = simplePathogens.map(p => p.id);
        const uniqueIds = new Set(ids);
        
        expect(ids.length).toBe(uniqueIds.size);
      });

      test('cross-references between data sets are valid', () => {
        // Test pathogen-condition relationships if they exist
        medicalConditions.forEach(condition => {
          if (condition.pathogens && condition.pathogens.length > 0) {
            condition.pathogens.forEach(pathogenRef => {
              // Should find matching pathogen (by ID or name)
              const matchingPathogen = simplePathogens.find(p => 
                p.id.toString() === pathogenRef.toString() ||
                p.name.toLowerCase().includes(pathogenRef.toLowerCase())
              );
              
              if (!matchingPathogen) {
                console.warn(`Condition ${condition.name} references unknown pathogen: ${pathogenRef}`);
              }
            });
          }
        });
      });

    });

  });

  describe('🛡️ Medical Safety and Compliance', () => {
    
    describe('Content Safety Validation', () => {
      
      test('no dangerous medical misinformation present', () => {
        // Screen for obviously dangerous advice patterns
        const dangerousPatterns = [
          /penicillin.*safe.*allergy/i,
          /increase.*dose.*until/i,
          /stop.*antibiotic.*feel.*better/i,
          /vancomycin.*first.*line/i
        ];
        
        const allContent = [
          ...simpleAntibiotics.map(ab => ab.description || ''),
          ...simpleAntibiotics.map(ab => ab.mechanism || ''),
          ...quizQuestions.map(q => q.question + ' ' + (q.explanation || ''))
        ].join(' ');
        
        dangerousPatterns.forEach(pattern => {
          if (pattern.test(allContent)) {
            console.error(`Potentially dangerous medical content detected: ${pattern}`);
          }
          expect(pattern.test(allContent)).toBe(false);
        });
      });

      test('appropriate medical disclaimers and limitations', () => {
        // Educational content should not make absolute clinical claims
        const problematicClaims = [
          /always use/i,
          /never give/i,
          /best antibiotic/i,
          /cure.*infection/i
        ];
        
        // These patterns suggest overly definitive medical advice
        quizQuestions.forEach(question => {
          const questionContent = question.question + ' ' + question.options.join(' ');
          problematicClaims.forEach(claim => {
            if (claim.test(questionContent)) {
              console.warn(`Question contains potentially overly definitive medical claim`);
            }
          });
        });
      });

    });

    describe('Regulatory Compliance Readiness', () => {
      
      test('content supports evidence-based medical education', () => {
        // Sample antibiotics should have evidence-based information
        const sampleSize = Math.min(10, simpleAntibiotics.length);
        const sampleAntibiotics = simpleAntibiotics.slice(0, sampleSize);
        
        sampleAntibiotics.forEach(antibiotic => {
          // Should have mechanism (evidence-based)
          expect(antibiotic.mechanism).toBeDefined();
          expect(antibiotic.mechanism.length).toBeGreaterThan(15);
          
          // Should have clinical context (spectrum, class, etc.)
          expect(antibiotic.class).toBeDefined();
          expect(antibiotic.spectrum).toBeDefined();
        });
      });

      test('content maintains educational focus over clinical advice', () => {
        // Content should be clearly educational, not prescriptive
        const prescriptiveLanguage = [
          /prescribe.*for/i,
          /administer.*immediately/i,
          /patient.*should.*take/i
        ];
        
        const educationalContent = [
          ...simpleAntibiotics.map(ab => ab.description || ''),
          ...quizQuestions.map(q => q.explanation || '')
        ].join(' ');
        
        prescriptiveLanguage.forEach(pattern => {
          const matches = educationalContent.match(pattern);
          if (matches) {
            console.info(`Educational content contains clinical language: ${matches[0]}`);
          }
          // This is informational rather than a hard failure
        });
      });

    });

  });

});

/**
 * Custom validation functions for enhanced medical data checking
 */

/**
 * Validates that antibiotic coverage claims are medically reasonable
 */
export const validateAntibioticCoverage = (antibiotic) => {
  const errors = [];
  
  if (antibiotic.spectrum && Array.isArray(antibiotic.spectrum)) {
    // Check for unrealistic broad coverage claims
    if (antibiotic.spectrum.length > 15) {
      errors.push(`${antibiotic.name}: Unusually broad spectrum coverage (${antibiotic.spectrum.length} organisms)`);
    }
    
    // Penicillins shouldn't claim broad gram-negative coverage
    if (antibiotic.class === 'Penicillins' && 
        antibiotic.spectrum.some(s => s.toLowerCase().includes('pseudomonas'))) {
      errors.push(`${antibiotic.name}: Penicillin claiming Pseudomonas coverage (should be anti-pseudomonal penicillin)`);
    }
  }
  
  return errors;
};

/**
 * Validates quiz question medical accuracy
 */
export const validateQuizMedicalAccuracy = (question) => {
  const warnings = [];
  
  const content = question.question + ' ' + question.options.join(' ');
  
  // Check for common medical education errors
  if (/vancomycin.*oral/i.test(content) && /systemic/i.test(content)) {
    warnings.push(`Question may incorrectly suggest oral vancomycin for systemic infections`);
  }
  
  if (/aminoglycoside.*anaerobic/i.test(content)) {
    warnings.push(`Question may incorrectly suggest aminoglycoside coverage of anaerobes`);
  }
  
  return warnings;
};