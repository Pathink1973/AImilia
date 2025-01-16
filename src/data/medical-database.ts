interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  contacts: {
    phone?: string;
    email?: string;
    address?: string;
  };
  specialization: string[];
  languages: string[];
}

interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  category: string;
  usedFor: string[];
  sideEffects: string[];
  contraindications: string[];
  dosageForm: string;
  typicalDosage: string;
  requiresPrescription: boolean;
  interactions?: string[];
}

interface CognitiveExercise {
  id: string;
  category: string;
  name: string;
  description: string;
  instructions: string[];
}

export const doctors: Doctor[] = [
  {
    id: "dr-1",
    name: "Dr. Alexandre Mendes",
    specialty: "Neurologia",
    location: "Hospital Lusíadas Porto",
    contacts: {
      address: "Hospital Lusíadas Porto"
    },
    specialization: ["Doença de Parkinson", "Doenças do movimento", "Toxina botulínica"],
    languages: ["Português"]
  },
  {
    id: "dr-2",
    name: "Dra. Ana Catarina Félix",
    specialty: "Neurologia",
    location: "Hospital Lusíadas Albufeira",
    contacts: {
      address: "Hospital Lusíadas Albufeira"
    },
    specialization: ["Demências", "Memória", "Neurologia do comportamento", "Neuropsiquiátrica", "Epilepsia"],
    languages: ["Português"]
  },
  {
    id: "dr-3",
    name: "Dra. Ana Monteiro",
    specialty: "Neurologia",
    location: "Hospital Lusíadas Braga",
    contacts: {
      address: "Hospital Lusíadas Braga"
    },
    specialization: ["Defeitos cognitivos", "Demência", "Neurologia Geral", "Doença de Parkinson", "Enxaqueca"],
    languages: ["Português"]
  },
  {
    id: "dr-4",
    name: "Dra. Ana Santos Pinto",
    specialty: "Neurologia",
    location: "Trofa Saúde Braga Sul",
    contacts: {
      address: "Trofa Saúde Braga Sul"
    },
    specialization: ["Neurologia Geral"],
    languages: ["Português"]
  },
  {
    id: "dr-5",
    name: "Dra. Carolina Soares",
    specialty: "Neurologia",
    location: "Instituto CUF Porto",
    contacts: {
      address: "Instituto CUF Porto"
    },
    specialization: ["Doenças do Movimento", "Estimulação Cerebral Profunda"],
    languages: ["Português"]
  },
  {
    id: "dr-6",
    name: "Dr. Henrique Miguel Delgado",
    specialty: "Neurologia",
    location: "Hospital CUF Tejo",
    contacts: {
      address: "Hospital CUF Tejo"
    },
    specialization: ["Neurologia Geral"],
    languages: ["Português"]
  },
  {
    id: "dr-7",
    name: "Dra. Inês Brás Marques",
    specialty: "Neurologia",
    location: "Hospital da Luz Lisboa",
    contacts: {
      address: "Hospital da Luz Lisboa"
    },
    specialization: [
      "Dores de Cabeça/Cefaleias",
      "Doenças Auto-Imunes Desmielinizantes do Sistema Nervoso Central",
      "Encefalite Autoimune"
    ],
    languages: ["Português"]
  },
  {
    id: "dr-8",
    name: "Dr. João de Sá",
    specialty: "Neurologia",
    location: "Consultório Privado em Lisboa",
    contacts: {
      address: "Lisboa"
    },
    specialization: ["Esclerose Múltipla", "Doença de Alzheimer", "Doença de Parkinson"],
    languages: ["Português"]
  },
  {
    id: "dr-9",
    name: "Dr. João Pedro Marto",
    specialty: "Neurologia",
    location: "Hospital CUF Tejo",
    contacts: {
      address: "Hospital CUF Tejo"
    },
    specialization: ["Doenças vasculares cerebrais", "Demência", "Cefaleias", "Neurologia Geral"],
    languages: ["Português"]
  },
  {
    id: "dr-10",
    name: "Dr. José Vale",
    specialty: "Neurologia",
    location: "Hospital Lusíadas Lisboa",
    contacts: {
      address: "Hospital Lusíadas Lisboa"
    },
    specialization: ["Doenças do movimento", "Genética e doenças desmielinizantes"],
    languages: ["Português"]
  },
  {
    id: "dr-11",
    name: "Dr. Mário Veloso",
    specialty: "Neurologia",
    location: "Hospital Lusíadas Lisboa",
    contacts: {
      address: "Hospital Lusíadas Lisboa"
    },
    specialization: ["Neurologia Geral", "Doenças Desmielinizantes", "Doenças Neurodegenerativas"],
    languages: ["Português"]
  },
  {
    id: "dr-12",
    name: "Dra. Luísa Albuquerque",
    specialty: "Neurologia",
    location: "Hospital CUF Tejo",
    contacts: {
      address: "Hospital CUF Tejo"
    },
    specialization: ["Neuro-Oncologia"],
    languages: ["Português"]
  },
  {
    id: "dr-13",
    name: "Prof. Dr. José Manuel Ferro",
    specialty: "Neurologia",
    location: "Hospital da Luz Lisboa",
    contacts: {
      address: "Hospital da Luz Lisboa"
    },
    specialization: ["Doenças vasculares cerebrais", "Perturbações da marcha e equilíbrio", "Cefaleias"],
    languages: ["Português"]
  },
  {
    id: "dr-14",
    name: "Prof. Dr. José Manuel Lopes Lima",
    specialty: "Neurologia",
    location: "Hospital da Luz Arrábida",
    contacts: {
      address: "Hospital da Luz Arrábida; Hospital Lusíadas Porto; Hospital da Prelada"
    },
    specialization: [
      "Doenças Neurológicas",
      "Epilepsia",
      "Nevralgias",
      "Cefaleias",
      "Tonturas",
      "AVC",
      "Demências",
      "Doença de Parkinson"
    ],
    languages: ["Português"]
  },
  {
    id: "dr-15",
    name: "Dr. Pedro Nascimento Alves",
    specialty: "Neurologia",
    location: "Hospital CUF Tejo",
    contacts: {
      address: "Hospital CUF Tejo"
    },
    specialization: ["Funções cognitivas", "Neurologia do Comportamento", "Acidente Vascular Cerebral"],
    languages: ["Português"]
  },
  {
    id: "dr-16",
    name: "Dra. Rita dos Santos Martins",
    specialty: "Neurologia",
    location: "Hospital Lusíadas Lisboa",
    contacts: {
      address: "Hospital Lusíadas Lisboa"
    },
    specialization: ["Epilepsia", "Doenças do sono", "Neurogenética", "Neurologia Geral"],
    languages: ["Português"]
  },
  {
    id: "dr-17",
    name: "Dr. Rui Felgueiras",
    specialty: "Neurologia",
    location: "Hospital da Luz Arrábida",
    contacts: {
      address: "Hospital da Luz Arrábida; Clínica de Cerveira; Hospital Geral de Santo António"
    },
    specialization: ["Neurologia Geral"],
    languages: ["Português"]
  }
];

export const medications: Medication[] = [
  {
    id: "med-1",
    name: "Donepezila",
    activeIngredient: "Cloridrato de Donepezila",
    category: "Inibidor da Colinesterase",
    usedFor: ["Tratamento de demência leve, moderada ou grave em Alzheimer"],
    sideEffects: ["Náusea", "Diarreia", "Insônia", "Fadiga"],
    contraindications: ["Hipersensibilidade ao Donepezil", "Gravidez e amamentação"],
    dosageForm: "Comprimido",
    typicalDosage: "Início: 5 mg uma vez ao dia à noite\nManutenção: Pode ser aumentada para 10 mg após 4-6 semanas",
    requiresPrescription: true
  },
  {
    id: "med-2",
    name: "Rivastigmina",
    activeIngredient: "Rivastigmina",
    category: "Inibidor da Colinesterase",
    usedFor: ["Demência leve a moderada associada ao Alzheimer e ao Parkinson"],
    sideEffects: ["Náusea", "Vômitos", "Perda de apetite"],
    contraindications: ["Hipersensibilidade à rivastigmina"],
    dosageForm: "Comprimido e Adesivo transdérmico",
    typicalDosage: "Oral: 1,5 mg 2x/dia, aumentando até 6 mg 2x/dia\nAdesivo: 4,6 mg/24h, ajustável para 9,5 mg/24h",
    requiresPrescription: true
  },
  {
    id: "med-3",
    name: "Galantamina",
    activeIngredient: "Galantamina",
    category: "Inibidor da Colinesterase",
    usedFor: ["Tratamento de demência leve a moderada em Alzheimer"],
    sideEffects: ["Náusea", "Tontura", "Dor de cabeça"],
    contraindications: ["Insuficiência hepática grave"],
    dosageForm: "Comprimido",
    typicalDosage: "Início: 4 mg 2x/dia\nManutenção: 8-12 mg 2x/dia",
    requiresPrescription: true
  },
  {
    id: "med-4",
    name: "Memantina",
    activeIngredient: "Cloridrato de Memantina",
    category: "Antagonista do Receptor NMDA",
    usedFor: ["Tratamento de Alzheimer moderado a grave"],
    sideEffects: ["Tontura", "Dor de cabeça", "Constipação"],
    contraindications: ["Insuficiência renal grave"],
    dosageForm: "Comprimido",
    typicalDosage: "Início: 5 mg/dia\nAumento: 5 mg/semana até 20 mg/dia",
    requiresPrescription: true
  }
];

export const cognitiveExercises: CognitiveExercise[] = [
  {
    id: "ex-1",
    category: "Memória",
    name: "Memória de Curto Prazo",
    description: "Exercícios para avaliar a capacidade de retenção de informações recentes",
    instructions: [
      "Repetir uma lista de 3-5 palavras imediatamente após ouvi-las",
      "Recontar uma história breve logo após a sua narração"
    ]
  },
  {
    id: "ex-2",
    category: "Linguagem",
    name: "Fluência Verbal",
    description: "Avaliação da capacidade de produção verbal",
    instructions: [
      "Listar o máximo de palavras de uma categoria em 60 segundos",
      "Citar palavras que comecem com uma letra específica"
    ]
  },
  {
    id: "ex-3",
    category: "Função Visuo-Espacial",
    name: "Teste do Relógio",
    description: "Avaliação da capacidade visuo-espacial e funções executivas",
    instructions: [
      "Desenhar um relógio completo",
      "Marcar um horário específico no relógio desenhado"
    ]
  }
];

// Função auxiliar para buscar médicos por especialidade
export function findDoctorsBySpecialty(specialty: string): Doctor[] {
  return doctors.filter(doctor => 
    doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
    doctor.specialization.some(spec => 
      spec.toLowerCase().includes(specialty.toLowerCase())
    )
  );
}

// Função auxiliar para buscar medicamentos por categoria ou uso
export function findMedicationsByCondition(condition: string): Medication[] {
  return medications.filter(med =>
    med.category.toLowerCase().includes(condition.toLowerCase()) ||
    med.usedFor.some(use => 
      use.toLowerCase().includes(condition.toLowerCase())
    )
  );
}

// Função para obter informações detalhadas sobre um medicamento
export function getMedicationDetails(medicationName: string): Medication | undefined {
  return medications.find(med =>
    med.name.toLowerCase() === medicationName.toLowerCase()
  );
}

// Função para obter informações detalhadas sobre um médico
export function getDoctorDetails(doctorName: string): Doctor | undefined {
  return doctors.find(doc =>
    doc.name.toLowerCase().includes(doctorName.toLowerCase())
  );
}
