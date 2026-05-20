// Mode 1: Verb Flip
export interface VerbPair { id: string; base: string; participle: string; exampleSentence: string }

export const VerbPairs: VerbPair[] = [
  { id: 'v1', base: 'go', participle: 'gone', exampleSentence: 'She has gone to the store.' },
  { id: 'v2', base: 'see', participle: 'seen', exampleSentence: 'Have you seen my keys?' },
  { id: 'v3', base: 'eat', participle: 'eaten', exampleSentence: 'I have already eaten breakfast.' },
  { id: 'v4', base: 'meet', participle: 'met', exampleSentence: 'We met yesterday.' },
  { id: 'v5', base: 'do', participle: 'done', exampleSentence: 'He has done his homework.' },
  { id: 'v6', base: 'try', participle: 'tried', exampleSentence: 'Have you ever tried sushi?' },
  { id: 'v7', base: 'take', participle: 'taken', exampleSentence: 'Someone has taken my pen.' },
  { id: 'v8', base: 'be', participle: 'been', exampleSentence: 'I have never been to Paris.' },
  { id: 'v9', base: 'have', participle: 'had', exampleSentence: 'They had a great time.' },
  { id: 'v10', base: 'write', participle: 'written', exampleSentence: 'She has written three books.' },
  { id: 'v11', base: 'speak', participle: 'spoken', exampleSentence: 'We have spoken about this.' },
  { id: 'v12', base: 'travel', participle: 'traveled', exampleSentence: 'He has traveled all over Europe.' },
  { id: 'v13', base: 'visit', participle: 'visited', exampleSentence: 'They visited the museum yesterday.' },
  { id: 'v14', base: 'climb', participle: 'climbed', exampleSentence: 'We climbed the mountain last year.' },
  { id: 'v15', base: 'fly', participle: 'flown', exampleSentence: 'I have never flown in a helicopter.' },
  { id: 'v16', base: 'ride', participle: 'ridden', exampleSentence: 'She has ridden a horse before.' },
  { id: 'v17', base: 'give', participle: 'given', exampleSentence: 'He has given me a lot of help.' },
  { id: 'v18', base: 'buy', participle: 'bought', exampleSentence: 'I bought a new car last week.' }
];

// Mode 2: Culture Clash
export interface GesturePair { id: string; gesture: 'shake_hands'|'bow'|'hug'|'kiss'|'fist_bump'|'wave'|'nod'; region: string; svgKey: string; description: string; cultureTip: string }

export const GesturePairs: GesturePair[] = [
  { id: 'g1', gesture: 'shake_hands', region: 'North America', svgKey: 'shake', description: 'A firm grip with the right hand.', cultureTip: 'Common in Western business culture as a sign of agreement' },
  { id: 'g2', gesture: 'bow', region: 'East Asia', svgKey: 'bow', description: 'Bending forward from the waist.', cultureTip: 'Depth of bow indicates level of respect in Japan and Korea' },
  { id: 'g3', gesture: 'kiss', region: 'Europe', svgKey: 'kiss', description: 'Touching cheeks and making a kissing sound.', cultureTip: 'Number of kisses varies: 1 in some Latin countries, 2–3 in Europe' },
  { id: 'g4', gesture: 'hug', region: 'Latin America', svgKey: 'hug', description: 'Wrapping arms around the other person.', cultureTip: 'More common in Latin America and Southern Europe than in East Asia' },
  { id: 'g5', gesture: 'fist_bump', region: 'Global', svgKey: 'fist', description: 'Lightly tapping closed fists together.', cultureTip: 'A casual, modern greeting often used among friends' },
  { id: 'g6', gesture: 'nod', region: 'Global', svgKey: 'nod', description: 'Moving the head up and down.', cultureTip: 'Often used to acknowledge someone from a distance' }
];

// Mode 3: Feeling vs. Thing
export interface AdjPair { id: string; root: string; edForm: string; ingForm: string; sentence: string; blankTarget: 'ed'|'ing'; subject: 'person'|'thing' }

export const AdjPairs: AdjPair[] = [
  { id: 'a1', root: 'fascinating', edForm: 'fascinated', ingForm: 'fascinating', sentence: 'The science museum was ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a2', root: 'fascinating', edForm: 'fascinated', ingForm: 'fascinating', sentence: 'I was ___ by the history of the ancient city.', blankTarget: 'ed', subject: 'person' },
  { id: 'a3', root: 'thrilling', edForm: 'thrilled', ingForm: 'thrilling', sentence: 'The roller coaster was ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a4', root: 'thrilling', edForm: 'thrilled', ingForm: 'thrilling', sentence: 'She was ___ to win the competition.', blankTarget: 'ed', subject: 'person' },
  { id: 'a5', root: 'frightening', edForm: 'frightened', ingForm: 'frightening', sentence: 'The horror movie was very ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a6', root: 'frightening', edForm: 'frightened', ingForm: 'frightening', sentence: 'The loud noise ___ the dog.', blankTarget: 'ed', subject: 'person' },
  { id: 'a7', root: 'exhausting', edForm: 'exhausted', ingForm: 'exhausting', sentence: 'The long hike was completely ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a8', root: 'exhausting', edForm: 'exhausted', ingForm: 'exhausting', sentence: 'He felt ___ after running the marathon.', blankTarget: 'ed', subject: 'person' },
  { id: 'a9', root: 'disgusting', edForm: 'disgusted', ingForm: 'disgusting', sentence: 'The rotten food smelled ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a10', root: 'disgusting', edForm: 'disgusted', ingForm: 'disgusting', sentence: 'They were ___ by the dirty kitchen.', blankTarget: 'ed', subject: 'person' },
  { id: 'a11', root: 'boring', edForm: 'bored', ingForm: 'boring', sentence: 'The lecture was so ___ that people fell asleep.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a12', root: 'boring', edForm: 'bored', ingForm: 'boring', sentence: 'I am ___ with this game.', blankTarget: 'ed', subject: 'person' },
  { id: 'a13', root: 'exciting', edForm: 'excited', ingForm: 'exciting', sentence: 'The new theme park ride is ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a14', root: 'exciting', edForm: 'excited', ingForm: 'exciting', sentence: 'We are ___ about the upcoming trip.', blankTarget: 'ed', subject: 'person' },
  { id: 'a15', root: 'amazing', edForm: 'amazed', ingForm: 'amazing', sentence: 'The magic trick was ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a16', root: 'amazing', edForm: 'amazed', ingForm: 'amazing', sentence: 'She was ___ by the beautiful view.', blankTarget: 'ed', subject: 'person' },
  { id: 'a17', root: 'confusing', edForm: 'confused', ingForm: 'confusing', sentence: 'The instructions were very ___.', blankTarget: 'ing', subject: 'thing' },
  { id: 'a18', root: 'confusing', edForm: 'confused', ingForm: 'confusing', sentence: 'He was ___ by the complicated math problem.', blankTarget: 'ed', subject: 'person' }
];

// Mode 4: Travel Tiles
export interface TravelPhrase { id: string; phrase: string; definition: string; iconName: string; exampleCity: string }

export const TravelPhrases: TravelPhrase[] = [
  { id: 't1', phrase: 'go sightseeing', definition: 'To visit interesting places as a tourist', iconName: 'camera', exampleCity: 'Rome' },
  { id: 't2', phrase: 'take a tour of', definition: 'To go on a guided visit around a place', iconName: 'map', exampleCity: 'London' },
  { id: 't3', phrase: 'take pictures of', definition: 'To capture images using a camera', iconName: 'photo', exampleCity: 'Paris' },
  { id: 't4', phrase: 'try local food', definition: 'To eat traditional dishes of a region', iconName: 'food', exampleCity: 'Tokyo' },
  { id: 't5', phrase: 'climb', definition: 'To go up something, like a mountain or stairs', iconName: 'mountain', exampleCity: 'Mount Fuji' },
  { id: 't6', phrase: 'go to the top of', definition: 'To reach the highest point of a structure', iconName: 'tower', exampleCity: 'Eiffel Tower' },
  { id: 't7', phrase: 'visit a museum', definition: 'To go to a building where interesting objects are kept', iconName: 'museum', exampleCity: 'New York' },
  { id: 't8', phrase: 'rent a bike', definition: 'To pay to use a bicycle for a short time', iconName: 'bike', exampleCity: 'Amsterdam' },
  { id: 't9', phrase: 'buy souvenirs', definition: 'To purchase items to remember a trip', iconName: 'gift', exampleCity: 'Venice' }
];

// Mode 5: Time Detective
export interface TimeSentence { id: string; sentence: string; tense: 'present_perfect'|'simple_past'; keyAdverb: string|null; difficulty: 1|2|3 }

export const TimeSentences: TimeSentence[] = [
  // Level 1
  { id: 'td1', sentence: 'I have already eaten dinner.', tense: 'present_perfect', keyAdverb: 'already', difficulty: 1 },
  { id: 'td2', sentence: 'She went to the store yesterday.', tense: 'simple_past', keyAdverb: 'yesterday', difficulty: 1 },
  { id: 'td3', sentence: 'They have never visited Japan.', tense: 'present_perfect', keyAdverb: 'never', difficulty: 1 },
  { id: 'td4', sentence: 'We traveled to Spain last week.', tense: 'simple_past', keyAdverb: 'last week', difficulty: 1 },
  { id: 'td5', sentence: 'Have you ever tried snails?', tense: 'present_perfect', keyAdverb: 'ever', difficulty: 1 },
  { id: 'td6', sentence: 'He graduated in 2020.', tense: 'simple_past', keyAdverb: 'in 2020', difficulty: 1 },
  { id: 'td7', sentence: 'I haven\'t finished my homework yet.', tense: 'present_perfect', keyAdverb: 'yet', difficulty: 1 },
  { id: 'td8', sentence: 'She called me two days ago.', tense: 'simple_past', keyAdverb: 'ago', difficulty: 1 },
  // Level 2
  { id: 'td9', sentence: 'I saw that movie a long time ago.', tense: 'simple_past', keyAdverb: null, difficulty: 2 },
  { id: 'td10', sentence: 'She has lived here her whole life.', tense: 'present_perfect', keyAdverb: null, difficulty: 2 },
  { id: 'td11', sentence: 'We met at a coffee shop.', tense: 'simple_past', keyAdverb: null, difficulty: 2 },
  { id: 'td12', sentence: 'They have studied English for three years.', tense: 'present_perfect', keyAdverb: null, difficulty: 2 },
  { id: 'td13', sentence: 'He lost his keys this morning.', tense: 'simple_past', keyAdverb: null, difficulty: 2 },
  { id: 'td14', sentence: 'I\'ve broken my leg.', tense: 'present_perfect', keyAdverb: null, difficulty: 2 },
  { id: 'td15', sentence: 'Did you finish the report?', tense: 'simple_past', keyAdverb: null, difficulty: 2 },
  { id: 'td16', sentence: 'Has he arrived at the office?', tense: 'present_perfect', keyAdverb: null, difficulty: 2 },
  // Level 3
  { id: 'td17', sentence: 'Shakespeare wrote many plays.', tense: 'simple_past', keyAdverb: null, difficulty: 3 }, // tricky context (dead person)
  { id: 'td18', sentence: 'My sister has written three books.', tense: 'present_perfect', keyAdverb: null, difficulty: 3 }, // tricky context (living person, life experience)
  { id: 'td19', sentence: 'I lived in London for two years, but now I live in Paris.', tense: 'simple_past', keyAdverb: null, difficulty: 3 },
  { id: 'td20', sentence: 'I have lived in London for two years.', tense: 'present_perfect', keyAdverb: null, difficulty: 3 }, // implies still living there
  { id: 'td21', sentence: 'When did you go to the doctor?', tense: 'simple_past', keyAdverb: 'When', difficulty: 3 },
  { id: 'td22', sentence: 'How long have you known him?', tense: 'present_perfect', keyAdverb: 'How long', difficulty: 3 },
  { id: 'td23', sentence: 'It was very cold yesterday morning.', tense: 'simple_past', keyAdverb: 'yesterday morning', difficulty: 3 },
  { id: 'td24', sentence: 'It has been very cold this week.', tense: 'present_perfect', keyAdverb: 'this week', difficulty: 3 }
];
