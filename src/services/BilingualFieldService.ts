export interface FieldTranslation {
  english: string
  french: string
  keywords_en: string[]
  keywords_fr: string[]
  category: string
}

export class BilingualFieldService {
  private static fieldTranslations: FieldTranslation[] = [
    // Business and Management
    {
      english: "Business",
      french: "Commerce",
      keywords_en: ["business", "commerce", "corporate", "enterprise", "trade", "management", "administration"],
      keywords_fr: ["commerce", "affaires", "entreprise", "commercial", "gestion", "administration", "économie"],
      category: "Business",
    },
    {
      english: "Accounting",
      french: "Comptabilité",
      keywords_en: ["accounting", "bookkeeping", "financial reporting"],
      keywords_fr: ["comptabilité", "tenue de livres", "rapport financier"],
      category: "Business",
    },
    {
      english: "Finance",
      french: "Finance",
      keywords_en: ["finance", "investment", "banking", "financial markets", "portfolio", "risk management", "capital"],
      keywords_fr: [
        "finance",
        "investissement",
        "banque",
        "marchés financiers",
        "portefeuille",
        "gestion des risques",
        "capital",
      ],
      category: "Business",
    },
    {
      english: "Marketing",
      french: "Marketing",
      keywords_en: [
        "marketing",
        "advertising",
        "branding",
        "promotion",
        "consumer behavior",
        "digital marketing",
        "sales",
      ],
      keywords_fr: [
        "marketing",
        "publicité",
        "image de marque",
        "promotion",
        "comportement consommateur",
        "marketing numérique",
        "ventes",
      ],
      category: "Business",
    },
    {
      english: "Management",
      french: "Gestion",
      keywords_en: ["management", "leadership", "strategy", "operations", "organizational behavior", "team leadership"],
      keywords_fr: [
        "gestion",
        "leadership",
        "stratégie",
        "opérations",
        "comportement organisationnel",
        "direction d'équipe",
      ],
      category: "Business",
    },
    {
      english: "Economics",
      french: "Économie",
      keywords_en: ["economics", "microeconomics", "macroeconomics", "economic theory", "market analysis", "policy"],
      keywords_fr: [
        "économie",
        "microéconomie",
        "macroéconomie",
        "théorie économique",
        "analyse de marché",
        "politique",
      ],
      category: "Business",
    },
    {
      english: "International Business",
      french: "Commerce International",
      keywords_en: ["international business", "global trade", "export", "import", "multinational", "cross-cultural"],
      keywords_fr: [
        "commerce international",
        "commerce mondial",
        "exportation",
        "importation",
        "multinational",
        "interculturel",
      ],
      category: "Business",
    },
    {
      english: "Entrepreneurship",
      french: "Entrepreneuriat",
      keywords_en: [
        "entrepreneurship",
        "startup",
        "innovation",
        "business development",
        "venture capital",
        "small business",
      ],
      keywords_fr: [
        "entrepreneuriat",
        "startup",
        "innovation",
        "développement d'entreprise",
        "capital-risque",
        "petite entreprise",
      ],
      category: "Business",
    },
    {
      english: "Human Resources",
      french: "Ressources Humaines",
      keywords_en: [
        "human resources",
        "HR",
        "recruitment",
        "talent management",
        "employee relations",
        "organizational psychology",
      ],
      keywords_fr: [
        "ressources humaines",
        "RH",
        "recrutement",
        "gestion des talents",
        "relations employés",
        "psychologie organisationnelle",
      ],
      category: "Business",
    },
    {
      english: "Supply Chain Management",
      french: "Gestion de la Chaîne d'Approvisionnement",
      keywords_en: ["supply chain", "logistics", "procurement", "inventory management", "operations", "distribution"],
      keywords_fr: [
        "chaîne d'approvisionnement",
        "logistique",
        "approvisionnement",
        "gestion des stocks",
        "opérations",
        "distribution",
      ],
      category: "Business",
    },
    {
      english: "Business Analytics",
      french: "Analyse d'Affaires",
      keywords_en: [
        "business analytics",
        "data analysis",
        "business intelligence",
        "predictive modeling",
        "statistics",
      ],
      keywords_fr: [
        "analyse d'affaires",
        "analyse de données",
        "intelligence d'affaires",
        "modélisation prédictive",
        "statistiques",
      ],
      category: "Business",
    },

    // Engineering
    {
      english: "Engineering",
      french: "Ingénierie",
      keywords_en: ["engineering", "technical", "design", "construction", "innovation", "technology", "systems"],
      keywords_fr: ["ingénierie", "technique", "conception", "construction", "innovation", "technologie", "systèmes"],
      category: "Engineering",
    },
    {
      english: "Mechanical Engineering",
      french: "Génie Mécanique",
      keywords_en: [
        "mechanical engineering",
        "mechanics",
        "thermodynamics",
        "manufacturing",
        "machinery",
        "automotive",
      ],
      keywords_fr: ["génie mécanique", "mécanique", "thermodynamique", "fabrication", "machinerie", "automobile"],
      category: "Engineering",
    },
    {
      english: "Electrical Engineering",
      french: "Génie Électrique",
      keywords_en: [
        "electrical engineering",
        "electronics",
        "circuits",
        "power systems",
        "telecommunications",
        "automation",
      ],
      keywords_fr: [
        "génie électrique",
        "électronique",
        "circuits",
        "systèmes électriques",
        "télécommunications",
        "automatisation",
      ],
      category: "Engineering",
    },
    {
      english: "Civil Engineering",
      french: "Génie Civil",
      keywords_en: [
        "civil engineering",
        "construction",
        "infrastructure",
        "structural engineering",
        "transportation",
        "geotechnical",
      ],
      keywords_fr: [
        "génie civil",
        "construction",
        "infrastructure",
        "ingénierie structurelle",
        "transport",
        "géotechnique",
      ],
      category: "Engineering",
    },
    {
      english: "Chemical Engineering",
      french: "Génie Chimique",
      keywords_en: ["chemical engineering", "process engineering", "chemical processes", "materials", "petrochemicals"],
      keywords_fr: ["génie chimique", "ingénierie des procédés", "procédés chimiques", "matériaux", "pétrochimie"],
      category: "Engineering",
    },
    {
      english: "Aerospace Engineering",
      french: "Génie Aérospatial",
      keywords_en: ["aerospace", "aeronautical", "aviation", "spacecraft", "flight", "propulsion", "aerodynamics"],
      keywords_fr: [
        "aérospatial",
        "aéronautique",
        "aviation",
        "vaisseau spatial",
        "vol",
        "propulsion",
        "aérodynamique",
      ],
      category: "Engineering",
    },
    {
      english: "Biomedical Engineering",
      french: "Génie Biomédical",
      keywords_en: ["biomedical engineering", "medical devices", "biotechnology", "biomechanics", "medical technology"],
      keywords_fr: [
        "génie biomédical",
        "dispositifs médicaux",
        "biotechnologie",
        "biomécanique",
        "technologie médicale",
      ],
      category: "Engineering",
    },
    {
      english: "Environmental Engineering",
      french: "Génie Environnemental",
      keywords_en: [
        "environmental engineering",
        "sustainability",
        "pollution control",
        "waste management",
        "green technology",
      ],
      keywords_fr: [
        "génie environnemental",
        "durabilité",
        "contrôle de la pollution",
        "gestion des déchets",
        "technologie verte",
      ],
      category: "Engineering",
    },
    {
      english: "Industrial Engineering",
      french: "Génie Industriel",
      keywords_en: [
        "industrial engineering",
        "manufacturing systems",
        "quality control",
        "process optimization",
        "operations research",
      ],
      keywords_fr: [
        "génie industriel",
        "systèmes de fabrication",
        "contrôle qualité",
        "optimisation des procédés",
        "recherche opérationnelle",
      ],
      category: "Engineering",
    },

    // Computer Science
    {
      english: "Computer Science",
      french: "Informatique",
      keywords_en: ["computer", "programming", "software", "coding", "algorithms", "computing", "digital"],
      keywords_fr: ["informatique", "programmation", "logiciel", "codage", "algorithmes", "calcul", "numérique"],
      category: "Technology",
    },
    {
      english: "Information Technology",
      french: "Technologie de l'Information",
      keywords_en: [
        "information technology",
        "IT",
        "systems administration",
        "network management",
        "technical support",
      ],
      keywords_fr: [
        "technologie de l'information",
        "TI",
        "administration systèmes",
        "gestion réseau",
        "support technique",
      ],
      category: "Technology",
    },
    {
      english: "Data Science",
      french: "Science des Données",
      keywords_en: [
        "data science",
        "big data",
        "machine learning",
        "statistics",
        "data mining",
        "analytics",
        "python",
        "R",
      ],
      keywords_fr: [
        "science des données",
        "mégadonnées",
        "apprentissage automatique",
        "statistiques",
        "exploration de données",
        "analytique",
      ],
      category: "Technology",
    },
    {
      english: "Artificial Intelligence",
      french: "Intelligence Artificielle",
      keywords_en: [
        "artificial intelligence",
        "AI",
        "machine learning",
        "neural networks",
        "deep learning",
        "automation",
      ],
      keywords_fr: [
        "intelligence artificielle",
        "IA",
        "apprentissage automatique",
        "réseaux de neurones",
        "apprentissage profond",
        "automatisation",
      ],
      category: "Technology",
    },
    {
      english: "Cybersecurity",
      french: "Cybersécurité",
      keywords_en: [
        "cybersecurity",
        "information security",
        "network security",
        "ethical hacking",
        "digital forensics",
      ],
      keywords_fr: [
        "cybersécurité",
        "sécurité informatique",
        "sécurité réseau",
        "piratage éthique",
        "criminalistique numérique",
      ],
      category: "Technology",
    },
    {
      english: "Software Engineering",
      french: "Génie Logiciel",
      keywords_en: [
        "software engineering",
        "programming",
        "software development",
        "coding",
        "applications",
        "systems design",
      ],
      keywords_fr: [
        "génie logiciel",
        "programmation",
        "développement logiciel",
        "codage",
        "applications",
        "conception de systèmes",
      ],
      category: "Technology",
    },

    // Medicine and Health
    {
      english: "Medicine",
      french: "Médecine",
      keywords_en: ["medicine", "medical", "health", "healthcare", "clinical", "patient", "treatment", "diagnosis"],
      keywords_fr: [
        "médecine",
        "médical",
        "santé",
        "soins de santé",
        "clinique",
        "patient",
        "traitement",
        "diagnostic",
      ],
      category: "Health",
    },
    {
      english: "Dentistry",
      french: "Dentisterie",
      keywords_en: [
        "dentistry",
        "dental",
        "oral health",
        "orthodontics",
        "periodontics",
        "dental surgery",
        "oral care",
      ],
      keywords_fr: [
        "dentisterie",
        "dentaire",
        "santé bucco-dentaire",
        "orthodontie",
        "parodontie",
        "chirurgie dentaire",
        "soins bucco-dentaires",
      ],
      category: "Health",
    },
    {
      english: "Pharmacy",
      french: "Pharmacie",
      keywords_en: ["pharmacy", "pharmaceutical", "medication", "drug therapy", "clinical pharmacy", "pharmacology"],
      keywords_fr: [
        "pharmacie",
        "pharmaceutique",
        "médicament",
        "thérapie médicamenteuse",
        "pharmacie clinique",
        "pharmacologie",
      ],
      category: "Health",
    },
    {
      english: "Nursing",
      french: "Soins Infirmiers",
      keywords_en: ["nursing", "patient care", "healthcare", "clinical nursing", "registered nurse", "medical care"],
      keywords_fr: [
        "soins infirmiers",
        "soins aux patients",
        "soins de santé",
        "soins infirmiers cliniques",
        "infirmière autorisée",
        "soins médicaux",
      ],
      category: "Health",
    },
    {
      english: "Public Health",
      french: "Santé Publique",
      keywords_en: [
        "public health",
        "epidemiology",
        "health policy",
        "community health",
        "preventive medicine",
        "global health",
      ],
      keywords_fr: [
        "santé publique",
        "épidémiologie",
        "politique de santé",
        "santé communautaire",
        "médecine préventive",
        "santé mondiale",
      ],
      category: "Health",
    },

    // Natural Sciences
    {
      english: "Natural Sciences",
      french: "Sciences Naturelles",
      keywords_en: ["science", "research", "laboratory", "analysis", "natural world", "scientific method"],
      keywords_fr: ["science", "recherche", "laboratoire", "analyse", "monde naturel", "méthode scientifique"],
      category: "Science",
    },
    {
      english: "Physics",
      french: "Physique",
      keywords_en: [
        "physics",
        "quantum mechanics",
        "relativity",
        "thermodynamics",
        "electromagnetism",
        "particle physics",
      ],
      keywords_fr: [
        "physique",
        "mécanique quantique",
        "relativité",
        "thermodynamique",
        "électromagnétisme",
        "physique des particules",
      ],
      category: "Science",
    },
    {
      english: "Chemistry",
      french: "Chimie",
      keywords_en: [
        "chemistry",
        "organic chemistry",
        "inorganic chemistry",
        "analytical chemistry",
        "chemical reactions",
      ],
      keywords_fr: ["chimie", "chimie organique", "chimie inorganique", "chimie analytique", "réactions chimiques"],
      category: "Science",
    },
    {
      english: "Biology",
      french: "Biologie",
      keywords_en: [
        "biology",
        "life sciences",
        "molecular biology",
        "genetics",
        "ecology",
        "evolution",
        "biodiversity",
      ],
      keywords_fr: [
        "biologie",
        "sciences de la vie",
        "biologie moléculaire",
        "génétique",
        "écologie",
        "évolution",
        "biodiversité",
      ],
      category: "Science",
    },
    {
      english: "Mathematics",
      french: "Mathématiques",
      keywords_en: ["mathematics", "calculus", "algebra", "geometry", "mathematical analysis", "number theory"],
      keywords_fr: ["mathématiques", "calcul", "algèbre", "géométrie", "analyse mathématique", "théorie des nombres"],
      category: "Science",
    },

    // Social Sciences
    {
      english: "Social Sciences",
      french: "Sciences Sociales",
      keywords_en: ["social", "society", "human behavior", "research", "analysis", "community", "culture"],
      keywords_fr: ["social", "société", "comportement humain", "recherche", "analyse", "communauté", "culture"],
      category: "Social Sciences",
    },
    {
      english: "Psychology",
      french: "Psychologie",
      keywords_en: [
        "psychology",
        "mental health",
        "behavior",
        "cognitive psychology",
        "clinical psychology",
        "counseling",
      ],
      keywords_fr: [
        "psychologie",
        "santé mentale",
        "comportement",
        "psychologie cognitive",
        "psychologie clinique",
        "conseil",
      ],
      category: "Social Sciences",
    },
    {
      english: "Sociology",
      french: "Sociologie",
      keywords_en: ["sociology", "social behavior", "society", "social structures", "community", "social research"],
      keywords_fr: [
        "sociologie",
        "comportement social",
        "société",
        "structures sociales",
        "communauté",
        "recherche sociale",
      ],
      category: "Social Sciences",
    },
    {
      english: "Political Science",
      french: "Sciences Politiques",
      keywords_en: ["political science", "government", "politics", "public policy", "governance", "political theory"],
      keywords_fr: [
        "sciences politiques",
        "gouvernement",
        "politique",
        "politique publique",
        "gouvernance",
        "théorie politique",
      ],
      category: "Social Sciences",
    },

    // Humanities
    {
      english: "Humanities",
      french: "Sciences Humaines",
      keywords_en: ["humanities", "liberal arts", "culture", "society", "human condition", "philosophy", "literature"],
      keywords_fr: [
        "sciences humaines",
        "arts libéraux",
        "culture",
        "société",
        "condition humaine",
        "philosophie",
        "littérature",
      ],
      category: "Humanities",
    },
    {
      english: "History",
      french: "Histoire",
      keywords_en: [
        "history",
        "historical research",
        "historiography",
        "ancient history",
        "modern history",
        "cultural history",
      ],
      keywords_fr: [
        "histoire",
        "recherche historique",
        "historiographie",
        "histoire ancienne",
        "histoire moderne",
        "histoire culturelle",
      ],
      category: "Humanities",
    },
    {
      english: "Philosophy",
      french: "Philosophie",
      keywords_en: [
        "philosophy",
        "ethics",
        "logic",
        "metaphysics",
        "epistemology",
        "moral philosophy",
        "critical thinking",
      ],
      keywords_fr: [
        "philosophie",
        "éthique",
        "logique",
        "métaphysique",
        "épistémologie",
        "philosophie morale",
        "pensée critique",
      ],
      category: "Humanities",
    },
    {
      english: "Literature",
      french: "Littérature",
      keywords_en: ["literature", "literary studies", "creative writing", "poetry", "prose", "literary criticism"],
      keywords_fr: ["littérature", "études littéraires", "écriture créative", "poésie", "prose", "critique littéraire"],
      category: "Humanities",
    },

    // Arts
    {
      english: "Arts",
      french: "Arts",
      keywords_en: ["arts", "creative", "artistic", "culture", "expression", "aesthetic", "visual", "performance"],
      keywords_fr: ["arts", "créatif", "artistique", "culture", "expression", "esthétique", "visuel", "performance"],
      category: "Arts",
    },
    {
      english: "Fine Arts",
      french: "Beaux-Arts",
      keywords_en: ["fine arts", "painting", "sculpture", "drawing", "visual arts", "art history", "studio arts"],
      keywords_fr: [
        "beaux-arts",
        "peinture",
        "sculpture",
        "dessin",
        "arts visuels",
        "histoire de l'art",
        "arts plastiques",
      ],
      category: "Arts",
    },
    {
      english: "Music",
      french: "Musique",
      keywords_en: ["music", "musical performance", "composition", "music theory", "musicology", "sound engineering"],
      keywords_fr: [
        "musique",
        "performance musicale",
        "composition",
        "théorie musicale",
        "musicologie",
        "ingénierie du son",
      ],
      category: "Arts",
    },

    // Education
    {
      english: "Education",
      french: "Éducation",
      keywords_en: ["education", "teaching", "learning", "pedagogy", "instruction", "curriculum", "academic"],
      keywords_fr: [
        "éducation",
        "enseignement",
        "apprentissage",
        "pédagogie",
        "instruction",
        "curriculum",
        "académique",
      ],
      category: "Education",
    },

    // Law
    {
      english: "Law",
      french: "Droit",
      keywords_en: ["law", "legal", "justice", "court", "attorney", "lawyer", "legislation", "jurisprudence"],
      keywords_fr: ["droit", "juridique", "justice", "tribunal", "avocat", "législation", "jurisprudence"],
      category: "Law",
    },

    // Architecture
    {
      english: "Architecture",
      french: "Architecture",
      keywords_en: ["architecture", "building", "design", "construction", "urban planning", "structures"],
      keywords_fr: ["architecture", "bâtiment", "conception", "construction", "urbanisme", "structures"],
      category: "Architecture",
    },

    // Agriculture
    {
      english: "Agriculture",
      french: "Agriculture",
      keywords_en: ["agriculture", "farming", "crops", "livestock", "rural", "food production", "cultivation"],
      keywords_fr: ["agriculture", "élevage", "cultures", "bétail", "rural", "production alimentaire", "cultivation"],
      category: "Agriculture",
    },

    // Tourism
    {
      english: "Tourism",
      french: "Tourisme",
      keywords_en: ["tourism", "travel", "hospitality", "recreation", "leisure", "destinations", "guest services"],
      keywords_fr: [
        "tourisme",
        "voyage",
        "hospitalité",
        "récréation",
        "loisirs",
        "destinations",
        "services aux clients",
      ],
      category: "Tourism",
    },
  ]

  static searchFields(query: string, language: "en" | "fr" | "both" = "both"): FieldTranslation[] {
    const searchTerm = query.toLowerCase().trim()
    if (!searchTerm) return []

    return this.fieldTranslations.filter((field) => {
      if (language === "en" || language === "both") {
        // Search in English field name and keywords
        if (field.english.toLowerCase().includes(searchTerm)) return true
        if (field.keywords_en.some((keyword) => keyword.toLowerCase().includes(searchTerm))) return true
      }

      if (language === "fr" || language === "both") {
        // Search in French field name and keywords
        if (field.french.toLowerCase().includes(searchTerm)) return true
        if (field.keywords_fr.some((keyword) => keyword.toLowerCase().includes(searchTerm))) return true
      }

      return false
    })
  }

  static getFieldTranslation(englishField: string): FieldTranslation | undefined {
    return this.fieldTranslations.find((field) => field.english === englishField)
  }

  static getFrenchTranslation(englishField: string): string {
    const translation = this.getFieldTranslation(englishField)
    return translation ? translation.french : englishField
  }

  static getEnglishTranslation(frenchField: string): string {
    const translation = this.fieldTranslations.find((field) => field.french === frenchField)
    return translation ? translation.english : frenchField
  }

  static getAllFields(): FieldTranslation[] {
    return this.fieldTranslations
  }

  static getFieldsByCategory(category: string): FieldTranslation[] {
    return this.fieldTranslations.filter((field) => field.category === category)
  }

  static getCategories(): string[] {
    return [...new Set(this.fieldTranslations.map((field) => field.category))]
  }

  static matchProgramField(
    program: any,
    searchQuery: string,
    userLanguage: "en" | "fr" = "en",
  ): {
    exactMatch: boolean
    partialMatch: boolean
    matchScore: number
    matchedKeywords: string[]
  } {
    const searchTerm = searchQuery.toLowerCase().trim()
    if (!searchTerm) return { exactMatch: false, partialMatch: false, matchScore: 0, matchedKeywords: [] }

    const programField = program.field
    const programKeywords = program.field_keywords || []

    const fieldTranslation = this.getFieldTranslation(programField)
    if (!fieldTranslation) return { exactMatch: false, partialMatch: false, matchScore: 0, matchedKeywords: [] }

    let exactMatch = false
    let partialMatch = false
    let matchScore = 0
    const matchedKeywords: string[] = []

    // Check exact field name match
    if (fieldTranslation.english.toLowerCase() === searchTerm || fieldTranslation.french.toLowerCase() === searchTerm) {
      exactMatch = true
      matchScore = 100
      matchedKeywords.push(userLanguage === "fr" ? fieldTranslation.french : fieldTranslation.english)
    }

    // Check partial field name match
    if (!exactMatch) {
      if (
        fieldTranslation.english.toLowerCase().includes(searchTerm) ||
        fieldTranslation.french.toLowerCase().includes(searchTerm)
      ) {
        partialMatch = true
        matchScore = 80
        matchedKeywords.push(userLanguage === "fr" ? fieldTranslation.french : fieldTranslation.english)
      }
    }

    // Check keywords match
    const allKeywords = [...fieldTranslation.keywords_en, ...fieldTranslation.keywords_fr, ...programKeywords]

    for (const keyword of allKeywords) {
      if (keyword.toLowerCase().includes(searchTerm) || searchTerm.includes(keyword.toLowerCase())) {
        if (!exactMatch && !partialMatch) {
          partialMatch = true
          matchScore = Math.max(matchScore, 60)
        }
        matchedKeywords.push(keyword)
      }
    }

    return { exactMatch, partialMatch, matchScore, matchedKeywords }
  }
}

