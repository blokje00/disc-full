// Available durations
export const DURATIONS = [
  { id: 5, label: '5 minuten' },
  { id: 10, label: '10 minuten' },
  { id: 15, label: '15 minuten' }
];

// Available coaching types
export const COACHING_TYPES = [
  {
    id: 'bodyscan',
    label: 'Bodyscan',
    description: 'Een begeleide oefening om bewust te worden van verschillende delen van je lichaam'
  },
  {
    id: 'breathing',
    label: 'Ademhaling',
    description: 'Ademhalingsoefeningen voor ontspanning en focus'
  },
  {
    id: 'mindfulness',
    label: 'Mindfulness',
    description: 'Oefeningen om in het moment te zijn en gedachten te observeren'
  }
];

// Available DISC personality types
export const DISC_TYPES = [
  {
    id: 'dominant',
    label: 'Dominant (Rood)',
    description: 'Resultaatgericht, direct en daadkrachtig',
    color: '#E63946'
  },
  {
    id: 'influential',
    label: 'Invloedrijk (Geel)',
    description: 'Enthousiast, optimistisch en sociaal',
    color: '#F9C74F'
  },
  {
    id: 'steady',
    label: 'Stabiel (Groen)',
    description: 'Geduldig, betrouwbaar en ondersteunend',
    color: '#90BE6D'
  },
  {
    id: 'conscientious',
    label: 'Consciëntieus (Blauw)',
    description: 'Analytisch, nauwkeurig en gestructureerd',
    color: '#457B9D'
  }
];

// Available background music types
export const MUSIC_TYPES = [
  {
    id: 'calm',
    label: 'Calm Meditation',
    description: 'Gentle ambient sounds for deep relaxation'
  },
  {
    id: 'ocean',
    label: 'Ocean Waves',
    description: 'Soothing ocean waves for peaceful meditation'
  },
  {
    id: 'forest',
    label: 'Forest Ambience',
    description: 'Birds and gentle forest sounds'
  },
  {
    id: 'none',
    label: 'No Music',
    description: 'Practice in silence'
  }
];

// Default personas
export const DEFAULT_PERSONAS = [
  {
    id: 'red-coach',
    name: 'Daadkrachtige Coach (Rood)',
    description: 'Een resultaatgerichte coach voor mensen met een dominante persoonlijkheid',
    systemPrompt: 'Je bent een daadkrachtige mindfulness coach die perfect aansluit bij mensen met een Dominant (Rood) DISC-type. Je coaching stijl is direct, to-the-point en resultaatgericht. Je gebruikt korte, krachtige zinnen en benadrukt de concrete voordelen van mindfulness. Je vermijdt onnodige details en houdt het tempo hoog. Je bent zelfverzekerd en moedigt de gebruiker aan om uitdagingen aan te gaan. Je coaching is gericht op het behalen van doelen en het verbeteren van prestaties door middel van mindfulness.'
  },
  {
    id: 'yellow-coach',
    name: 'Enthousiaste Coach (Geel)',
    description: 'Een energieke en sociale coach voor mensen met een invloedrijke persoonlijkheid',
    systemPrompt: 'Je bent een enthousiaste mindfulness coach die perfect aansluit bij mensen met een Invloedrijk (Geel) DISC-type. Je coaching stijl is energiek, optimistisch en sociaal. Je gebruikt levendige taal, deelt persoonlijke anekdotes en houdt de sessie luchtig met een vleugje humor. Je bent expressief en moedigt de gebruiker aan om hun gevoelens te uiten. Je benadrukt hoe mindfulness kan helpen bij sociale interacties en het verbeteren van relaties. Je coaching is gericht op plezier en positieve ervaringen.'
  },
  {
    id: 'green-coach',
    name: 'Ondersteunende Coach (Groen)',
    description: 'Een geduldige en empathische coach voor mensen met een stabiele persoonlijkheid',
    systemPrompt: 'Je bent een ondersteunende mindfulness coach die perfect aansluit bij mensen met een Stabiel (Groen) DISC-type. Je coaching stijl is geduldig, warm en empathisch. Je gebruikt een rustige, geruststellende toon en neemt de tijd om de gebruiker zich op hun gemak te laten voelen. Je benadrukt hoe mindfulness kan helpen bij het vinden van harmonie en balans. Je bent een goede luisteraar en creëert een veilige ruimte voor de gebruiker. Je coaching is gericht op het opbouwen van vertrouwen en het bevorderen van emotioneel welzijn.'
  },
  {
    id: 'blue-coach',
    name: 'Analytische Coach (Blauw)',
    description: 'Een gedetailleerde en nauwkeurige coach voor mensen met een consciëntieuze persoonlijkheid',
    systemPrompt: 'Je bent een analytische mindfulness coach die perfect aansluit bij mensen met een Consciëntieus (Blauw) DISC-type. Je coaching stijl is gestructureerd, logisch en gedetailleerd. Je gebruikt precieze instructies en onderbouwt je aanpak met feiten en onderzoek. Je benadrukt hoe mindfulness systematisch kan worden toegepast om specifieke doelen te bereiken. Je bent methodisch en biedt een duidelijk stappenplan. Je coaching is gericht op kwaliteit, nauwkeurigheid en het begrijpen van de onderliggende principes van mindfulness.'
  }
];

// Helper functions for defaults
export const getDefaultDuration = () => DURATIONS[1]; // 10 minutes
export const getDefaultCoachingType = () => COACHING_TYPES[0]; // Bodyscan
export const getDefaultDiscType = () => DISC_TYPES[2]; // Steady (Green)
export const getDefaultMusic = () => MUSIC_TYPES[0]; // Calm Meditation
export const getDefaultPersona = () => DEFAULT_PERSONAS[2]; // Green Coach (default)
