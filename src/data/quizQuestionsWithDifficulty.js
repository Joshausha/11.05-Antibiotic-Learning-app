/**
 * Validated and Enhanced Quiz Questions
 * Medical data validated for completeness and accuracy
 * Terminology standardized and missing fields added
 * 
 * Validated automatically by data_validator.py
 * Total questions: 79
 * Validation completed: 2025-07-16T22:52:12.159153
 */

const quizQuestionsWithDifficulty = [
  {
    "question": "Which of the following is a common pathogen causing urinary tract infection - pyelonephritis?",
    "options": [
      "Escherichia coli",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Escherichia coli is a common pathogen causing urinary tract infection - pyelonephritis.",
    "category": "Genitourinary",
    "conditionId": "uti_pyelonephritis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for uncomplicated bloodstream infection in enterobacterales cases?",
    "options": [
      "Choice depends on results of antibiotic susceptibility testing",
      "Ceftriaxone PLUS Vancomycin",
      "Piperacillin-tazobactam",
      "Ampicillin PLUS Gentamicin"
    ],
    "correct": 0,
    "explanation": "For uncomplicated bloodstream infection (enterobacterales), the recommended therapy is: Choice depends on results of antibiotic susceptibility testing",
    "category": "Bloodstream Infection in Nonneonates",
    "conditionId": "uncomplicated_bloodstream_infection_nonneonates",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for suspected meningitis?",
    "options": [
      "Some experts suggest repeat lumbar puncture to document cerebrospinal fluid sterility.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Some experts suggest repeat lumbar puncture to document cerebrospinal fluid sterility. This is an important clinical consideration for suspected meningitis.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "suspected_meningitis_neonatal_fever",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for meningitis (non- neonates)?",
    "options": [
      "These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture and susceptibility results.",
      "14-21 days",
      "5-7 days",
      "2-3 weeks"
    ],
    "correct": 0,
    "explanation": "For meningitis (non- neonates), the recommended duration is: These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture and susceptibility results.",
    "category": "Central Nervous System",
    "conditionId": "meningitis_non_neonates",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for suspected meningitis in neonates 8-28 days of age cases?",
    "options": [
      "Ampicillin PLUS Cefotaxime (Ceftazidime or Cefepime if Cefotaxime not available) (some experts will add an aminoglycoside if the cerebrospinal fluid Gram stain shows gram-negative organisms)",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For suspected meningitis (neonates 8-28 days of age), the recommended therapy is: Ampicillin PLUS Cefotaxime (Ceftazidime or Cefepime if Cefotaxime not available) (some experts will add an aminoglycoside if the cerebrospinal fluid Gram stain shows gram-negative organisms)",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "suspected_meningitis_neonatal_fever",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for cellulitis (nonpurulent)?",
    "options": [
      "For bite wounds, see p 202.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "For bite wounds, see p 202. This is an important clinical consideration for cellulitis (nonpurulent).",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "cellulitis_nonpurulent",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for mastoiditis?",
    "options": [
      "2-4 wk depending on adequate d\u00e9bridement, intracranial extension, extent of osteomyelitis, associated thrombosis",
      "3-4 weeks",
      "7-10 days",
      "14-21 days"
    ],
    "correct": 0,
    "explanation": "For mastoiditis, the recommended duration is: 2-4 wk depending on adequate d\u00e9bridement, intracranial extension, extent of osteomyelitis, associated thrombosis",
    "category": "Ear, Nose, and Throat",
    "conditionId": "mastoiditis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing unclear source?",
    "options": [
      "Group B Streptococcus",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Group B Streptococcus is a common pathogen causing unclear source.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "unclear_source_neonatal_fever",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for urinary tract infection - pyelonephritis?",
    "options": [
      "7-10 days (hospitalized).",
      "5-7 days",
      "6-8 weeks",
      "2-3 weeks"
    ],
    "correct": 0,
    "explanation": "For urinary tract infection - pyelonephritis, the recommended duration is: 7-10 days (hospitalized).",
    "category": "Genitourinary",
    "conditionId": "uti_pyelonephritis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for mastoiditis?",
    "options": [
      "Transition to oral with clinical improvement.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Transition to oral with clinical improvement. This is an important clinical consideration for mastoiditis.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "mastoiditis",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for cellulitis (nonpurulent)?",
    "options": [
      "5-7 days.",
      "6-8 weeks",
      "10-14 days",
      "7-10 days"
    ],
    "correct": 0,
    "explanation": "For cellulitis (nonpurulent), the recommended duration is: 5-7 days.",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "cellulitis_nonpurulent",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for orbital cellulitis?",
    "options": [
      "Consider empiric MRSA coverage if high local MRSA rates.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Consider empiric MRSA coverage if high local MRSA rates. This is an important clinical consideration for orbital cellulitis.",
    "category": "Ophthalmologic",
    "conditionId": "orbital_cellulitis",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is an important clinical consideration for acute otitis media?",
    "options": [
      "Consider observation without antibiotics for 48-72 hours for children 24 months or older without severe symptoms; if symptoms persist or worsen, use same antibiotic recommendations as for those receiving immediate therapy.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Consider observation without antibiotics for 48-72 hours for children 24 months or older without severe symptoms; if symptoms persist or worsen, use same antibiotic recommendations as for those receiving immediate therapy. This is an important clinical consideration for acute otitis media.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_otitis_media",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is an important clinical consideration for uncomplicated bloodstream infection?",
    "options": [
      "Duration of therapy is regardless of whether vascular catheter is removed, and should not be extended solely based on presence of antibiotic resistance or retained vascular catheter.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Duration of therapy is regardless of whether vascular catheter is removed, and should not be extended solely based on presence of antibiotic resistance or retained vascular catheter. This is an important clinical consideration for uncomplicated bloodstream infection.",
    "category": "Bloodstream Infection in Nonneonates",
    "conditionId": "uncomplicated_bloodstream_infection_nonneonates",
    "difficulty": "advanced"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for osteomyelitis?",
    "options": [
      "3-4 wk.",
      "14-21 days",
      "5-7 days",
      "7-10 days"
    ],
    "correct": 0,
    "explanation": "For osteomyelitis, the recommended duration is: 3-4 wk.",
    "category": "Bone/Joint",
    "conditionId": "osteomyelitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for uncomplicated bloodstream infection?",
    "options": [
      "14 days from first negative blood culture",
      "10-14 days",
      "6-8 weeks",
      "5-7 days"
    ],
    "correct": 0,
    "explanation": "For uncomplicated bloodstream infection, the recommended duration is: 14 days from first negative blood culture",
    "category": "Bloodstream Infection in Nonneonates",
    "conditionId": "uncomplicated_bloodstream_infection_nonneonates",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for unclear source?",
    "options": [
      "These are empiric recommendations: specific choice and duration of antibiotic therapy should be guided by culture results.",
      "7-10 days",
      "5-7 days",
      "3-5 days"
    ],
    "correct": 0,
    "explanation": "For unclear source, the recommended duration is: These are empiric recommendations: specific choice and duration of antibiotic therapy should be guided by culture results.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "unclear_source_neonatal_fever",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is a common pathogen causing purulent cellulitis/ abscess?",
    "options": [
      "Staphylococcus aureus",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Staphylococcus aureus is a common pathogen causing purulent cellulitis/ abscess.",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "purulent_cellulitis_abscess",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for urinary tract infection - pyelonephritis in standard treatment cases?",
    "options": [
      "Cephalexin OR Trimethoprim-sulfamethoxazole OR Ampicillin PLUS Gentamicin OR Ceftriaxone OR Ciprofloxacin",
      "Amoxicillin-clavulanate",
      "Azithromycin",
      "Doxycycline"
    ],
    "correct": 0,
    "explanation": "For urinary tract infection - pyelonephritis (standard treatment), the recommended therapy is: Cephalexin OR Trimethoprim-sulfamethoxazole OR Ampicillin PLUS Gentamicin OR Ceftriaxone OR Ciprofloxacin",
    "category": "Genitourinary",
    "conditionId": "uti_pyelonephritis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing uncomplicated bloodstream infection?",
    "options": [
      "Staphylococcus aureus",
      "Streptococcus pneumoniae",
      "Haemophilus influenzae",
      "Neisseria meningitidis"
    ],
    "correct": 0,
    "explanation": "Staphylococcus aureus is a common pathogen causing uncomplicated bloodstream infection.",
    "category": "Bloodstream Infection in Nonneonates",
    "conditionId": "uncomplicated_bloodstream_infection_nonneonates",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for community- acquired pneumonia (community-acquired pneumonia)?",
    "options": [
      "Early switch to oral route encouraged when tolerated.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Early switch to oral route encouraged when tolerated. This is an important clinical consideration for community- acquired pneumonia (community-acquired pneumonia).",
    "category": "Respiratory",
    "conditionId": "community_acquired_pneumonia",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for suspected meningitis?",
    "options": [
      "These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture results.",
      "6-8 weeks",
      "7-10 days",
      "3-4 weeks"
    ],
    "correct": 0,
    "explanation": "For suspected meningitis, the recommended duration is: These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture results.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "suspected_meningitis_neonatal_fever",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is an important clinical consideration for osteomyelitis?",
    "options": [
      "K\u00fcngella infection not effectively treated by clindamycin and not reliably susceptible to oxacillin/ nafcillin.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "K\u00fcngella infection not effectively treated by clindamycin and not reliably susceptible to oxacillin/ nafcillin. This is an important clinical consideration for osteomyelitis.",
    "category": "Bone/Joint",
    "conditionId": "osteomyelitis",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is a common pathogen causing lymphadenitis?",
    "options": [
      "Streptococcus pyogenes",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pyogenes is a common pathogen causing lymphadenitis.",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "lymphadenitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for orbital cellulitis in severe cases?",
    "options": [
      "Add Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For orbital cellulitis (severe), the recommended therapy is: Add Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
    "category": "Ophthalmologic",
    "conditionId": "orbital_cellulitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for retropharyngeal abscess?",
    "options": [
      "14 days",
      "3-4 weeks",
      "3-5 days",
      "5-7 days"
    ],
    "correct": 0,
    "explanation": "For retropharyngeal abscess, the recommended duration is: 14 days",
    "category": "Ear, Nose, and Throat",
    "conditionId": "retropharyngeal_abscess",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for osteomyelitis in moderate/severe and low suspicion of mrsa cases?",
    "options": [
      "Cefazolin OR Oxacillin OR Nafcillin",
      "Ampicillin-sulbactam",
      "Ceftriaxone",
      "Clindamycin PLUS Rifampin"
    ],
    "correct": 0,
    "explanation": "For osteomyelitis (moderate/severe and low suspicion of mrsa), the recommended therapy is: Cefazolin OR Oxacillin OR Nafcillin",
    "category": "Bone/Joint",
    "conditionId": "osteomyelitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for mastoiditis in standard cases?",
    "options": [
      "Consider surgical drainage/excision. Ampicillin- sulbactam OR Ceftriaxone.",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For mastoiditis (standard), the recommended therapy is: Consider surgical drainage/excision. Ampicillin- sulbactam OR Ceftriaxone.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "mastoiditis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for meningitis (non- neonates)?",
    "options": [
      "Longer courses are necessary for patients with parenchymal brain infection (cerebritis, rhombencephalitis, brain abscess).",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Longer courses are necessary for patients with parenchymal brain infection (cerebritis, rhombencephalitis, brain abscess). This is an important clinical consideration for meningitis (non- neonates).",
    "category": "Central Nervous System",
    "conditionId": "meningitis_non_neonates",
    "difficulty": "advanced"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for purulent cellulitis/ abscess?",
    "options": [
      "5-7 days.",
      "14-21 days",
      "7-10 days",
      "6-8 weeks"
    ],
    "correct": 0,
    "explanation": "For purulent cellulitis/ abscess, the recommended duration is: 5-7 days.",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "purulent_cellulitis_abscess",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for streptococcal pharyngitis in allergy cases?",
    "options": [
      "Cephalexin OR Clindamycin OR Azithromycin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Doxycycline"
    ],
    "correct": 0,
    "explanation": "For streptococcal pharyngitis (allergy), the recommended therapy is: Cephalexin OR Clindamycin OR Azithromycin",
    "category": "Ear, Nose, and Throat",
    "conditionId": "streptococcal_pharyngitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing preseptal cellulitis (ie, nonsinus origin)?",
    "options": [
      "Streptococcus pyogenes",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pyogenes is a common pathogen causing preseptal cellulitis (ie, nonsinus origin).",
    "category": "Ophthalmologic",
    "conditionId": "preseptal_cellulitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for septic arthritis?",
    "options": [
      "2-3 wk",
      "7-10 days",
      "6-8 weeks",
      "10-14 days"
    ],
    "correct": 0,
    "explanation": "For septic arthritis, the recommended duration is: 2-3 wk",
    "category": "Bone/Joint",
    "conditionId": "septic_arthritis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for community- acquired pneumonia (community-acquired pneumonia) in if mrsa suspected cases?",
    "options": [
      "Add Vancomycin OR Clindamycin OR Linezolid",
      "Ceftriaxone",
      "Ampicillin-sulbactam",
      "Doxycycline"
    ],
    "correct": 0,
    "explanation": "For community- acquired pneumonia (community-acquired pneumonia) (if mrsa suspected), the recommended therapy is: Add Vancomycin OR Clindamycin OR Linezolid",
    "category": "Respiratory",
    "conditionId": "community_acquired_pneumonia",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for septic arthritis in severe and low suspicion of mrsa cases?",
    "options": [
      "Cefazolin OR Oxacillin OR Nafcillin",
      "Ampicillin-sulbactam",
      "Ceftriaxone",
      "Clindamycin PLUS Rifampin"
    ],
    "correct": 0,
    "explanation": "For septic arthritis (severe and low suspicion of mrsa), the recommended therapy is: Cefazolin OR Oxacillin OR Nafcillin",
    "category": "Bone/Joint",
    "conditionId": "septic_arthritis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for streptococcal pharyngitis?",
    "options": [
      "10 days",
      "2-3 weeks",
      "7-10 days",
      "10-14 days"
    ],
    "correct": 0,
    "explanation": "For streptococcal pharyngitis, the recommended duration is: 10 days",
    "category": "Ear, Nose, and Throat",
    "conditionId": "streptococcal_pharyngitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for intra-abdominal infection?",
    "options": [
      "May need longer duration if insufficient source control.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "May need longer duration if insufficient source control. This is an important clinical consideration for intra-abdominal infection.",
    "category": "Intra-abdominal",
    "conditionId": "intra_abdominal_infection",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for community- acquired pneumonia (community-acquired pneumonia)?",
    "options": [
      "5 days for uncomplicated community-acquired pneumonia with resolution of fever, tachypnea, and supplemental oxygen requirement.",
      "7-10 days",
      "3-4 weeks",
      "3-5 days"
    ],
    "correct": 0,
    "explanation": "For community- acquired pneumonia (community-acquired pneumonia), the recommended duration is: 5 days for uncomplicated community-acquired pneumonia with resolution of fever, tachypnea, and supplemental oxygen requirement.",
    "category": "Respiratory",
    "conditionId": "community_acquired_pneumonia",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for retropharyngeal abscess in mild-moderate cases?",
    "options": [
      "Ampicillin/sulbactam OR Clindamycin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For retropharyngeal abscess (mild-moderate), the recommended therapy is: Ampicillin/sulbactam OR Clindamycin",
    "category": "Ear, Nose, and Throat",
    "conditionId": "retropharyngeal_abscess",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing suspected urinary tract infection?",
    "options": [
      "Escherichia coli",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Escherichia coli is a common pathogen causing suspected urinary tract infection.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "neonatal_fever_term_neonates",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing acute otitis media?",
    "options": [
      "Streptococcus pneumoniae",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pneumoniae is a common pathogen causing acute otitis media.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_otitis_media",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing cellulitis (nonpurulent)?",
    "options": [
      "Streptococcus pyogenes",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pyogenes is a common pathogen causing cellulitis (nonpurulent).",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "cellulitis_nonpurulent",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for acute sinusitis?",
    "options": [
      "Diagnosis of acute bacterial sinusitis requires the presence of one of the following criteria: (1) persistent nasal discharge or daytime cough without evidence of clinical improvement for \u226510 days; consider watchful waiting in this scenario (2) worsening or new onset of nasal discharge, daytime cough, or fever after initial improvement (3) temperature \u226539\u00b0C with purulent nasal discharge and/ or facial pain for at least 3 consecutive days.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Diagnosis of acute bacterial sinusitis requires the presence of one of the following criteria: (1) persistent nasal discharge or daytime cough without evidence of clinical improvement for \u226510 days; consider watchful waiting in this scenario (2) worsening or new onset of nasal discharge, daytime cough, or fever after initial improvement (3) temperature \u226539\u00b0C with purulent nasal discharge and/ or facial pain for at least 3 consecutive days. This is an important clinical consideration for acute sinusitis.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_sinusitis",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is a common pathogen causing septic arthritis?",
    "options": [
      "Staphylococcus aureus",
      "Enterococcus faecalis",
      "Streptococcus pneumoniae",
      "Haemophilus influenzae"
    ],
    "correct": 0,
    "explanation": "Staphylococcus aureus is a common pathogen causing septic arthritis.",
    "category": "Bone/Joint",
    "conditionId": "septic_arthritis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for purulent cellulitis/ abscess in mild-moderate cases?",
    "options": [
      "Cefazolin/cephalexin OR Trimethoprim-sulfamethoxazole OR Clindamycin OR Doxycycline",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For purulent cellulitis/ abscess (mild-moderate), the recommended therapy is: Cefazolin/cephalexin OR Trimethoprim-sulfamethoxazole OR Clindamycin OR Doxycycline",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "purulent_cellulitis_abscess",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for preseptal cellulitis (ie, nonsinus origin)?",
    "options": [
      "5-7 days",
      "3-5 days",
      "14-21 days",
      "10-14 days"
    ],
    "correct": 0,
    "explanation": "For preseptal cellulitis (ie, nonsinus origin), the recommended duration is: 5-7 days",
    "category": "Ophthalmologic",
    "conditionId": "preseptal_cellulitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for unclear source?",
    "options": [
      "Consider adding empiric acyclovir with surface, blood, and cerebrospinal fluid HSV sampling for infants at increased risk of HSV, including the presence of skin vesicles, seizures, cerebrospinal fluid pleocytosis with a negative Gram stain, leukopenia, hepatitis, thrombocytopenia, hypothermia, mucous membrane ulcers, or maternal history of genital HSV lesions or fever from 48 hours before to 48 hours after delivery. For further discussion of HSV, see Herpes Simplex (p 467).",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Consider adding empiric acyclovir with surface, blood, and cerebrospinal fluid HSV sampling for infants at increased risk of HSV, including the presence of skin vesicles, seizures, cerebrospinal fluid pleocytosis with a negative Gram stain, leukopenia, hepatitis, thrombocytopenia, hypothermia, mucous membrane ulcers, or maternal history of genital HSV lesions or fever from 48 hours before to 48 hours after delivery. For further discussion of HSV, see Herpes Simplex (p 467). This is an important clinical consideration for unclear source.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "unclear_source_neonatal_fever",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is an important clinical consideration for septic arthritis?",
    "options": [
      "Kingella not effectively treated by clindamycin and not reliably susceptible to oxacillin/nafcillin.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Kingella not effectively treated by clindamycin and not reliably susceptible to oxacillin/nafcillin. This is an important clinical consideration for septic arthritis.",
    "category": "Bone/Joint",
    "conditionId": "septic_arthritis",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is a common pathogen causing community- acquired pneumonia (community-acquired pneumonia)?",
    "options": [
      "Streptococcus pneumoniae",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pneumoniae is a common pathogen causing community- acquired pneumonia (community-acquired pneumonia).",
    "category": "Respiratory",
    "conditionId": "community_acquired_pneumonia",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing mastoiditis?",
    "options": [
      "Streptococcus pneumoniae",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pneumoniae is a common pathogen causing mastoiditis.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "mastoiditis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for meningitis (non- neonates) in standard treatment cases?",
    "options": [
      "Ceftriaxone PLUS Vancomycin",
      "Cefazolin OR Oxacillin",
      "Ampicillin PLUS Gentamicin",
      "Piperacillin-tazobactam"
    ],
    "correct": 0,
    "explanation": "For meningitis (non- neonates) (standard treatment), the recommended therapy is: Ceftriaxone PLUS Vancomycin",
    "category": "Central Nervous System",
    "conditionId": "meningitis_non_neonates",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for lymphadenitis?",
    "options": [
      "5-7 days.",
      "3-5 days",
      "14-21 days",
      "7-10 days"
    ],
    "correct": 0,
    "explanation": "For lymphadenitis, the recommended duration is: 5-7 days.",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "lymphadenitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing streptococcal pharyngitis?",
    "options": [
      "Streptococcus pyogenes",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pyogenes is a common pathogen causing streptococcal pharyngitis.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "streptococcal_pharyngitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for cellulitis (nonpurulent) in severe cases?",
    "options": [
      "Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For cellulitis (nonpurulent) (severe), the recommended therapy is: Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "cellulitis_nonpurulent",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for acute sinusitis?",
    "options": [
      "5-7 days",
      "10-14 days",
      "14-21 days",
      "6-8 weeks"
    ],
    "correct": 0,
    "explanation": "For acute sinusitis, the recommended duration is: 5-7 days",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_sinusitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for acute otitis media in standard cases?",
    "options": [
      "Amoxicillin OR Amoxicillin- clavulanate",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For acute otitis media (standard), the recommended therapy is: Amoxicillin OR Amoxicillin- clavulanate",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_otitis_media",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing suspected meningitis?",
    "options": [
      "Group B Streptococcus",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Group B Streptococcus is a common pathogen causing suspected meningitis.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "suspected_meningitis_neonatal_fever",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for acute sinusitis in allergy cases?",
    "options": [
      "Clindamycin OR Levofloxacin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For acute sinusitis (allergy), the recommended therapy is: Clindamycin OR Levofloxacin",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_sinusitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for lymphadenitis?",
    "options": [
      "For management of NTM or Bartonella infection, please see those chapters (p 920 and p 263).",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "For management of NTM or Bartonella infection, please see those chapters (p 920 and p 263). This is an important clinical consideration for lymphadenitis.",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "lymphadenitis",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for orbital cellulitis?",
    "options": [
      "10-14 days.",
      "6-8 weeks",
      "3-5 days",
      "2-3 weeks"
    ],
    "correct": 0,
    "explanation": "For orbital cellulitis, the recommended duration is: 10-14 days.",
    "category": "Ophthalmologic",
    "conditionId": "orbital_cellulitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing acute sinusitis?",
    "options": [
      "Streptococcus pneumoniae",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pneumoniae is a common pathogen causing acute sinusitis.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_sinusitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for unclear source in neonates 0-7 days of age cases?",
    "options": [
      "Ampicillin PLUS Gentamicin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For unclear source (neonates 0-7 days of age), the recommended therapy is: Ampicillin PLUS Gentamicin",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "unclear_source_neonatal_fever",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing retropharyngeal abscess?",
    "options": [
      "Streptococcus pyogenes",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Streptococcus pyogenes is a common pathogen causing retropharyngeal abscess.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "retropharyngeal_abscess",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for preseptal cellulitis (ie, nonsinus origin) in severe cases?",
    "options": [
      "Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For preseptal cellulitis (ie, nonsinus origin) (severe), the recommended therapy is: Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
    "category": "Ophthalmologic",
    "conditionId": "preseptal_cellulitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for intra-abdominal infection?",
    "options": [
      "4-7 days (from source control)",
      "2-3 weeks",
      "6-8 weeks",
      "5-7 days"
    ],
    "correct": 0,
    "explanation": "For intra-abdominal infection, the recommended duration is: 4-7 days (from source control)",
    "category": "Intra-abdominal",
    "conditionId": "intra_abdominal_infection",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing meningitis (non- neonates)?",
    "options": [
      "Streptococcus pneumoniae",
      "Staphylococcus aureus",
      "Enterococcus faecalis",
      "Escherichia coli"
    ],
    "correct": 0,
    "explanation": "Streptococcus pneumoniae is a common pathogen causing meningitis (non- neonates).",
    "category": "Central Nervous System",
    "conditionId": "meningitis_non_neonates",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for purulent cellulitis/ abscess?",
    "options": [
      "Conversion to oral antibiotic therapy after transient Staphylococcus aureus bacteremia with source control is appropriate but might warrant more prolonged therapy.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Conversion to oral antibiotic therapy after transient Staphylococcus aureus bacteremia with source control is appropriate but might warrant more prolonged therapy. This is an important clinical consideration for purulent cellulitis/ abscess.",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "purulent_cellulitis_abscess",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is an important clinical consideration for streptococcal pharyngitis?",
    "options": [
      "Management of recurrent Group A Streptococcus pharyngitis and pharyngeal carriers is detailed in Group A Streptococcal Infections (p 785).",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Management of recurrent Group A Streptococcus pharyngitis and pharyngeal carriers is detailed in Group A Streptococcal Infections (p 785). This is an important clinical consideration for streptococcal pharyngitis.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "streptococcal_pharyngitis",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is an important clinical consideration for urinary tract infection - pyelonephritis?",
    "options": [
      "Drug selection should be based on local antibiogram or patient's prior urine isolates.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Drug selection should be based on local antibiogram or patient's prior urine isolates. This is an important clinical consideration for urinary tract infection - pyelonephritis.",
    "category": "Genitourinary",
    "conditionId": "uti_pyelonephritis",
    "difficulty": "intermediate"
  },
  {
    "question": "Which of the following is an important clinical consideration for retropharyngeal abscess?",
    "options": [
      "Longer duration of therapy may be required for complex infections with insufficient source control.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Longer duration of therapy may be required for complex infections with insufficient source control. This is an important clinical consideration for retropharyngeal abscess.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "retropharyngeal_abscess",
    "difficulty": "advanced"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for suspected urinary tract infection in standard treatment cases?",
    "options": [
      "Ampicillin PLUS Gentamicin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For suspected urinary tract infection (standard treatment), the recommended therapy is: Ampicillin PLUS Gentamicin",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "neonatal_fever_term_neonates",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is an important clinical consideration for preseptal cellulitis (ie, nonsinus origin)?",
    "options": [
      "Switch to oral with 24 hours improvement in fever, swelling, and erythema.",
      "Patients should complete the full course of antibiotics even if feeling better",
      "Blood cultures are not necessary in uncomplicated cases",
      "Oral antibiotics are always preferred over intravenous antibiotics"
    ],
    "correct": 0,
    "explanation": "Switch to oral with 24 hours improvement in fever, swelling, and erythema. This is an important clinical consideration for preseptal cellulitis (ie, nonsinus origin).",
    "category": "Ophthalmologic",
    "conditionId": "preseptal_cellulitis",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for lymphadenitis in allergy cases?",
    "options": [
      "Clindamycin",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For lymphadenitis (allergy), the recommended therapy is: Clindamycin",
    "category": "Skin and Soft Tissue Infections",
    "conditionId": "lymphadenitis",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for suspected urinary tract infection?",
    "options": [
      "These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture results.",
      "10-14 days",
      "3-5 days",
      "6-8 weeks"
    ],
    "correct": 0,
    "explanation": "For suspected urinary tract infection, the recommended duration is: These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture results.",
    "category": "Neonatal Fever (Term Neonates)",
    "conditionId": "neonatal_fever_term_neonates",
    "difficulty": "intermediate"
  },
  {
    "question": "What is the recommended duration of antibiotic therapy for acute otitis media?",
    "options": [
      ">6 y: 5 days.",
      "3-4 weeks",
      "5-7 days",
      "10-14 days"
    ],
    "correct": 0,
    "explanation": "For acute otitis media, the recommended duration is: >6 y: 5 days.",
    "category": "Ear, Nose, and Throat",
    "conditionId": "acute_otitis_media",
    "difficulty": "beginner"
  },
  {
    "question": "What is the recommended empiric antibiotic therapy for intra-abdominal infection in drainage cases?",
    "options": [
      "Piperacillin-tazobactam",
      "Amoxicillin-clavulanate",
      "Ciprofloxacin",
      "Azithromycin"
    ],
    "correct": 0,
    "explanation": "For intra-abdominal infection with drainage, piperacillin-tazobactam is the recommended empiric therapy. This broad-spectrum beta-lactam/beta-lactamase inhibitor combination provides excellent coverage against gram-negative bacilli, anaerobes, and many gram-positive organisms commonly found in intra-abdominal infections. The drainage component indicates a complex infection requiring robust antimicrobial coverage.",
    "category": "Intra-abdominal",
    "conditionId": "intra_abdominal_infection",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing orbital cellulitis?",
    "options": [
      "Staphylococcus aureus",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Staphylococcus aureus is a common pathogen causing orbital cellulitis.",
    "category": "Ophthalmologic",
    "conditionId": "orbital_cellulitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing osteomyelitis?",
    "options": [
      "Staphylococcus aureus",
      "Enterococcus faecalis",
      "Streptococcus pneumoniae",
      "Haemophilus influenzae"
    ],
    "correct": 0,
    "explanation": "Staphylococcus aureus is the most common pathogen causing osteomyelitis, particularly in adults and children. This gram-positive cocci has a particular affinity for bone tissue and can cause both acute and chronic osteomyelitis. S. aureus produces various virulence factors including adhesins that allow it to bind to bone matrix, and toxins that cause bone destruction. Both methicillin-sensitive (MSSA) and methicillin-resistant (MRSA) strains can cause osteomyelitis.",
    "category": "Bone/Joint",
    "conditionId": "osteomyelitis",
    "difficulty": "beginner"
  },
  {
    "question": "Which of the following is a common pathogen causing intra-abdominal infection?",
    "options": [
      "Escherichia coli",
      "Candida albicans",
      "Mycobacterium tuberculosis",
      "Clostridium difficile"
    ],
    "correct": 0,
    "explanation": "Escherichia coli is a common pathogen causing intra-abdominal infection.",
    "category": "Intra-abdominal",
    "conditionId": "intra_abdominal_infection",
    "difficulty": "beginner"
  }
];

export default quizQuestionsWithDifficulty;
