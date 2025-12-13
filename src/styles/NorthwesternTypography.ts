/**
 * Northwestern Medical Typography System
 *
 * Professional medical-grade typography optimized for clinical readability,
 * emergency access, and cross-platform medical education consistency.
 *
 * @version 1.0.0
 * @date 2025-08-18
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface TypographyProperties {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing?: string;
  textTransform?: string;
  color?: string;
  fontStyle?: string;
  textShadow?: string;
  usage?: string;
  [key: string]: string | number | boolean | undefined;
}

interface ContextTypography {
  primaryText: TypographyProperties;
  secondaryText: TypographyProperties;
  supportingText: TypographyProperties;
}

interface SegmentTypography {
  primary: TypographyProperties;
  secondary: TypographyProperties;
}

interface ResponsiveTypographyConfig {
  baseSize: string;
  scaleRatio: number;
  lineHeightMultiplier: number;
  context: string;
  typography: {
    emergency: TypographyProperties;
    primary: TypographyProperties;
    secondary: TypographyProperties;
    supporting: TypographyProperties;
  };
}

interface SegmentDescriptions {
  [key: string]: string;
}

interface AccessibilityConfig {
  screenReader: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
    letterSpacing: string;
    segmentDescriptions: SegmentDescriptions;
  };
  highContrast: {
    textColor: string;
    backgroundColor: string;
    borderColor: string;
    focusColor: string;
    fontWeightIncrease: number;
    letterSpacingIncrease: string;
    emergencyText: TypographyProperties;
  };
  dyslexiaFriendly: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    wordSpacing: string;
    textAlign: string;
    preferredColors: {
      text: string;
      background: string;
      accent: string;
    };
  };
}

// =============================================================================
// MEDICAL TYPOGRAPHY SCALE
// =============================================================================

export const MEDICAL_TYPOGRAPHY_SCALE: { [key: string]: TypographyProperties } = {
  emergency: {
    fontSize: '1.25rem',
    lineHeight: '1.625rem',
    fontWeight: '700',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: '#dc2626',
    usage: 'Critical alerts, emergency information, contraindications'
  },

  clinicalLg: {
    fontSize: '1.125rem',
    lineHeight: '1.5rem',
    fontWeight: '600',
    letterSpacing: '0.01em',
    color: '#1f2937',
    usage: 'Section headers, antibiotic names, primary clinical information'
  },

  clinical: {
    fontSize: '1rem',
    lineHeight: '1.375rem',
    fontWeight: '500',
    letterSpacing: '0.01em',
    color: '#374151',
    usage: 'Standard clinical text, descriptions, mechanism of action'
  },

  clinicalSm: {
    fontSize: '0.9rem',
    lineHeight: '1.25rem',
    fontWeight: '400',
    letterSpacing: '0.015em',
    color: '#4b5563',
    usage: 'Clinical details, coverage descriptions, side effects'
  },

  annotation: {
    fontSize: '0.8rem',
    lineHeight: '1.125rem',
    fontWeight: '400',
    letterSpacing: '0.025em',
    color: '#6b7280',
    usage: 'Dosage information, contraindications, drug interactions'
  },

  micro: {
    fontSize: '0.7rem',
    lineHeight: '1rem',
    fontWeight: '500',
    letterSpacing: '0.025em',
    color: '#6b7280',
    usage: 'References, footnotes, copyright, technical details'
  }
};

// =============================================================================
// CLINICAL CONTEXT TYPOGRAPHY
// =============================================================================

export const CLINICAL_CONTEXT_TYPOGRAPHY: { [key: string]: ContextTypography } = {
  emergency: {
    primaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.emergency,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    secondaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalLg,
      color: '#991b1b',
      fontWeight: '600'
    },
    supportingText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#7f1d1d'
    }
  },

  clinical: {
    primaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalLg,
      color: '#1f2937'
    },
    secondaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#374151'
    },
    supportingText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#4b5563'
    }
  },

  education: {
    primaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalLg,
      color: '#1e40af',
      fontWeight: '600'
    },
    secondaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#1f2937'
    },
    supportingText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#4b5563',
      fontStyle: 'italic'
    }
  },

  highContrast: {
    primaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalLg,
      color: '#000000',
      fontWeight: '700',
      textShadow: '0 0 1px rgba(255, 255, 255, 0.8)'
    },
    secondaryText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#1f2937',
      fontWeight: '600'
    },
    supportingText: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#374151',
      fontWeight: '500'
    }
  }
};

// =============================================================================
// NORTHWESTERN SEGMENT TEXT STYLING
// =============================================================================

export const NORTHWESTERN_SEGMENT_TYPOGRAPHY: { [key: string]: SegmentTypography } = {
  MRSA: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#9a3412',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#c2410c',
      fontWeight: '500'
    }
  },

  VRE_faecium: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#991b1b',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#b91c1c',
      fontWeight: '500'
    }
  },

  anaerobes: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#5b21b6',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#6b21a8',
      fontWeight: '500'
    }
  },

  atypicals: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#155e75',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#0891b2',
      fontWeight: '500'
    }
  },

  pseudomonas: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#92400e',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#b45309',
      fontWeight: '500'
    }
  },

  gramNegative: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#1d4ed8',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#2563eb',
      fontWeight: '500'
    }
  },

  MSSA: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#15803d',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#16a34a',
      fontWeight: '500'
    }
  },

  enterococcus_faecalis: {
    primary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinical,
      color: '#334155',
      fontWeight: '600'
    },
    secondary: {
      ...MEDICAL_TYPOGRAPHY_SCALE.clinicalSm,
      color: '#475569',
      fontWeight: '500'
    }
  }
};

// =============================================================================
// RESPONSIVE TYPOGRAPHY
// =============================================================================

export const RESPONSIVE_MEDICAL_TYPOGRAPHY: { [key: string]: ResponsiveTypographyConfig } = {
  small: {
    baseSize: '0.8rem',
    scaleRatio: 1.125,
    lineHeightMultiplier: 1.4,
    context: 'Emergency quick reference, clinical mobile apps',
    typography: {
      emergency: {
        fontSize: '1rem',
        lineHeight: '1.3rem',
        fontWeight: '700'
      },
      primary: {
        fontSize: '0.9rem',
        lineHeight: '1.2rem',
        fontWeight: '600'
      },
      secondary: {
        fontSize: '0.8rem',
        lineHeight: '1.1rem',
        fontWeight: '500'
      },
      supporting: {
        fontSize: '0.7rem',
        lineHeight: '1rem',
        fontWeight: '400'
      }
    }
  },

  medium: {
    baseSize: '0.9rem',
    scaleRatio: 1.2,
    lineHeightMultiplier: 1.375,
    context: 'Clinical tablets, nursing stations, bedside workflow',
    typography: {
      emergency: {
        fontSize: '1.125rem',
        lineHeight: '1.5rem',
        fontWeight: '700'
      },
      primary: {
        fontSize: '1rem',
        lineHeight: '1.375rem',
        fontWeight: '600'
      },
      secondary: {
        fontSize: '0.9rem',
        lineHeight: '1.25rem',
        fontWeight: '500'
      },
      supporting: {
        fontSize: '0.8rem',
        lineHeight: '1.125rem',
        fontWeight: '400'
      }
    }
  },

  large: {
    baseSize: '1rem',
    scaleRatio: 1.25,
    lineHeightMultiplier: 1.375,
    context: 'Clinical workstations, medical education, detailed analysis',
    typography: {
      emergency: MEDICAL_TYPOGRAPHY_SCALE.emergency,
      primary: MEDICAL_TYPOGRAPHY_SCALE.clinicalLg,
      secondary: MEDICAL_TYPOGRAPHY_SCALE.clinical,
      supporting: MEDICAL_TYPOGRAPHY_SCALE.clinicalSm
    }
  }
};

// =============================================================================
// ACCESSIBILITY TYPOGRAPHY ENHANCEMENTS
// =============================================================================

export const ACCESSIBILITY_TYPOGRAPHY: AccessibilityConfig = {
  screenReader: {
    fontSize: '1rem',
    lineHeight: '1.5',
    fontWeight: '400',
    letterSpacing: '0.01em',
    segmentDescriptions: {
      MRSA: 'MRSA: Methicillin-resistant Staphylococcus aureus. High-alert resistant pathogen.',
      VRE_faecium: 'VRE faecium: Vancomycin-resistant Enterococcus faecium. Critical pathogen with limited treatment options.',
      anaerobes: 'Anaerobes: Including Bacteroides and C. difficile. Specialized anaerobic coverage required.',
      atypicals: 'Atypicals: Legionella, Mycoplasma, Chlamydophila. Cannot be cultured on standard media.',
      pseudomonas: 'Pseudomonas aeruginosa: Opportunistic pathogen. Inherently resistant to many antibiotics.',
      gramNegative: 'Gram-negative bacteria: Including Enterobacteriaceae. Common broad-spectrum targets.',
      MSSA: 'MSSA: Methicillin-sensitive Staphylococcus aureus. Treatable with excellent outcomes.',
      enterococcus_faecalis: 'Enterococcus faecalis: Standard care pathogen with predictable susceptibility.'
    }
  },

  highContrast: {
    textColor: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    focusColor: '#0000ff',
    fontWeightIncrease: 100,
    letterSpacingIncrease: '0.01em',
    emergencyText: {
      color: '#ff0000',
      backgroundColor: '#ffffff',
      fontWeight: '800',
      textShadow: '0 0 2px rgba(0, 0, 0, 0.5)'
    }
  },

  dyslexiaFriendly: {
    fontFamily: 'OpenDyslexic, Inter, sans-serif',
    fontSize: '1.1rem',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    wordSpacing: '0.1em',
    textAlign: 'left',
    preferredColors: {
      text: '#2d3748',
      background: '#f7fafc',
      accent: '#3182ce'
    }
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const getContextualTypography = (context: string, level: string): TypographyProperties => {
  const contextConfig = CLINICAL_CONTEXT_TYPOGRAPHY[context];
  if (!contextConfig || !contextConfig[`${level}Text` as keyof ContextTypography]) {
    return CLINICAL_CONTEXT_TYPOGRAPHY.clinical.primaryText;
  }
  return contextConfig[`${level}Text` as keyof ContextTypography];
};

export const getSegmentTypography = (segmentKey: string, level: string = 'primary'): TypographyProperties => {
  const segmentConfig = NORTHWESTERN_SEGMENT_TYPOGRAPHY[segmentKey];
  if (!segmentConfig || !segmentConfig[level as keyof SegmentTypography]) {
    return MEDICAL_TYPOGRAPHY_SCALE.clinical;
  }
  return segmentConfig[level as keyof SegmentTypography];
};

export const getResponsiveTypography = (size: string, level: string): TypographyProperties => {
  const sizeConfig = RESPONSIVE_MEDICAL_TYPOGRAPHY[size];
  if (!sizeConfig || !sizeConfig.typography[level as keyof ResponsiveTypographyConfig['typography']]) {
    return MEDICAL_TYPOGRAPHY_SCALE.clinical;
  }
  return sizeConfig.typography[level as keyof ResponsiveTypographyConfig['typography']];
};

export const calculateContrastRatio = (foreground: string, background: string): number => {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) return 1;

  const fgLuminance = getLuminance(fgRgb);
  const bgLuminance = getLuminance(bgRgb);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

export const generateTypographyCSSVars = (context: string = 'clinical'): { [key: string]: string | number } => {
  const contextConfig = CLINICAL_CONTEXT_TYPOGRAPHY[context];
  const cssVars: { [key: string]: string | number } = {};

  Object.entries(contextConfig).forEach(([level, config]) => {
    const prefix = `--medical-${context}-${level.replace('Text', '')}`;

    Object.entries(config).forEach(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      cssVars[`${prefix}-${cssProperty}`] = value;
    });
  });

  return cssVars;
};

// =============================================================================
// EXPORT DEFAULT CONFIGURATION
// =============================================================================

export default {
  scale: MEDICAL_TYPOGRAPHY_SCALE,
  contextual: CLINICAL_CONTEXT_TYPOGRAPHY,
  segments: NORTHWESTERN_SEGMENT_TYPOGRAPHY,
  responsive: RESPONSIVE_MEDICAL_TYPOGRAPHY,
  accessibility: ACCESSIBILITY_TYPOGRAPHY,
  utils: {
    getContextualTypography,
    getSegmentTypography,
    getResponsiveTypography,
    calculateContrastRatio,
    generateTypographyCSSVars
  }
};
