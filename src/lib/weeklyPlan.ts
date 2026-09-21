import { WeekDay } from '@/types';

export const weeklyPlan: WeekDay[] = [
  {
    id: 'monday',
    day: 'Monday',
    dayShort: 'MON',
    title: 'Immigration & Customs',
    titlePt: 'Passando na Imigração',
    description: 'Seu voo acabou de pousar em Londres. Você precisa passar pelo oficial de imigração.',
    icon: '🛂',
    duration: '15 min',
    vocabulary: [
      { en: 'Passport', pt: 'Passaporte' },
      { en: 'Purpose of your visit', pt: 'Motivo da sua visita' },
      { en: 'How long will you stay?', pt: 'Quanto tempo vai ficar?' },
      { en: 'Sightseeing', pt: 'Turismo' },
    ],
    practicePhrases: [
      'Here is my passport.',
      'I am here on vacation.',
      'I will stay for two weeks.'
    ],
    roleplayContext: 'You are an immigration officer at Heathrow Airport in London. The user is a Brazilian tourist arriving for a 2-week vacation. Ask them for their passport, the purpose of their visit, where they are staying, and how long they will stay. Be slightly serious but polite. Ask one question at a time.'
  },
  {
    id: 'tuesday',
    day: 'Tuesday',
    dayShort: 'TUE',
    title: 'Coffee in New York',
    titlePt: 'Pedindo um Café em NY',
    description: 'Manhã corrida em Manhattan. Peça seu café antes de ir para o trabalho.',
    icon: '☕',
    duration: '15 min',
    vocabulary: [
      { en: 'I would like...', pt: 'Eu gostaria...' },
      { en: 'To go', pt: 'Para levar / Viagem' },
      { en: 'Can I get a...', pt: 'Você pode me dar um...' },
      { en: 'Keep the change', pt: 'Fique com o troco' },
    ],
    practicePhrases: [
      'Can I get a large cappuccino, please?',
      'Is that to here or to go?',
      'To go, please.'
    ],
    roleplayContext: 'You are a fast-paced, friendly barista at a busy coffee shop in New York. The user is a customer. Ask what they want to drink, if they want anything to eat, and whether it is for here or to go. Tell them the total price at the end.'
  },
  {
    id: 'wednesday',
    day: 'Wednesday',
    dayShort: 'WED',
    title: 'Lost in London',
    titlePt: 'Pedindo Informações',
    description: 'Você está perdido perto do Big Ben e precisa pedir informações na rua.',
    icon: '🗺️',
    duration: '15 min',
    vocabulary: [
      { en: 'Excuse me', pt: 'Com licença' },
      { en: 'How do I get to...', pt: 'Como eu chego em...' },
      { en: 'Go straight ahead', pt: 'Siga em frente' },
      { en: 'Turn left / right', pt: 'Vire à esquerda / direita' },
    ],
    practicePhrases: [
      'Excuse me, where is the nearest subway station?',
      'Go straight and turn left.'
    ],
    roleplayContext: 'You are a helpful local walking on the streets of London. The user is a lost tourist asking for directions to the nearest subway (tube) station. Give them directions using landmarks (like a pub or a red phone booth).'
  },
  {
    id: 'thursday',
    day: 'Thursday',
    dayShort: 'THU',
    title: 'Job Interview',
    titlePt: 'Entrevista de Emprego',
    description: 'Sua grande chance! Uma entrevista remota com um recrutador americano.',
    icon: '💼',
    duration: '20 min',
    vocabulary: [
      { en: 'Strengths and weaknesses', pt: 'Pontos fortes e fracos' },
      { en: 'Overcome challenges', pt: 'Superar desafios' },
      { en: 'I have experience in...', pt: 'Eu tenho experiência em...' },
      { en: 'Looking for an opportunity', pt: 'Buscando uma oportunidade' },
    ],
    practicePhrases: [
      'I have 5 years of experience in this field.',
      'My greatest strength is problem solving.'
    ],
    roleplayContext: 'You are an HR recruiter for an American tech company. You are interviewing the user for a Software Developer position. Ask them to introduce themselves, what their strengths are, and why they want to work at the company. Be professional.'
  },
  {
    id: 'friday',
    day: 'Friday',
    dayShort: 'FRI',
    title: 'Making Friends',
    titlePt: 'Fazendo Amigos no Hostel',
    description: 'Sexta à noite! Você está em um hostel e começa a conversar com gringos.',
    icon: '🍻',
    duration: '15 min',
    vocabulary: [
      { en: 'Where are you from?', pt: 'De onde você é?' },
      { en: 'What do you do for fun?', pt: 'O que você faz para se divertir?' },
      { en: 'I am traveling around', pt: 'Estou viajando por aí' },
      { en: 'Awesome', pt: 'Incrível' },
    ],
    practicePhrases: [
      'Where are you from?',
      'Have you been to Brazil before?',
      'Let\'s grab a beer!'
    ],
    roleplayContext: 'You are an outgoing Australian traveler staying at the same hostel as the user in Thailand. Strike up a casual conversation. Ask where they are from, what they recommend doing in their country, and talk a bit about traveling.'
  },
  {
    id: 'saturday',
    day: 'Saturday',
    dayShort: 'SAT',
    title: 'Shopping for Clothes',
    titlePt: 'Comprando Roupas',
    description: 'Você precisa comprar uma jaqueta nova porque está frio. Interaja com o vendedor.',
    icon: '🛍️',
    duration: '15 min',
    vocabulary: [
      { en: 'Fitting room', pt: 'Provador' },
      { en: 'Do you have this in a different size?', pt: 'Você tem isso em outro tamanho?' },
      { en: 'It fits perfectly', pt: 'Ficou perfeito' },
      { en: 'I am just looking', pt: 'Estou só dando uma olhadinha' },
    ],
    practicePhrases: [
      'Where are the fitting rooms?',
      'Do you have this in a medium size?'
    ],
    roleplayContext: 'You are a retail worker at a clothing store in Miami. The user is looking for a winter jacket. Ask if they need help, tell them where the fitting rooms are, and help them with sizes.'
  },
  {
    id: 'sunday',
    day: 'Sunday',
    dayShort: 'SUN',
    title: 'Doctor Appointment',
    titlePt: 'Consulta Médica',
    description: 'Você acordou passando mal na viagem e precisou ir ao médico. Explique o que sente.',
    icon: '🏥',
    duration: '15 min',
    vocabulary: [
      { en: 'I have a headache', pt: 'Estou com dor de cabeça' },
      { en: 'Fever', pt: 'Febre' },
      { en: 'Prescription', pt: 'Receita médica' },
      { en: 'Does it hurt?', pt: 'Dói?' },
    ],
    practicePhrases: [
      'I don\'t feel very well.',
      'I have a sore throat and a fever.'
    ],
    roleplayContext: 'You are a doctor at a walk-in clinic in Canada. The user comes in feeling sick. Ask them about their symptoms, how long they have been feeling this way, and give them a mock prescription or advice.'
  }
];
