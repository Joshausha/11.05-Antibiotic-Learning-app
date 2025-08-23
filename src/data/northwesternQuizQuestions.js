/**
 * Northwestern Quiz Questions
 * Visual learning quiz questions based on Northwestern 8-segment antibiotic coverage methodology
 * 
 * Created by: Agent 2.5 - Component Integration Guardian
 * Date: 2025-08-18
 * 
 * Northwestern 8-Segment Categories:
 * 1. MRSA - Methicillin-resistant Staphylococcus aureus
 * 2. VRE_faecium - Vancomycin-resistant Enterococcus faecium  
 * 3. anaerobes - Bacteroides, C. difficile, mixed anaerobes
 * 4. atypicals - Legionella, Mycoplasma, Chlamydophila
 * 5. pseudomonas - Pseudomonas aeruginosa
 * 6. gramNegative - Gram-negative organisms
 * 7. MSSA - Methicillin-sensitive Staphylococcus aureus
 * 8. enterococcus_faecalis - Enterococcus faecalis
 */

const northwesternQuizQuestions = [
  {
    "question": "Based on the Northwestern spectrum analysis, which antibiotic would provide the BEST coverage for MRSA infections?",
    "options": [
      "Vancomycin",
      "Ceftriaxone", 
      "Azithromycin",
      "Ciprofloxacin"
    ],
    "correct": 0,
    "explanation": "Vancomycin shows excellent (2/2) coverage for MRSA in the Northwestern spectrum analysis. This glycopeptide antibiotic is specifically effective against gram-positive organisms including methicillin-resistant Staphylococcus aureus, making it a first-line choice for MRSA infections.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_mrsa",
    "difficulty": "intermediate",
    "northwesternFocus": true,
    "targetSegment": "MRSA",
    "visualComponent": true
  },
  
  {
    "question": "In the Northwestern 8-segment model, which pathogen category represents atypical organisms causing respiratory infections?",
    "options": [
      "Atypicals (Legionella, Mycoplasma, Chlamydophila)",
      "Anaerobes (Bacteroides, C. difficile)",
      "Gram-negative organisms",
      "Pseudomonas aeruginosa"
    ],
    "correct": 0,
    "explanation": "The 'atypicals' segment in Northwestern methodology specifically refers to Legionella, Mycoplasma, and Chlamydophila - pathogens that cause atypical pneumonia and other respiratory infections. These organisms require specific antibiotic coverage different from typical bacterial pathogens.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_atypicals",
    "difficulty": "beginner",
    "northwesternFocus": true,
    "targetSegment": "atypicals",
    "visualComponent": true
  },

  {
    "question": "Which antibiotic class typically shows good coverage across multiple Northwestern segments including both MSSA and gram-negative organisms?",
    "options": [
      "Beta-lactams (Penicillins, Cephalosporins)",
      "Glycopeptides (Vancomycin)",
      "Macrolides (Azithromycin)",
      "Fluoroquinolones"
    ],
    "correct": 0,
    "explanation": "Beta-lactam antibiotics, particularly broad-spectrum penicillins and cephalosporins, demonstrate coverage across multiple Northwestern segments. They typically cover MSSA, many gram-negative organisms, and some anaerobes, making them versatile choices for mixed infections.",
    "category": "Northwestern Coverage", 
    "conditionId": "northwestern_multiple",
    "difficulty": "intermediate",
    "northwesternFocus": true,
    "targetSegment": "multiple",
    "visualComponent": true
  },

  {
    "question": "Based on Northwestern spectrum analysis, VRE faecium represents which type of resistance challenge?",
    "options": [
      "Vancomycin-resistant Enterococcus requiring alternative therapy",
      "Beta-lactam resistant Staphylococcus",
      "Fluoroquinolone-resistant gram-negatives", 
      "Macrolide-resistant atypicals"
    ],
    "correct": 0,
    "explanation": "VRE faecium (Vancomycin-resistant Enterococcus faecium) represents one of the most challenging resistance patterns in the Northwestern model. These organisms are resistant to vancomycin and require alternative antibiotics like linezolid, daptomycin, or newer agents for effective treatment.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_vre_faecium",
    "difficulty": "advanced",
    "northwesternFocus": true,
    "targetSegment": "VRE_faecium", 
    "visualComponent": true
  },

  {
    "question": "In Northwestern visualization, which segment represents the most challenging gram-negative pathogen in healthcare settings?",
    "options": [
      "Pseudomonas aeruginosa",
      "Enterococcus faecalis",
      "MSSA",
      "Anaerobes"
    ],
    "correct": 0,
    "explanation": "Pseudomonas aeruginosa occupies its own dedicated segment in Northwestern methodology due to its unique resistance patterns and clinical significance. This opportunistic gram-negative pathogen is particularly challenging due to intrinsic and acquired resistance mechanisms.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_pseudomonas",
    "difficulty": "intermediate", 
    "northwesternFocus": true,
    "targetSegment": "pseudomonas",
    "visualComponent": true
  },

  {
    "question": "Which Northwestern segment would be most relevant for intra-abdominal infections and C. difficile coverage?",
    "options": [
      "Anaerobes (Bacteroides, C. difficile, mixed anaerobes)",
      "Gram-negative organisms", 
      "MRSA",
      "Atypicals"
    ],
    "correct": 0,
    "explanation": "The anaerobes segment specifically includes Bacteroides, C. difficile, and mixed anaerobic organisms that are commonly found in intra-abdominal infections, wound infections, and antibiotic-associated colitis. Antibiotic coverage for this segment is crucial in these clinical scenarios.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_anaerobes",
    "difficulty": "intermediate",
    "northwesternFocus": true,
    "targetSegment": "anaerobes",
    "visualComponent": true
  },

  {
    "question": "Based on Northwestern spectrum analysis, which antibiotic would you expect to have poor coverage for Pseudomonas aeruginosa?",
    "options": [
      "Azithromycin",
      "Piperacillin-tazobactam",
      "Ceftazidime", 
      "Meropenem"
    ],
    "correct": 0,
    "explanation": "Azithromycin, a macrolide antibiotic, typically shows poor coverage (0-1/2) for Pseudomonas aeruginosa in Northwestern analysis. Macrolides are primarily effective against gram-positive organisms and atypicals, not against challenging gram-negative pathogens like P. aeruginosa.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_pseudomonas",
    "difficulty": "advanced",
    "northwesternFocus": true,
    "targetSegment": "pseudomonas",
    "visualComponent": true
  },

  {
    "question": "In Northwestern methodology, what does a coverage score of '2' indicate for any pathogen segment?",
    "options": [
      "Good coverage - recommended for treatment",
      "Moderate coverage - use with caution",
      "No coverage - contraindicated",
      "Variable coverage - depends on local resistance"
    ],
    "correct": 0,
    "explanation": "In Northwestern 8-segment scoring, '2' represents good coverage, indicating the antibiotic is effective and recommended for treating infections caused by organisms in that segment. This is the highest score in the 0-2 scale (0=no coverage, 1=moderate coverage, 2=good coverage).",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_multiple",
    "difficulty": "beginner",
    "northwesternFocus": true,
    "targetSegment": "multiple",
    "visualComponent": true
  },

  {
    "question": "Which clinical scenario would benefit most from analyzing the Northwestern MSSA segment coverage?",
    "options": [
      "Skin and soft tissue infections in immunocompetent patients",
      "Healthcare-associated pneumonia in ICU patients",
      "Intra-abdominal infections post-surgery",
      "Atypical pneumonia in young adults"
    ],
    "correct": 0,
    "explanation": "MSSA (methicillin-sensitive Staphylococcus aureus) commonly causes skin and soft tissue infections in immunocompetent patients. Understanding Northwestern MSSA coverage helps select appropriate antibiotics for cellulitis, abscesses, and wound infections where MSSA is a primary pathogen.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_mssa",
    "difficulty": "intermediate",
    "northwesternFocus": true,
    "targetSegment": "MSSA",
    "visualComponent": true
  },

  {
    "question": "Based on Northwestern analysis, which combination provides the broadest coverage across all 8 segments?",
    "options": [
      "Vancomycin + Piperacillin-tazobactam",
      "Azithromycin + Ciprofloxacin",
      "Ceftriaxone + Metronidazole",
      "Penicillin + Gentamicin"
    ],
    "correct": 0,
    "explanation": "Vancomycin + Piperacillin-tazobactam provides comprehensive Northwestern coverage: Vancomycin covers MRSA, VRE (partially), and gram-positives, while piperacillin-tazobactam covers gram-negatives, Pseudomonas, anaerobes, and some atypicals. This combination addresses the majority of the 8 Northwestern segments effectively.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_multiple",
    "difficulty": "advanced",
    "northwesternFocus": true,
    "targetSegment": "multiple",
    "visualComponent": true
  },

  {
    "question": "In Northwestern visualization, what visual cue indicates an antibiotic has cell wall activity?",
    "options": [
      "Dotted border pattern around segments",
      "Larger pie chart size",
      "Different color intensity",
      "Bold segment labels"
    ],
    "correct": 0,
    "explanation": "In Northwestern pie chart visualization, antibiotics with cell wall activity (beta-lactams, vancomycin, daptomycin) are indicated by dotted border patterns around the segments. This visual cue helps clinicians quickly identify antibiotics that target bacterial cell wall synthesis.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_visual",
    "difficulty": "intermediate",
    "northwesternFocus": true,
    "targetSegment": "visual",
    "visualComponent": true
  },

  {
    "question": "Which Northwestern segment would be LEAST relevant when selecting empiric therapy for community-acquired pneumonia in a healthy adult?",
    "options": [
      "VRE faecium",
      "Atypicals (Legionella, Mycoplasma)",
      "MSSA",
      "Gram-negative organisms"
    ],
    "correct": 0,
    "explanation": "VRE faecium is the least relevant Northwestern segment for community-acquired pneumonia in healthy adults. VRE typically causes healthcare-associated infections, UTIs, and bacteremia, but is not a common cause of community-acquired pneumonia. Focus should be on atypicals, MSSA, and some gram-negatives.",
    "category": "Northwestern Coverage",
    "conditionId": "northwestern_vre_faecium",
    "difficulty": "advanced",
    "northwesternFocus": true,
    "targetSegment": "VRE_faecium",
    "visualComponent": true
  }
];

export default northwesternQuizQuestions;