/**
 * Medical Conditions Data
 * Contains information about various infectious diseases and their treatment protocols
 * This data is used throughout the application for displaying condition details
 *
 * Data source: RBO_JSON (Transformed)
 * Total conditions: 20
 * Categories: Bloodstream Infection in Nonneonates, Bone/Joint, Central Nervous System, Ear, Nose, and Throat, Genitourinary, Intra-abdominal, Neonatal Fever (Term Neonates), Ophthalmologic, Respiratory, Skin and Soft Tissue Infections
 * Last updated: 2025-06-28T11:41:50.755Z
 */

import { MedicalCondition } from '../types/medical.types';

const medicalConditions: MedicalCondition[] = [
  {
    "id": "uncomplicated_bloodstream_infection_nonneonates",
    "category": "Bloodstream Infection in Nonneonates",
    "name": "Uncomplicated Bloodstream Infection",
    "description": "Defined by ≤3 days bacteremia in nonneutropenic host without complex source (eg, endocarditis, septic thrombophlebitis, osteomyelitis) or ongoing undrained purulent focus. Common sources include vascular catheter- associated infection, urinary tract infection, intra- abdominal infection, pneumonia, skin/soft tissue infection.",
    "commonPathogens": [
      "Staphylococcus aureus",
      "Enterococcus faecalis",
      "Enterococcus faecium",
      "Enterobacterales (eg, Escherichia coli, Klebsiella species, Enterobacter species)",
      "Pseudomonas aeruginosa",
      "Coagulase- negative Staphylococcus (not including Staphylococcus Lugdunensis, which should be managed like S aureus)"
    ],
    "empiricTherapy": {
      "MSSA": "Cefazolin OR Oxacillin OR Nafcillin",
      "MRSA": "Vancomycin OR Linezolid OR Daptomycin OR Ceftaroline",
      "Enterococcus faecalis": "Ampicillin",
      "Enterococcus faecium": "Vancomycin OR Linezolid OR Daptomycin",
      "Enterobacterales": "Choice depends on results of antibiotic susceptibility testing",
      "Pseudomonas aeruginosa": "Choice depends on results of antibiotic susceptibility testing",
      "Coagulase- negative Staphylococcus": "Vancomycin OR Oxacillin (if susceptible)"
    },
    "duration": "14 days from first negative blood culture",
    "keyPoints": [
      "Duration of therapy is regardless of whether vascular catheter is removed, and should not be extended solely based on presence of antibiotic resistance or retained vascular catheter.",
      "Duration of therapy is regardless of whether vascular catheter is removed, and should not be extended solely based on presence of antibiotic resistance or retained vascular catheter.",
      "Duration of therapy is based on duration of active therapy (ie, adequate dose and antibiotic susceptibility).",
      "A single positive culture absent hardware generally reflects skin contamination."
    ],
    "clinicalPearls": [
      "Vascular catheter removal generally recommended for persistent hemodynamic instability or ongoing (≥3 days) bacteremia.",
      "Vascular catheter removal generally recommended for persistent hemodynamic instability or ongoing (≥3 days) bacteremia.",
      "Transition to oral antibiotics may be considered for uncomplicated gram- negative bacteremia if all of the following criteria are met: (1) susceptibility to an appropriate, highly available oral agent is demonstrated; (2) the patient is hemodynamically stable; (3) reasonable source control measures have occurred; (4) intestinal absorption is intact; and (5) there is confidence in patient adherence.",
      "Observational studies: Sutton et al⁴, Punjabi et al, Tamma et al, Heil et al, Mponponsuo et al, Tamma et al"
    ]
  },
  {
    "id": "osteomyelitis",
    "category": "Bone/Joint",
    "name": "Osteomyelitis",
    "description": "Infection of bone tissue, most commonly caused by Staphylococcus aureus. Can occur via hematogenous spread, direct inoculation, or contiguous spread from adjacent soft tissue infection. In children, particularly affects long bone metaphyses.",
    "commonPathogens": [
      "Staphylococcus aureus (including MRSA)",
      "Streptococcus species",
      "Streptococcus pyogenes",
      "Kingella kingae"
    ],
    "empiricTherapy": {
      "Mild": "Cefazolin OR Oxacillin OR Nafcillin",
      "Moderate/Severe and low suspicion of MRSA": "Cefazolin OR Oxacillin OR Nafcillin",
      "Severe and high suspicion of MRSA": "Vancomycin OR Clindamycin OR Linezolid OR Daptomycin"
    },
    "duration": "3-4 wk.",
    "keyPoints": [
      "Kingella infection not effectively treated by clindamycin and not reliably susceptible to oxacillin/ nafcillin."
    ],
    "clinicalPearls": [
      "Early switch to oral route recommended with clinical improvement, even for patients with transient bacteremia.",
      "For empiric management of children with osteomyelitis and severe sepsis, combination therapy of vancomycin PLUS oxacillin/nafcillin can be considered."
    ]
  },
  {
    "id": "septic_arthritis",
    "category": "Bone/Joint",
    "name": "Septic arthritis",
    "description": "Bacterial infection of a joint space, constituting a medical emergency due to rapid cartilage destruction. Most commonly affects hip and knee joints in children. Kingella kingae is particularly important in children 6-48 months.",
    "commonPathogens": [
      "S aureus",
      "S pyogenes",
      "K kingae"
    ],
    "empiricTherapy": {
      "Mild-Moderate": "Cefazolin OR Oxacillin OR Nafcillin",
      "Severe and low suspicion of MRSA": "Cefazolin OR Oxacillin OR Nafcillin",
      "Severe and high suspicion of MRSA": "Vancomycin OR Clindamycin OR Linezolid OR Daptomycin"
    },
    "duration": "2-3 wk",
    "keyPoints": [
      "Kingella not effectively treated by clindamycin and not reliably susceptible to oxacillin/nafcillin."
    ],
    "clinicalPearls": [
      "Early switch to oral route recommended with clinical improvement, even for patients with transient bacteremia."
    ]
  },
  {
    "id": "meningitis_non_neonates",
    "category": "Central Nervous System",
    "name": "Meningitis (non- neonates)",
    "description": "Inflammation of the meninges caused by bacterial infection. A medical emergency requiring immediate antibiotic therapy. Clinical presentation includes fever, headache, neck stiffness, and altered mental status. Lumbar puncture is diagnostic when not contraindicated.",
    "commonPathogens": [
      "Streptococcus pneumoniae",
      "Neisseria meningitidis",
      "Haemophilus influenzae"
    ],
    "empiricTherapy": {
      "Standard Treatment": "Ceftriaxone PLUS Vancomycin"
    },
    "duration": "These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture and susceptibility results.",
    "keyPoints": [
      "Longer courses are necessary for patients with parenchymal brain infection (cerebritis, rhombencephalitis, brain abscess).",
      "Dexamethasone is beneficial for treatment of infants and children with Hib meningitis to diminish the risk of hearing loss, if administered before or concurrently with the first dose of antimicrobial agent(s).",
      "For all children with bacterial meningitis presumed to be caused by S pneumoniae, vancomycin should be administered in addition to ceftriaxone because of the possibility of resistant S pneumoniae."
    ],
    "clinicalPearls": [
      "Consider adding acyclovir for patients with concurrent encephalitis."
    ]
  },
  {
    "id": "mastoiditis",
    "category": "Ear, Nose, and Throat",
    "name": "Mastoiditis",
    "description": "",
    "commonPathogens": [
      "S pneumoniae",
      "S pyogenes",
      "S aureus",
      "H influenzae",
      "Microaerophilic streptococci",
      "Fusobacterium",
      "P aeruginosa"
    ],
    "empiricTherapy": {
      "Standard": "Consider surgical drainage/excision. Ampicillin- sulbactam OR Ceftriaxone.",
      "Allergy": "Clindamycin",
      "If follows chronic AOM": "Cefepime OR Levofloxacin",
      "Standard Treatment": "Consider MRSA based on local prevalence"
    },
    "duration": "2-4 wk depending on adequate débridement, intracranial extension, extent of osteomyelitis, associated thrombosis",
    "keyPoints": [
      "Transition to oral with clinical improvement."
    ],
    "clinicalPearls": [
      "Ampicillin-sulbactam may not be optimal for intracranial infections."
    ]
  },
  {
    "id": "acute_sinusitis",
    "category": "Ear, Nose, and Throat",
    "name": "Acute sinusitis",
    "description": "",
    "commonPathogens": [
      "S pneumoniae",
      "H influenzae",
      "Moraxella catarrhalis"
    ],
    "empiricTherapy": {
      "Standard": "Amoxicillin OR Amoxicillin- clavulanate",
      "Allergy": "Clindamycin OR Levofloxacin"
    },
    "duration": "5-7 days",
    "keyPoints": [
      "Diagnosis of acute bacterial sinusitis requires the presence of one of the following criteria: (1) persistent nasal discharge or daytime cough without evidence of clinical improvement for ≥10 days; consider watchful waiting in this scenario (2) worsening or new onset of nasal discharge, daytime cough, or fever after initial improvement (3) temperature ≥39°C with purulent nasal discharge and/ or facial pain for at least 3 consecutive days."
    ],
    "clinicalPearls": []
  },
  {
    "id": "acute_otitis_media",
    "category": "Ear, Nose, and Throat",
    "name": "Acute otitis media",
    "description": "",
    "commonPathogens": [
      "S pneumoniae",
      "H influenzae",
      "M catarrhalis"
    ],
    "empiricTherapy": {
      "Standard": "Amoxicillin OR Amoxicillin- clavulanate",
      "Allergy": "Cefdinir OR Cefpodoxime OR Cefuroxime OR Ceftriaxone for 1 (first occurrence) to 3 (treatment failure) days"
    },
    "duration": ">6 y: 5 days.",
    "keyPoints": [],
    "clinicalPearls": [
      "Consider observation without antibiotics for 48-72 hours for children 24 months or older without severe symptoms; if symptoms persist or worsen, use same antibiotic recommendations as for those receiving immediate therapy.",
      "Consider S aureus and Pseudomonas infection for chronic otitis media."
    ]
  },
  {
    "id": "streptococcal_pharyngitis",
    "category": "Ear, Nose, and Throat",
    "name": "Streptococcal pharyngitis",
    "description": "",
    "commonPathogens": [
      "S pyogenes"
    ],
    "empiricTherapy": {
      "First line": "Penicillin OR Amoxicillin",
      "Allergy": "Cephalexin OR Clindamycin OR Azithromycin"
    },
    "duration": "10 days",
    "keyPoints": [
      "Management of recurrent GAS pharyngitis and pharyngeal carriers is detailed in Group A Streptococcal Infections (p 785).",
      "Tetracyclines, TMP-SMX, and fluoroquinolones should not be used for treating GAS pharyngitis.",
      "Return to school after afebrile and ≥12 h of antibiotic therapy."
    ],
    "clinicalPearls": [
      "Children with rhinorrhea, cough, hoarseness, or oral ulcers should not be tested or treated for GAS infection; testing also generally is not recommended for children <3 y."
    ]
  },
  {
    "id": "retropharyngeal_abscess",
    "category": "Ear, Nose, and Throat",
    "name": "Retropharyngeal abscess",
    "description": "",
    "commonPathogens": [
      "S pyogenes",
      "Anaerobes",
      "S aureus",
      "Streptococcus anginosus",
      "H influenzae (often polymicrobial)"
    ],
    "empiricTherapy": {
      "Mild-moderate": "Ampicillin/sulbactam OR Clindamycin",
      "Severe": "Ampicillin/sulbactam PLUS EITHER Vancomycin OR Linezolid"
    },
    "duration": "14 days",
    "keyPoints": [],
    "clinicalPearls": [
      "Longer duration of therapy may be required for complex infections with insufficient source control."
    ]
  },
  {
    "id": "uti_pyelonephritis",
    "category": "Genitourinary",
    "name": "UTI - pyelonephritis",
    "description": "Upper urinary tract infection involving the renal parenchyma and collecting system. Clinical presentation includes fever, flank pain, dysuria, and urinary frequency. Urine culture is essential for diagnosis and antibiotic selection.",
    "commonPathogens": [
      "E coli",
      "Klebsiella species",
      "Proteus species",
      "Enterobacter species",
      "Citrobacter species",
      "Enterococcus species",
      "Staphylococcus saprophyticus"
    ],
    "empiricTherapy": {
      "Standard Treatment": "Cephalexin OR TMP-SMX OR Ampicillin PLUS Gentamicin OR Ceftriaxone OR Ciprofloxacin"
    },
    "duration": "7-10 days (hospitalized).",
    "keyPoints": [
      "Drug selection should be based on local antibiogram or patient's prior urine isolates.",
      "Initial short course of IV therapy (2-4 days) is as effective as longer courses of IV therapy.",
      "Avoid nitrofurantoin for upper urinary tract infection or bacteremia."
    ],
    "clinicalPearls": []
  },
  {
    "id": "intra_abdominal_infection",
    "category": "Intra-abdominal",
    "name": "Intra-abdominal infection",
    "description": "",
    "commonPathogens": [
      "E coli",
      "Anaerobes",
      "Klebsiella species (often polymicrobial)"
    ],
    "empiricTherapy": {
      "Drainage": "",
      "Mild-moderate": "Ceftriaxone PLUS Metronidazole",
      "Severe or hospital onset": "Piperacillin- tazobactam OR Ciprofloxacin PLUS Metronidazole"
    },
    "duration": "4-7 days (from source control)",
    "keyPoints": [
      "May need longer duration if insufficient source control.",
      "Mild-moderate infection includes complicated appendicitis with rupture, absent sepsis."
    ],
    "clinicalPearls": []
  },
  {
    "id": "neonatal_fever_term_neonates",
    "category": "Neonatal Fever (Term Neonates)",
    "name": "Suspected UTI",
    "description": "",
    "commonPathogens": [
      "E coli",
      "Enterococcus species",
      "GBS"
    ],
    "empiricTherapy": {
      "Standard Treatment": "Ampicillin PLUS Gentamicin"
    },
    "duration": "These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture results.",
    "keyPoints": [],
    "clinicalPearls": []
  },
  {
    "id": "unclear_source_neonatal_fever",
    "category": "Neonatal Fever (Term Neonates)",
    "name": "Unclear source",
    "description": "",
    "commonPathogens": [
      "GBS",
      "E coli",
      "HSV"
    ],
    "empiricTherapy": {
      "Neonates 0-7 days of age": "Ampicillin PLUS Gentamicin",
      "Neonates 8-28 days of age": "Ampicillin PLUS Gentamicin OR Ampicillin PLUS Cefotaxime (Ceftazidime or Cefepime if Cefotaxime not available)"
    },
    "duration": "These are empiric recommendations: specific choice and duration of antibiotic therapy should be guided by culture results.",
    "keyPoints": [],
    "clinicalPearls": [
      "Consider adding empiric acyclovir with surface, blood, and CSF HSV sampling for infants at increased risk of HSV, including the presence of skin vesicles, seizures, CSF pleocytosis with a negative Gram stain, leukopenia, hepatitis, thrombocytopenia, hypothermia, mucous membrane ulcers, or maternal history of genital HSV lesions or fever from 48 hours before to 48 hours after delivery. For further discussion of HSV, see Herpes Simplex (p 467)."
    ]
  },
  {
    "id": "suspected_meningitis_neonatal_fever",
    "category": "Neonatal Fever (Term Neonates)",
    "name": "Suspected meningitis",
    "description": "",
    "commonPathogens": [
      "GBS",
      "E coli",
      "HSV"
    ],
    "empiricTherapy": {
      "Neonates 0-7 days of age": "Ampicillin PLUS Gentamicin (some experts will add a third or fourth generation cephalosporin if the cerebrospinal fluid gram stain shows gram-negative organisms)",
      "Neonates 8-28 days of age": "Ampicillin PLUS Cefotaxime (Ceftazidime or Cefepime if Cefotaxime not available) (some experts will add an aminoglycoside if the cerebrospinal fluid Gram stain shows gram-negative organisms)"
    },
    "duration": "These are empiric recommendations; specific choice and duration of antibiotic therapy should be guided by culture results.",
    "keyPoints": [
      "Some experts suggest repeat lumbar puncture to document CSF sterility."
    ],
    "clinicalPearls": [
      "Consider adding empiric acyclovir with surface, blood, and CSF HSV sampling for infants at increased risk of HSV, including the presence of skin vesicles, seizures, CSF pleocytosis with a negative Gram stain, leukopenia, hepatitis, thrombocytopenia, hypothermia, mucous membrane ulcers, or maternal history of genital HSV lesions or fever from 48 hours before to 48 hours after delivery. For further discussion of HSV, see Herpes Simplex (p 467)."
    ]
  },
  {
    "id": "preseptal_cellulitis",
    "category": "Ophthalmologic",
    "name": "Preseptal cellulitis (ie, nonsinus origin)",
    "description": "",
    "commonPathogens": [
      "S pyogenes",
      "S aureus"
    ],
    "empiricTherapy": {
      "Mild-moderate": "Cefazolin OR Cephalexin (Allergyb: Clindamycin)",
      "Severe": "Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin"
    },
    "duration": "5-7 days",
    "keyPoints": [
      "Switch to oral with 24 hours improvement in fever, swelling, and erythema."
    ],
    "clinicalPearls": [
      "Consider empiric MRSA coverage if high local MRSA rates."
    ]
  },
  {
    "id": "orbital_cellulitis",
    "category": "Ophthalmologic",
    "name": "Orbital cellulitis",
    "description": "",
    "commonPathogens": [
      "S aureus",
      "S pneumoniae",
      "Anaerobes",
      "S anginosus",
      "H influenzae",
      "M catarrhalis",
      "S pyogenes"
    ],
    "empiricTherapy": {
      "If abscess": "Surgical drainage. Ampicillin/ sulbactam (Allergyb: Clindamycin)",
      "Severe": "Add Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin"
    },
    "duration": "10-14 days.",
    "keyPoints": [],
    "clinicalPearls": [
      "Consider empiric MRSA coverage if high local MRSA rates."
    ]
  },
  {
    "id": "community_acquired_pneumonia",
    "category": "Respiratory",
    "name": "Community- acquired pneumonia (CAP)",
    "description": "Lower respiratory tract infection acquired outside the hospital setting. Clinical presentation includes fever, cough, shortness of breath, and chest pain. Chest X-ray typically shows infiltrates. Treatment should cover typical and atypical organisms.",
    "commonPathogens": [
      "S pneumoniae",
      "Mycoplasma pneumoniae",
      "S pyogenes",
      "S aureus",
      "H influenzae",
      "M catarrhalis",
      "Respiratory viruses, including influenza virus, adenovirus, parainfluenza virus, respiratory syncytial virus, coronaviruses, human metapneumovirus"
    ],
    "empiricTherapy": {
      "For fully immunized patients in regions without high prevalence of PCN-resistant pneumococcus": "Amoxicillin OR Ampicillin OR Penicillin",
      "Allergy": "Clindamycin OR Levofloxacin",
      "For hospitalized patients in regions with high levels PCN-resistant pneumococcus": "Ceftriaxone",
      "If atypical pathogen (eg, Mycoplasma or Chlamydia species) suspected": "Add macrolide",
      "If MRSA suspected": "Add Vancomycin OR Clindamycin OR Linezolid"
    },
    "duration": "5 days for uncomplicated CAP with resolution of fever, tachypnea, and supplemental oxygen requirement.",
    "keyPoints": [
      "Early switch to oral route encouraged when tolerated.",
      "Transient S pneumoniae bacteremia in otherwise uncomplicated pneumonia does not warrant prolonged or IV antibiotic therapy."
    ],
    "clinicalPearls": [
      "Respiratory viruses cause the majority of CAP, especially in young children; thus, antibiotic therapy may not be indicated for all patients.",
      "Consider S aureus superinfection in patients with influenza."
    ]
  },
  {
    "id": "cellulitis_nonpurulent",
    "category": "Skin and Soft Tissue Infections",
    "name": "Cellulitis (nonpurulent)",
    "description": "Acute bacterial infection of the skin and subcutaneous tissues without purulent drainage. Characterized by erythema, warmth, swelling, and tenderness. Most commonly affects the lower extremities in adults and face in children.",
    "commonPathogens": [
      "S pyogenes",
      "S aureus"
    ],
    "empiricTherapy": {
      "Mild-moderate": "Cefazolin OR Oxacillin/nafcillin OR Cephalexin",
      "Allergy": "Clindamycin OR TMP/SMX OR Doxycycline",
      "Severe": "Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
      "Necrotizing fasciitis": "Surgical débridement. B-lactam PLUS Clindamycin (+/- Vancomycin)"
    },
    "duration": "5-7 days.",
    "keyPoints": [
      "For bite wounds, see p 202.",
      "For severe infections, consider coverage of MRSA based on local prevalence."
    ],
    "clinicalPearls": [
      "Necrotizing fasciitis may require gram-negative or anaerobic coverage in the correct clinical scenario."
    ]
  },
  {
    "id": "purulent_cellulitis_abscess",
    "category": "Skin and Soft Tissue Infections",
    "name": "Purulent cellulitis/ Abscess",
    "description": "",
    "commonPathogens": [
      "S aureus"
    ],
    "empiricTherapy": {
      "Standard": "Drainage",
      "Mild-moderate": "Cefazolin/cephalexin OR TMP/SMX OR Clindamycin OR Doxycycline",
      "Severe": "Vancomycin OR Linezolid OR Ceftaroline OR Daptomycin",
      "Standard Treatment": "Consider MRSA based on local prevalence"
    },
    "duration": "5-7 days.",
    "keyPoints": [
      "Conversion to oral antibiotic therapy after transient S aureus bacteremia with source control is appropriate but might warrant more prolonged therapy."
    ],
    "clinicalPearls": []
  },
  {
    "id": "lymphadenitis",
    "category": "Skin and Soft Tissue Infections",
    "name": "Lymphadenitis",
    "description": "",
    "commonPathogens": [
      "S pyogenes",
      "S aureus",
      "Bartonella species",
      "Nontuberculous mycobacteria (NTM)"
    ],
    "empiricTherapy": {
      "For acute/unilateral lymphadenitis": "Consider surgical drainage. Cefazolin/ Cephalexin",
      "Allergy": "Clindamycin",
      "Standard Treatment": "Consider MRSA based on local prevalence"
    },
    "duration": "5-7 days.",
    "keyPoints": [
      "For management of NTM or Bartonella infection, please see those chapters (p 920 and p 263).",
      "Bacterial adenitis is typically unilateral; bilateral disease is typically viral in etiology."
    ],
    "clinicalPearls": []
  }
];

export default medicalConditions;
