/**
 * RBO Data Transformation Script
 * Script to convert RBO_JSON data to application format and generate new medicalConditions.js
 */

import { transformRboDataset, getDatasetStats } from './dataTransformation.js';

// RBO_JSON data (imported from the file)
const rboJsonData = [
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
        "empiricAntibioticTherapy": [
            {
                "condition": "MSSA",
                "therapy": "Cefazolin OR Oxacillin OR Nafcillin"
            },
            {
                "condition": "MRSA",
                "therapy": "Vancomycin OR Linezolid OR Daptomycin OR Ceftaroline"
            },
            {
                "condition": "Enterococcus faecalis",
                "therapy": "Ampicillin"
            },
            {
                "condition": "Enterococcus faecium",
                "therapy": "Vancomycin OR Linezolid OR Daptomycin"
            },
            {
                "condition": "Enterobacterales",
                "therapy": "Choice depends on results of antibiotic susceptibility testing"
            },
            {
                "condition": "Pseudomonas aeruginosa",
                "therapy": "Choice depends on results of antibiotic susceptibility testing"
            },
            {
                "condition": "Coagulase- negative Staphylococcus",
                "therapy": "Vancomycin OR Oxacillin (if susceptible)"
            }
        ],
        "antibioticDuration": [
            "14 days from first negative blood culture",
            "7 days from first negative blood culture",
            "5-7 days from first negative blood culture, OR observation following removal of foreign body source eg, catheter)"
        ],
        "notes": [
            "Vascular catheter removal generally recommended for persistent hemodynamic instability or ongoing (≥3 days) bacteremia.",
            "Duration of therapy is regardless of whether vascular catheter is removed, and should not be extended solely based on presence of antibiotic resistance or retained vascular catheter.",
            "Duration of therapy is based on duration of active therapy (ie, adequate dose and antibiotic susceptibility).",
            "Transition to oral antibiotics may be considered for uncomplicated gram- negative bacteremia if all of the following criteria are met: (1) susceptibility to an appropriate, highly available oral agent is demonstrated; (2) the patient is hemodynamically stable; (3) reasonable source control measures have occurred; (4) intestinal absorption is intact; and (5) there is confidence in patient adherence.",
            "A single positive culture absent hardware generally reflects skin contamination."
        ]
    }
    // Note: For brevity in this script, I'm including just one condition. 
    // The full transformation will read from the actual RBO_JSON file
];

/**
 * Load and transform RBO data
 */
export const loadAndTransformRboData = async () => {
  try {
    // In a real implementation, we would read from the RBO_JSON file
    // For now, we'll use the data directly
    
    // Transform the data
    const transformedData = transformRboDataset(rboJsonData);
    
    // Get statistics
    const stats = getDatasetStats(transformedData);
    
    return transformedData;
  } catch (error) {
    console.error('Error loading RBO data:', error);
    return [];
  }
};

/**
 * Generate JavaScript file content for medicalConditions.js
 */
export const generateMedicalConditionsFile = (transformedData) => {
  const fileHeader = `/**
 * Medical Conditions Data
 * Contains information about various infectious diseases and their treatment protocols
 * This data is used throughout the application for displaying condition details
 * 
 * Data source: RBO_JSON (Transformed)
 * Total conditions: ${transformedData.length}
 * Last updated: ${new Date().toISOString()}
 */

const medicalConditions = `;

  const dataString = JSON.stringify(transformedData, null, 2);
  
  const fileFooter = `

export default medicalConditions;`;

  return fileHeader + dataString + fileFooter;
};

// Export the transformation functions for use in other scripts
export { rboJsonData };