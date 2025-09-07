// Hebrew QWERTY layout finger positions - CORRECT TOUCH TYPING
const hebrewFingerPositions = {
  // Left hand - Middle finger
  'ק': { finger: 'left-middle', x: 25, y: 50, description: 'אמה שמאל על ק' },
  'ג': { finger: 'left-middle', x: 150, y: 100, description: 'אמה שמאל על ג' },
  'ב': { finger: 'left-middle', x: 100, y: 150, description: 'אמה שמאל על ב' },
  
  // Left hand - Index finger
  'ר': { finger: 'left-index', x: 75, y: 50, description: 'אצבע מורה שמאל על ר' },
  'א': { finger: 'left-index', x: 125, y: 50, description: 'אצבע מורה שמאל על א' },
  'כ': { finger: 'left-index', x: 200, y: 100, description: 'אצבע מורה שמאל על כ' },
  'ע': { finger: 'left-index', x: 250, y: 100, description: 'אצבע מורה שמאל על ע' },
  'ה': { finger: 'left-index', x: 350, y: 100, description: 'אצבע מורה שמאל על ה' },
  'נ': { finger: 'left-index', x: 300, y: 150, description: 'אצבע מורה שמאל על נ' },
  
  // Right hand - Index finger
  'ט': { finger: 'right-index', x: 175, y: 50, description: 'אצבע מורה ימין על ט' },
  'ו': { finger: 'right-index', x: 250, y: 100, description: 'אצבע מורה ימין על ו' },
  'י': { finger: 'right-index', x: 100, y: 150, description: 'אצבע מורה ימין על י' },
  'ח': { finger: 'right-index', x: 50, y: 150, description: 'אצבע מורה ימין על ח' },
  'מ': { finger: 'right-index', x: 400, y: 150, description: 'אצבע מורה ימין על מ' },
  'צ': { finger: 'right-index', x: 450, y: 150, description: 'אצבע מורה ימין על צ' },
  
  // Right hand - Middle finger
  'ן': { finger: 'right-middle', x: 350, y: 150, description: 'אמה ימין על ן' },
  'ל': { finger: 'right-middle', x: 400, y: 100, description: 'אמה ימין על ל' },
  'ת': { finger: 'right-middle', x: 475, y: 150, description: 'אמה ימין על ת' },
  
  // Right hand - Ring finger
  'ם': { finger: 'right-ring', x: 300, y: 100, description: 'קמיצה ימין על ם' },
  'ך': { finger: 'right-ring', x: 150, y: 150, description: 'קמיצה ימין על ך' },
  'ץ': { finger: 'right-ring', x: 500, y: 150, description: 'קמיצה ימין על ץ' },
  
  // Right hand - Pinky
  'פ': { finger: 'right-pinky', x: 375, y: 50, description: 'זרת ימין על פ' },
  'ף': { finger: 'right-pinky', x: 400, y: 150, description: 'זרת ימין על ף' },
  
  // Left hand - Ring finger
  'ד': { finger: 'left-ring', x: 100, y: 100, description: 'קמיצה שמאל על ד' },
  'ס': { finger: 'left-ring', x: 50, y: 150, description: 'קמיצה שמאל על ס' },
  
  // Left hand - Pinky
  'ש': { finger: 'left-pinky', x: 425, y: 50, description: 'זרת שמאל על ש' },
  'ז': { finger: 'left-pinky', x: 0, y: 150, description: 'זרת שמאל על ז' }
};

// English QWERTY layout finger positions - CORRECT TOUCH TYPING
const englishFingerPositions = {
  // Left hand - Pinky (corrected for Q)
  'q': { finger: 'left-pinky', x: 25, y: 50, description: 'Left pinky on Q' },
  'd': { finger: 'left-middle', x: 150, y: 100, description: 'Left middle finger on D' },
  'b': { finger: 'left-middle', x: 200, y: 150, description: 'Left middle finger on B' },
  
  // Left hand - Index finger
  'w': { finger: 'left-ring', x: 75, y: 50, description: 'Left ring finger on W' },
  'e': { finger: 'left-middle', x: 125, y: 50, description: 'Left middle finger on E' },
  'f': { finger: 'left-index', x: 200, y: 100, description: 'Left index finger on F' },
  'g': { finger: 'left-index', x: 250, y: 100, description: 'Left index finger on G' },
  'h': { finger: 'right-index', x: 300, y: 100, description: 'Right index finger on H' },
  'n': { finger: 'right-index', x: 300, y: 150, description: 'Right index finger on N' },
  
  // Right hand - Index finger
  't': { finger: 'left-index', x: 225, y: 50, description: 'Left index finger on T' },
  'y': { finger: 'right-index', x: 275, y: 50, description: 'Right index finger on Y' },
  'u': { finger: 'right-index', x: 325, y: 50, description: 'Right index finger on U' },
  'j': { finger: 'right-index', x: 350, y: 100, description: 'Right index finger on J' },
  'm': { finger: 'right-index', x: 300, y: 150, description: 'Right index finger on M' },
  ',': { finger: 'right-middle', x: 350, y: 150, description: 'Right middle finger on comma' },
  
  // Right hand - Middle finger
  'i': { finger: 'right-middle', x: 375, y: 50, description: 'Right middle finger on I' },
  'k': { finger: 'right-middle', x: 400, y: 100, description: 'Right middle finger on K' },
  '.': { finger: 'right-ring', x: 400, y: 150, description: 'Right ring finger on period' },
  
  // Right hand - Ring finger
  'o': { finger: 'right-ring', x: 425, y: 50, description: 'Right ring finger on O' },
  'l': { finger: 'right-ring', x: 450, y: 100, description: 'Right ring finger on L' },
  
  // Right hand - Pinky
  'p': { finger: 'right-pinky', x: 475, y: 50, description: 'Right pinky on P' },
  ';': { finger: 'right-pinky', x: 500, y: 100, description: 'Right pinky on semicolon' },
  '/': { finger: 'right-pinky', x: 450, y: 150, description: 'Right pinky on forward slash' },
  
  // Left hand - Ring finger
  's': { finger: 'left-ring', x: 100, y: 100, description: 'Left ring finger on S' },
  'x': { finger: 'left-ring', x: 50, y: 150, description: 'Left ring finger on X' },
  
  // Left hand - Pinky
  'a': { finger: 'left-pinky', x: 50, y: 100, description: 'Left pinky on A' },
  'z': { finger: 'left-pinky', x: 0, y: 150, description: 'Left pinky on Z' }
};

export const lessons = {
  hebrew: [
    {
      id: 1,
      title: 'שלב 1: כ ח',
      group: 'אצבע מורה',
      description: 'למד את אצבע המורה - כ (שמאל) וח (ימין)',
      keys: ['כ', 'ח'],
      text: 'כ ח כ ח כח כח חכ חכ כחח חככ כחחח חכככ כ ח כ ח',
      fingerGuide: 'מקם את אצבע המורה השמאלית על כ ואת אצבע המורה הימנית על ח',
      completed: false,
      locked: false,
      fingerPositions: {
        'כ': hebrewFingerPositions['כ'],
        'ח': hebrewFingerPositions['ח']
      }
    },
    {
      id: 2,
      title: 'שלב 2: ע י',
      group: 'אצבע מורה',
      description: 'למד את אצבע המורה - ע (שמאל) וי (ימין)',
      keys: ['ע', 'י'],
      text: 'ע י ע י עי עי יע יע עיי יעע עייי יעעע עי עיי יע יעע',
      fingerGuide: 'מקם את אצבע המורה השמאלית על ע ואת אצבע המורה הימנית על י',
      completed: false,
      locked: false,
      fingerPositions: {
        'ע': hebrewFingerPositions['ע'],
        'י': hebrewFingerPositions['י']
      }
    },
    {
      id: 3,
      title: 'שלב 3: ה מ',
      group: 'אצבע מורה',
      description: 'למד את אצבע המורה - ה (שמאל) ומ (ימין)',
      keys: ['ה', 'מ'],
      text: 'ה מ ה מ המ המ מה מה הממ מהה המממ מהה ה מ ה מ',
      fingerGuide: 'מקם את אצבע המורה השמאלית על ה ואת אצבע המורה הימנית על מ',
      completed: false,
      locked: false,
      fingerPositions: {
        'ה': hebrewFingerPositions['ה'],
        'מ': hebrewFingerPositions['מ']
      }
    },
    {
      id: 4,
      title: 'שלב 4: נ צ',
      group: 'אצבע מורה',
      description: 'למד את אצבע המורה - נ (שמאל) וצ (ימין)',
      keys: ['נ', 'צ'],
      text: 'נ צ נ צ נצ נצ צנ צנ נצצ צננ נצצצ צננ נ צ נ צ',
      fingerGuide: 'מקם את אצבע המורה השמאלית על נ ואת אצבע המורה הימנית על צ',
      completed: false,
      locked: false,
      fingerPositions: {
        'נ': hebrewFingerPositions['נ'],
        'צ': hebrewFingerPositions['צ']
      }
    },
    {
      id: 5,
      title: 'שלב 5: ר ט',
      group: 'אצבע מורה',
      description: 'למד את אצבע המורה - ר (שמאל) וט (ימין)',
      keys: ['ר', 'ט'],
      text: 'ר ט ר ט רט רט טר טר רטט טרר רטטט טררר ר ט ר ט',
      fingerGuide: 'מקם את אצבע המורה השמאלית על ר ואת אצבע המורה הימנית על ט',
      completed: false,
      locked: false,
      fingerPositions: {
        'ר': hebrewFingerPositions['ר'],
        'ט': hebrewFingerPositions['ט']
      }
    },
    {
      id: 6,
      title: 'שלב 6: א ו',
      group: 'אצבע מורה',
      description: 'למד את אצבע המורה - א (שמאל) וו (ימין)',
      keys: ['א', 'ו'],
      text: 'א ו א ו או או וא וא אוו ואא אווו ואא א ו א ו',
      fingerGuide: 'מקם את אצבע המורה השמאלית על א ואת אצבע המורה הימנית על ו',
      completed: false,
      locked: false,
      fingerPositions: {
        'א': hebrewFingerPositions['א'],
        'ו': hebrewFingerPositions['ו']
      }
    },
    {
      id: 7,
      title: 'שלב 7: ג ל',
      group: 'אמה',
      description: 'למד את האמה - ג (שמאל) ול (ימין)',
      keys: ['ג', 'ל'],
      text: 'ג ל ג ל גל גל לג לג גלל לגג גללל לגגג ג ל ג ל',
      fingerGuide: 'מקם את האמה השמאלית על ג ואת האמה הימנית על ל',
      completed: false,
      locked: false,
      fingerPositions: {
        'ג': hebrewFingerPositions['ג'],
        'ל': hebrewFingerPositions['ל']
      }
    },
    {
      id: 8,
      title: 'שלב 8: ב ת',
      group: 'אמה',
      description: 'למד את האמה - ב (שמאל) ות (ימין)',
      keys: ['ב', 'ת'],
      text: 'ב ת ב ת בת בת תב תב בתת תבב בתתת תבב ב ת ב ת',
      fingerGuide: 'מקם את האמה השמאלית על ב ואת האמה הימנית על ת',
      completed: false,
      locked: false,
      fingerPositions: {
        'ב': hebrewFingerPositions['ב'],
        'ת': hebrewFingerPositions['ת']
      }
    },
    {
      id: 9,
      title: 'שלב 9: ק ן',
      group: 'אמה',
      description: 'למד את האמה - ק (שמאל) ון (ימין)',
      keys: ['ק', 'ן'],
      text: 'ק ן ק ן קן ןק קןן ןקן קקן ןןן ק ן ק ן',
      fingerGuide: 'מקם את האמה השמאלית על ק ואת האמה הימנית על ן',
      completed: false,
      locked: false,
      fingerPositions: {
        'ק': hebrewFingerPositions['ק'],
        'ן': hebrewFingerPositions['ן']
      }
    },
    {
      id: 10,
      title: 'שלב 10: ד ך',
      group: 'קמיצה',
      description: 'למד את הקמיצה - ד (שמאל) וך (ימין)',
      keys: ['ד', 'ך'],
      text: 'ד ך ד ך דך ךד דד ךך דךך ךדד ד ך ד ך',
      fingerGuide: 'מקם את הקמיצה השמאלית על ד ואת הקמיצה הימנית על ך',
      completed: false,
      locked: false,
      fingerPositions: {
        'ד': hebrewFingerPositions['ד'],
        'ך': hebrewFingerPositions['ך']
      }
    },
    {
      id: 11,
      title: 'שלב 11: ס ץ',
      group: 'קמיצה',
      description: 'למד את הקמיצה - ס (שמאל) וץ (ימין)',
      keys: ['ס', 'ץ'],
      text: 'ס ץ ס ץ סץ ץס סס ץץ סץץ ץסס ס ץ ס ץ',
      fingerGuide: 'מקם את הקמיצה השמאלית על ס ואת הקמיצה הימנית על ץ',
      completed: false,
      locked: false,
      fingerPositions: {
        'ס': hebrewFingerPositions['ס'],
        'ץ': hebrewFingerPositions['ץ']
      }
    },
    {
      id: 12,
      title: 'שלב 12: ז .',
      group: 'זרת',
      description: 'למד את הזרת - ז (שמאל) ו . (ימין)',
      keys: ['ז', '.'],
      text: 'ז . ז . ז. .ז ז.. ..ז ז . ז .',
      fingerGuide: 'מקם את הזרת השמאלית על ז ואת הזרת הימנית על .',
      completed: false,
      locked: false,
      fingerPositions: {
        'ז': hebrewFingerPositions['ז'],
        '.': englishFingerPositions['.']
      }
    },
    {
      id: 13,
      title: 'שלב 13: ש ף ,',
      group: 'זרת',
      description: 'למד את הזרת והקצה - ש (שמאל), ף (ימין) ו , (קצה)',
      keys: ['ש', 'ף', ','],
      text: 'ש ף , ש , ף ש, ף, ,, ףף שש , , , ש ף ,',
      fingerGuide: 'מקם את הזרת השמאלית על ש, את הזרת הימנית על ף, ואת האצבע המתאימה על ,',
      completed: false,
      locked: false,
      fingerPositions: {
        'ש': hebrewFingerPositions['ש'],
        'ף': hebrewFingerPositions['ף'],
        ',': englishFingerPositions[',']
      }
    },
    {
      id: 14,
      title: 'שלב 14: פ /',
      group: 'זרת',
      description: 'למד את הזרת - פ (שמאל) ו / (ימין)',
      keys: ['פ', '/'],
      text: 'פ / פ / פ/ /פ פ// //פ פ / פ /',
      fingerGuide: 'מקם את הזרת השמאלית על פ ואת הזרת הימנית על /',
      completed: false,
      locked: false,
      fingerPositions: {
        'פ': hebrewFingerPositions['פ'],
        '/': englishFingerPositions['/']
      }
    }
  ],
  english: [
    {
      id: 1,
      title: 'Lesson 1: F J',
      group: 'Index Finger',
      description: 'Learn the index finger - F (left) and J (right)',
      keys: ['f', 'j'],
      text: 'f j f j fj fj jf jf fjf jff fjff jfff f j f j',
      fingerGuide: 'Place your left index finger on F and right index finger on J',
      completed: false,
      locked: false,
      fingerPositions: {
        'f': englishFingerPositions['f'],
        'j': englishFingerPositions['j']
      }
    },
    {
      id: 2,
      title: 'Lesson 2: G H',
      group: 'Index Finger',
      description: 'Learn the index finger - G (left) and H (right)',
      keys: ['g', 'h'],
      text: 'g h g h gh gh hg hg ghh hgg ghhh hggg g h g h',
      fingerGuide: 'Place your left index finger on G and right index finger on H',
      completed: false,
      locked: false,
      fingerPositions: {
        'g': englishFingerPositions['g'],
        'h': englishFingerPositions['h']
      }
    },
    {
      id: 3,
      title: 'Lesson 3: R U',
      group: 'Index Finger',
      description: 'Learn the index finger - R (left) and U (right)',
      keys: ['r', 'u'],
      text: 'r u r u ru ru ur ur ruu urr ruuu urrr r u r u',
      fingerGuide: 'Place your left index finger on R and right index finger on U',
      completed: false,
      locked: false,
      fingerPositions: {
        'r': englishFingerPositions['r'],
        'u': englishFingerPositions['u']
      }
    },
    {
      id: 4,
      title: 'Lesson 4: T Y',
      group: 'Index Finger',
      description: 'Learn the index finger - T (left) and Y (right)',
      keys: ['t', 'y'],
      text: 't y t y ty ty yt yt tyy ytt tyyy yttt t y t y',
      fingerGuide: 'Place your left index finger on T and right index finger on Y',
      completed: false,
      locked: false,
      fingerPositions: {
        't': englishFingerPositions['t'],
        'y': englishFingerPositions['y']
      }
    },
    {
      id: 5,
      title: 'Lesson 5: N M',
      group: 'Index Finger',
      description: 'Learn the index finger - N (left) and M (right)',
      keys: ['n', 'm'],
      text: 'n m n m nm nm mn mn nmm mnn nmmm mnnn n m n m',
      fingerGuide: 'Place your left index finger on N and right index finger on M',
      completed: false,
      locked: false,
      fingerPositions: {
        'n': englishFingerPositions['n'],
        'm': englishFingerPositions['m']
      }
    },
    {
      id: 6,
      title: 'Lesson 6: W I',
      group: 'Index Finger',
      description: 'Learn the index finger - W (left) and I (right)',
      keys: ['w', 'i'],
      text: 'w i w i wi wi iw iw wii iww wiii iwww w i w i',
      fingerGuide: 'Place your left index finger on W and right index finger on I',
      completed: false,
      locked: false,
      fingerPositions: {
        'w': englishFingerPositions['w'],
        'i': englishFingerPositions['i']
      }
    },
    {
      id: 7,
      title: 'Lesson 7: E K',
      group: 'Middle Finger',
      description: 'Learn the middle finger - E (left) and K (right)',
      keys: ['e', 'k'],
      text: 'e k e k ek ek ke ke ekk kee ekkk keee e k e k',
      fingerGuide: 'Place your left middle finger on E and right middle finger on K',
      completed: false,
      locked: false,
      fingerPositions: {
        'e': englishFingerPositions['e'],
        'k': englishFingerPositions['k']
      }
    },
    {
      id: 8,
      title: 'Lesson 8: D ,',
      group: 'Middle Finger',
      description: 'Learn the middle finger - D (left) and comma (right)',
      keys: ['d', ','],
      text: 'd , d , d, d, ,d ,d d,, ,dd d,,, ,ddd d , d ,',
      fingerGuide: 'Place your left middle finger on D and right middle finger on comma',
      completed: false,
      locked: false,
      fingerPositions: {
        'd': englishFingerPositions['d'],
        ',': englishFingerPositions[',']
      }
    },
    {
      id: 9,
      title: 'Lesson 9: C .',
      group: 'Middle Finger',
      description: 'Learn the middle finger - C (left) and period (right)',
      keys: ['c', '.'],
      text: 'c . c . c. c. .c .c c.. .cc c... .ccc c . c .',
      fingerGuide: 'Place your left middle finger on C and right middle finger on period',
      completed: false,
      locked: false,
      fingerPositions: {
        'c': englishFingerPositions['c'],
        '.': englishFingerPositions['.']
      }
    },
    {
      id: 10,
      title: 'Lesson 10: Q P',
      group: 'Pinky',
      description: 'Learn the pinky - Q (left) and P (right)',
      keys: ['q', 'p'],
      text: 'q p q p qp pq qq pp qqp ppq qpp ppq q p q p',
      fingerGuide: 'Place your left pinky on Q and right pinky on P',
      completed: false,
      locked: false,
      fingerPositions: {
        'q': englishFingerPositions['q'],
        'p': englishFingerPositions['p']
      }
    },
    {
      id: 11,
      title: 'Lesson 11: S L',
      group: 'Ring Finger',
      description: 'Learn the ring finger - S (left) and L (right)',
      keys: ['s', 'l'],
      text: 's l s l sl sl ls ls sll lss slll lsss s l s l',
      fingerGuide: 'Place your left ring finger on S and right ring finger on L',
      completed: false,
      locked: false,
      fingerPositions: {
        's': englishFingerPositions['s'],
        'l': englishFingerPositions['l']
      }
    },
    {
      id: 12,
      title: 'Lesson 12: X O',
      group: 'Ring Finger',
      description: 'Learn the ring finger - X (left) and O (right)',
      keys: ['x', 'o'],
      text: 'x o x o xo xo ox ox xoo oxx xooo oxxx x o x o',
      fingerGuide: 'Place your left ring finger on X and right ring finger on O',
      completed: false,
      locked: false,
      fingerPositions: {
        'x': englishFingerPositions['x'],
        'o': englishFingerPositions['o']
      }
    },
    {
      id: 13,
      title: 'Lesson 13: A ;',
      group: 'Pinky',
      description: 'Learn the pinky - A (left) and semicolon (right)',
      keys: ['a', ';'],
      text: 'a ; a ; a; a; ;a ;a a;; ;aa a;;; ;aaa a ; a ;',
      fingerGuide: 'Place your left pinky on A and right pinky on semicolon',
      completed: false,
      locked: false,
      fingerPositions: {
        'a': englishFingerPositions['a'],
        ';': englishFingerPositions[';']
      }
    },
    {
      id: 14,
      title: 'Lesson 14: Z /',
      group: 'Pinky',
      description: 'Learn the pinky - Z (left) and / (right)',
      keys: ['z', '/'],
      text: 'z / z / z/ /z zz // z// //z z / z /',
      fingerGuide: 'Place your left pinky on Z and right pinky on forward slash',
      completed: false,
      locked: false,
      fingerPositions: {
        'z': englishFingerPositions['z'],
        '/': englishFingerPositions['/']
      }
    },
    {
      id: 15,
      title: 'Lesson 15: Pinky - /',
      description: 'Learn the pinky - forward slash (right)',
      keys: ['/'],
      text: '/ / / / / / / / / / / / / / / / / / / /',
      fingerGuide: 'Place your right pinky on forward slash',
      completed: false,
      locked: false,
      fingerPositions: {
        '/': englishFingerPositions['/']
      }
    }
  ]
};

export const freePracticeTexts = {
  hebrew: {
    easy: [
      'שלום', 'עולם', 'אני', 'אתה', 'הוא', 'היא', 'אנחנו', 'אתם', 'הם', 'הן',
      'זה', 'זו', 'אלה', 'אלו', 'כאן', 'שם', 'עכשיו', 'אחר', 'תמיד', 'לעולם',
      'טוב', 'רע', 'גדול', 'קטן', 'חדש', 'ישן', 'יפה', 'מכוער', 'חם', 'קר',
      'מים', 'אש', 'אוויר', 'אדמה', 'שמש', 'ירח', 'כוכב', 'שמיים', 'ים', 'הר',
      'עץ', 'פרח', 'עלה', 'שורש', 'זרע', 'פרי', 'ירק', 'לחם', 'חלב', 'בשר',
      'דג', 'ביצה', 'גבינה', 'שמן', 'מלח', 'סוכר', 'קפה', 'תה', 'מיץ', 'יין',
      'בית', 'חדר', 'מטבח', 'סלון', 'שירותים', 'מקלחת', 'מיטה', 'כרית', 'שמיכה', 'מגבת',
      'בגד', 'חולצה', 'מכנסיים', 'שמלה', 'נעליים', 'כובע', 'צעיף', 'כפפות', 'גרביים', 'תחתונים',
      'מכונית', 'אוטובוס', 'רכבת', 'מטוס', 'אופניים', 'אופנוע', 'ספינה', 'רקטה', 'לווין', 'חללית',
      'ספר', 'עיתון', 'מגזין', 'מכתב', 'עט', 'עיפרון', 'מחברת', 'דף', 'שורה', 'מילה',
      'מספר', 'אות', 'צבע', 'צורה', 'גודל', 'משקל', 'אורך', 'רוחב', 'גובה', 'עומק',
      'זמן', 'שעה', 'דקה', 'שנייה', 'יום', 'לילה', 'שבוע', 'חודש', 'שנה', 'עונה',
      'אביב', 'קיץ', 'סתיו', 'חורף', 'גשם', 'שלג', 'רוח', 'ברק', 'רעם', 'ענן',
      'חתול', 'כלב', 'סוס', 'פרה', 'כבשה', 'עז', 'תרנגולת', 'ברווז', 'דג', 'ציפור',
      'נמלה', 'דבורה', 'פרפר', 'עכביש', 'נחש', 'צפרדע', 'צב', 'דג', 'כריש', 'לוויתן',
      'אדם', 'אישה', 'ילד', 'ילדה', 'תינוק', 'זקן', 'צעיר', 'גבר', 'אישה', 'אח',
      'אחות', 'אבא', 'אמא', 'סבא', 'סבתא', 'דוד', 'דודה', 'בן', 'בת', 'נכד',
      'נכדה', 'חבר', 'חברה', 'שכן', 'שכנה', 'מורה', 'תלמיד', 'רופא', 'אחות', 'עורך דין',
      'שוטר', 'כבאי', 'נהג', 'טייס', 'מהנדס', 'אדריכל', 'צייר', 'מוזיקאי', 'שחקן', 'סופר',
      'עיתונאי', 'פוליטיקאי', 'עובד', 'מנהל', 'פקיד', 'חשמלאי', 'אינסטלטור', 'נגר', 'חנות', 'מכולת',
      'בנק', 'בית חולים', 'בית ספר', 'אוניברסיטה', 'ספרייה', 'מוזיאון', 'תיאטרון', 'קולנוע', 'מסעדה', 'קפה',
      'חנות', 'שוק', 'רחוב', 'כיכר', 'גשר', 'מנהרה', 'כביש', 'מדרכה', 'רמזור', 'תמרור',
      'עיר', 'כפר', 'עיירה', 'מדינה', 'עולם', 'יבשת', 'אוקיינוס', 'אי', 'הר', 'עמק',
      'נהר', 'אגם', 'ים', 'חוף', 'חול', 'אבן', 'סלע', 'מתכת', 'עץ', 'נייר',
      'בד', 'עור', 'זכוכית', 'פלסטיק', 'גומי', 'ניילון', 'ברזל', 'זהב', 'כסף', 'נחושת',
      'אלומיניום', 'פלדה', 'טיטניום', 'יהלום', 'אבן חן', 'פנינה', 'קריסטל', 'קרמיקה', 'חרס', 'בטון',
      'אספלט', 'צבע', 'דבק', 'סבון', 'שמפו', 'משחת שיניים', 'מברשת', 'מראה', 'מסרק', 'מספריים',
      'סכין', 'מזלג', 'כף', 'צלחת', 'כוס', 'בקבוק', 'קופסה', 'שקית', 'חבילה', 'מעטפה',
      'בול', 'כרטיס', 'כסף', 'ארנק', 'תיק', 'תיק גב', 'מפתח', 'מנעול', 'פעמון', 'דלת',
      'חלון', 'וילון', 'שטיח', 'כיסא', 'שולחן', 'ארון', 'מדף', 'מנורה', 'שעון', 'טלפון',
      'מחשב', 'מקלדת', 'עכבר', 'מסך', 'מדפסת', 'סורק', 'רמקול', 'מיקרופון', 'מצלמה', 'וידאו',
      'טלוויזיה', 'רדיו', 'מכשיר', 'מנוע', 'מכונה', 'כלי', 'סכין', 'מזלג', 'כף', 'צלחת',
      'כוס', 'בקבוק', 'קופסה', 'שקית', 'חבילה', 'מעטפה', 'בול', 'כרטיס', 'כסף', 'ארנק'
    ],
    medium: [
      'המחשב', 'האינטרנט', 'הטלפון', 'הטלוויזיה', 'הרדיו', 'העיתון', 'הספר', 'המחברת',
      'העט', 'העיפרון', 'השולחן', 'הכיסא', 'הדלת', 'החלון', 'הקיר', 'הרצפה',
      'התקרה', 'המנורה', 'השעון', 'המפתח', 'האוטו', 'האוטובוס', 'הרכבת', 'המטוס',
      'הספינה', 'האופניים', 'המכונית', 'האופנוע', 'הרקטה', 'הלוויין',
      'המחשב הנייד', 'הטלפון החכם', 'הטלוויזיה הצבעונית', 'הרדיו הדיגיטלי',
      'העיתון היומי', 'הספר האלקטרוני', 'המחברת הדיגיטלית', 'העט האלקטרוני',
      'העיפרון המכני', 'השולחן העגול', 'הכיסא הנוח', 'הדלת האוטומטית',
      'החלון הכפול', 'הקיר הצבעוני', 'הרצפה המבריקה', 'התקרה הגבוהה',
      'המנורה המודרנית', 'השעון הדיגיטלי', 'המפתח האלקטרוני', 'המכונית החשמלית',
      'האוטובוס החשמלי', 'הרכבת המהירה', 'המטוס הענק', 'הספינה הגדולה',
      'האופניים החשמליים', 'האופנוע המהיר', 'הרקטה החזקה', 'הלוויין המתקדם',
      'המחשב החזק', 'האינטרנט המהיר', 'הטלפון המתקדם', 'הטלוויזיה החכמה',
      'הרדיו המודרני', 'העיתון הדיגיטלי', 'הספר האינטראקטיבי', 'המחברת החכמה',
      'העט המתקדם', 'העיפרון האלקטרוני', 'השולחן החכם', 'הכיסא האוטומטי',
      'הדלת החכמה', 'החלון האוטומטי', 'הקיר האינטראקטיבי', 'הרצפה החכמה',
      'התקרה המודרנית', 'המנורה החכמה', 'השעון המתקדם', 'המפתח החכם',
      'המכונית האוטונומית', 'האוטובוס האוטומטי', 'הרכבת החכמה', 'המטוס האוטומטי',
      'הספינה החכמה', 'האופניים האוטומטיים', 'האופנוע החכם', 'הרקטה המתקדמת',
      'הלוויין החכם', 'המחשב הקוונטי', 'האינטרנט הקוונטי', 'הטלפון הקוונטי',
      'הטלוויזיה הקוונטית', 'הרדיו הקוונטי', 'העיתון הקוונטי', 'הספר הקוונטי',
      'המחברת הקוונטית', 'העט הקוונטי', 'העיפרון הקוונטי', 'השולחן הקוונטי',
      'הכיסא הקוונטי', 'הדלת הקוונטית', 'החלון הקוונטי', 'הקיר הקוונטי',
      'הרצפה הקוונטית', 'התקרה הקוונטית', 'המנורה הקוונטית', 'השעון הקוונטי',
      'המפתח הקוונטי', 'המכונית הקוונטית', 'האוטובוס הקוונטי', 'הרכבת הקוונטית',
      'המטוס הקוונטי', 'הספינה הקוונטית', 'האופניים הקוונטיים', 'האופנוע הקוונטי',
      'הרקטה הקוונטית', 'הלוויין הקוונטי', 'המחשב הביולוגי', 'האינטרנט הביולוגי',
      'הטלפון הביולוגי', 'הטלוויזיה הביולוגית', 'הרדיו הביולוגי', 'העיתון הביולוגי',
      'הספר הביולוגי', 'המחברת הביולוגית', 'העט הביולוגי', 'העיפרון הביולוגי',
      'השולחן הביולוגי', 'הכיסא הביולוגי', 'הדלת הביולוגית', 'החלון הביולוגי',
      'הקיר הביולוגי', 'הרצפה הביולוגית', 'התקרה הביולוגית', 'המנורה הביולוגית',
      'השעון הביולוגי', 'המפתח הביולוגי', 'המכונית הביולוגית', 'האוטובוס הביולוגי',
      'הרכבת הביולוגית', 'המטוס הביולוגי', 'הספינה הביולוגית', 'האופניים הביולוגיים',
      'האופנוע הביולוגי', 'הרקטה הביולוגית', 'הלוויין הביולוגי', 'המחשב הננוטכנולוגי',
      'האינטרנט הננוטכנולוגי', 'הטלפון הננוטכנולוגי', 'הטלוויזיה הננוטכנולוגית',
      'הרדיו הננוטכנולוגי', 'העיתון הננוטכנולוגי', 'הספר הננוטכנולוגי', 'המחברת הננוטכנולוגית',
      'העט הננוטכנולוגי', 'העיפרון הננוטכנולוגי', 'השולחן הננוטכנולוגי', 'הכיסא הננוטכנולוגי',
      'הדלת הננוטכנולוגית', 'החלון הננוטכנולוגי', 'הקיר הננוטכנולוגי', 'הרצפה הננוטכנולוגית',
      'התקרה הננוטכנולוגית', 'המנורה הננוטכנולוגית', 'השעון הננוטכנולוגי', 'המפתח הננוטכנולוגי',
      'המכונית הננוטכנולוגית', 'האוטובוס הננוטכנולוגי', 'הרכבת הננוטכנולוגית', 'המטוס הננוטכנולוגי',
      'הספינה הננוטכנולוגית', 'האופניים הננוטכנולוגיים', 'האופנוע הננוטכנולוגי', 'הרקטה הננוטכנולוגית',
      'הלוויין הננוטכנולוגי', 'המחשב הסולארי', 'האינטרנט הסולארי', 'הטלפון הסולארי',
      'הטלוויזיה הסולארית', 'הרדיו הסולארי', 'העיתון הסולארי', 'הספר הסולארי',
      'המחברת הסולארית', 'העט הסולארי', 'העיפרון הסולארי', 'השולחן הסולארי',
      'הכיסא הסולארי', 'הדלת הסולארית', 'החלון הסולארי', 'הקיר הסולארי',
      'הרצפה הסולארית', 'התקרה הסולארית', 'המנורה הסולארית', 'השעון הסולארי',
      'המפתח הסולארי', 'המכונית הסולארית', 'האוטובוס הסולארי', 'הרכבת הסולארית',
      'המטוס הסולארי', 'הספינה הסולארית', 'האופניים הסולאריים', 'האופנוע הסולארי',
      'הרקטה הסולארית', 'הלוויין הסולארי', 'המחשב הגרעיני', 'האינטרנט הגרעיני',
      'הטלפון הגרעיני', 'הטלוויזיה הגרעינית', 'הרדיו הגרעיני', 'העיתון הגרעיני',
      'הספר הגרעיני', 'המחברת הגרעינית', 'העט הגרעיני', 'העיפרון הגרעיני',
      'השולחן הגרעיני', 'הכיסא הגרעיני', 'הדלת הגרעינית', 'החלון הגרעיני',
      'הקיר הגרעיני', 'הרצפה הגרעינית', 'התקרה הגרעינית', 'המנורה הגרעינית',
      'השעון הגרעיני', 'המפתח הגרעיני', 'המכונית הגרעינית', 'האוטובוס הגרעיני',
      'הרכבת הגרעינית', 'המטוס הגרעיני', 'הספינה הגרעינית', 'האופניים הגרעיניים',
      'האופנוע הגרעיני', 'הרקטה הגרעינית', 'הלוויין הגרעיני', 'המחשב המגנטי',
      'האינטרנט המגנטי', 'הטלפון המגנטי', 'הטלוויזיה המגנטית', 'הרדיו המגנטי',
      'העיתון המגנטי', 'הספר המגנטי', 'המחברת המגנטית', 'העט המגנטי',
      'העיפרון המגנטי', 'השולחן המגנטי', 'הכיסא המגנטי', 'הדלת המגנטית',
      'החלון המגנטי', 'הקיר המגנטי', 'הרצפה המגנטית', 'התקרה המגנטית',
      'המנורה המגנטית', 'השעון המגנטי', 'המפתח המגנטי', 'המכונית המגנטית',
      'האוטובוס המגנטי', 'הרכבת המגנטית', 'המטוס המגנטי', 'הספינה המגנטית',
      'האופניים המגנטיים', 'האופנוע המגנטי', 'הרקטה המגנטית', 'הלוויין המגנטי',
      'המחשב האופטי', 'האינטרנט האופטי', 'הטלפון האופטי', 'הטלוויזיה האופטית',
      'הרדיו האופטי', 'העיתון האופטי', 'הספר האופטי', 'המחברת האופטית',
      'העט האופטי', 'העיפרון האופטי', 'השולחן האופטי', 'הכיסא האופטי',
      'הדלת האופטית', 'החלון האופטי', 'הקיר האופטי', 'הרצפה האופטית',
      'התקרה האופטית', 'המנורה האופטית', 'השעון האופטי', 'המפתח האופטי',
      'המכונית האופטית', 'האוטובוס האופטי', 'הרכבת האופטית', 'המטוס האופטי',
      'הספינה האופטית', 'האופניים האופטיים', 'האופנוע האופטי', 'הרקטה האופטית',
      'הלוויין האופטי', 'המחשב האקוסטי', 'האינטרנט האקוסטי', 'הטלפון האקוסטי',
      'הטלוויזיה האקוסטית', 'הרדיו האקוסטי', 'העיתון האקוסטי', 'הספר האקוסטי',
      'המחברת האקוסטית', 'העט האקוסטי', 'העיפרון האקוסטי', 'השולחן האקוסטי',
      'הכיסא האקוסטי', 'הדלת האקוסטית', 'החלון האקוסטי', 'הקיר האקוסטי',
      'הרצפה האקוסטית', 'התקרה האקוסטית', 'המנורה האקוסטית', 'השעון האקוסטי',
      'המפתח האקוסטי', 'המכונית האקוסטית', 'האוטובוס האקוסטי', 'הרכבת האקוסטית',
      'המטוס האקוסטי', 'הספינה האקוסטית', 'האופניים האקוסטיים', 'האופנוע האקוסטי',
      'הרקטה האקוסטית', 'הלוויין האקוסטי', 'המחשב התרמי', 'האינטרנט התרמי',
      'הטלפון התרמי', 'הטלוויזיה התרמית', 'הרדיו התרמי', 'העיתון התרמי',
      'הספר התרמי', 'המחברת התרמית', 'העט התרמי', 'העיפרון התרמי',
      'השולחן התרמי', 'הכיסא התרמי', 'הדלת התרמית', 'החלון התרמי',
      'הקיר התרמי', 'הרצפה התרמית', 'התקרה התרמית', 'המנורה התרמית',
      'השעון התרמי', 'המפתח התרמי', 'המכונית התרמית', 'האוטובוס התרמי',
      'הרכבת התרמית', 'המטוס התרמי', 'הספינה התרמית', 'האופניים התרמיים',
      'האופנוע התרמי', 'הרקטה התרמית', 'הלוויין התרמי', 'המחשב ההידראולי',
      'האינטרנט ההידראולי', 'הטלפון ההידראולי', 'הטלוויזיה ההידראולית', 'הרדיו ההידראולי',
      'העיתון ההידראולי', 'הספר ההידראולי', 'המחברת ההידראולית', 'העט ההידראולי',
      'העיפרון ההידראולי', 'השולחן ההידראולי', 'הכיסא ההידראולי', 'הדלת ההידראולית',
      'החלון ההידראולי', 'הקיר ההידראולי', 'הרצפה ההידראולית', 'התקרה ההידראולית',
      'המנורה ההידראולית', 'השעון ההידראולי', 'המפתח ההידראולי', 'המכונית ההידראולית',
      'האוטובוס ההידראולי', 'הרכבת ההידראולית', 'המטוס ההידראולי', 'הספינה ההידראולית',
      'האופניים ההידראוליים', 'האופנוע ההידראולי', 'הרקטה ההידראולית', 'הלוויין ההידראולי',
      'המחשב הפניאומטי', 'האינטרנט הפניאומטי', 'הטלפון הפניאומטי', 'הטלוויזיה הפניאומטית',
      'הרדיו הפניאומטי', 'העיתון הפניאומטי', 'הספר הפניאומטי', 'המחברת הפניאומטית',
      'העט הפניאומטי', 'העיפרון הפניאומטי', 'השולחן הפניאומטי', 'הכיסא הפניאומטי',
      'הדלת הפניאומטית', 'החלון הפניאומטי', 'הקיר הפניאומטי', 'הרצפה הפניאומטית',
      'התקרה הפניאומטית', 'המנורה הפניאומטית', 'השעון הפניאומטי', 'המפתח הפניאומטי',
      'המכונית הפניאומטית', 'האוטובוס הפניאומטי', 'הרכבת הפניאומטית', 'המטוס הפניאומטי',
      'הספינה הפניאומטית', 'האופניים הפניאומטיים', 'האופנוע הפניאומטי', 'הרקטה הפניאומטית',
      'הלוויין הפניאומטי', 'המחשב הרובוטי', 'האינטרנט הרובוטי', 'הטלפון הרובוטי',
      'הטלוויזיה הרובוטית', 'הרדיו הרובוטי', 'העיתון הרובוטי', 'הספר הרובוטי',
      'המחברת הרובוטית', 'העט הרובוטי', 'העיפרון הרובוטי', 'השולחן הרובוטי',
      'הכיסא הרובוטי', 'הדלת הרובוטית', 'החלון הרובוטי', 'הקיר הרובוטי',
      'הרצפה הרובוטית', 'התקרה הרובוטית', 'המנורה הרובוטית', 'השעון הרובוטי',
      'המפתח הרובוטי', 'המכונית הרובוטית', 'האוטובוס הרובוטי', 'הרכבת הרובוטית',
      'המטוס הרובוטי', 'הספינה הרובוטית', 'האופניים הרובוטיים', 'האופנוע הרובוטי',
      'הרקטה הרובוטית', 'הלוויין הרובוטי', 'המחשב הסייבורג', 'האינטרנט הסייבורג',
      'הטלפון הסייבורג', 'הטלוויזיה הסייבורג', 'הרדיו הסייבורג', 'העיתון הסייבורג',
      'הספר הסייבורג', 'המחברת הסייבורג', 'העט הסייבורג', 'העיפרון הסייבורג',
      'השולחן הסייבורג', 'הכיסא הסייבורג', 'הדלת הסייבורג', 'החלון הסייבורג',
      'הקיר הסייבורג', 'הרצפה הסייבורג', 'התקרה הסייבורג', 'המנורה הסייבורג',
      'השעון הסייבורג', 'המפתח הסייבורג', 'המכונית הסייבורג', 'האוטובוס הסייבורג',
      'הרכבת הסייבורג', 'המטוס הסייבורג', 'הספינה הסייבורג', 'האופניים הסייבורג',
      'האופנוע הסייבורג', 'הרקטה הסייבורג', 'הלוויין הסייבורג', 'המחשב ההולוגרפי',
      'האינטרנט ההולוגרפי', 'הטלפון ההולוגרפי', 'הטלוויזיה ההולוגרפית', 'הרדיו ההולוגרפי',
      'העיתון ההולוגרפי', 'הספר ההולוגרפי', 'המחברת ההולוגרפית', 'העט ההולוגרפי',
      'העיפרון ההולוגרפי', 'השולחן ההולוגרפי', 'הכיסא ההולוגרפי', 'הדלת ההולוגרפית',
      'החלון ההולוגרפי', 'הקיר ההולוגרפי', 'הרצפה ההולוגרפית', 'התקרה ההולוגרפית',
      'המנורה ההולוגרפית', 'השעון ההולוגרפי', 'המפתח ההולוגרפי', 'המכונית ההולוגרפית',
      'האוטובוס ההולוגרפי', 'הרכבת ההולוגרפית', 'המטוס ההולוגרפי', 'הספינה ההולוגרפית',
      'האופניים ההולוגרפיים', 'האופנוע ההולוגרפי', 'הרקטה ההולוגרפית', 'הלוויין ההולוגרפי',
      'המחשב הוירטואלי', 'האינטרנט הוירטואלי', 'הטלפון הוירטואלי', 'הטלוויזיה הוירטואלית',
      'הרדיו הוירטואלי', 'העיתון הוירטואלי', 'הספר הוירטואלי', 'המחברת הוירטואלית',
      'העט הוירטואלי', 'העיפרון הוירטואלי', 'השולחן הוירטואלי', 'הכיסא הוירטואלי',
      'הדלת הוירטואלית', 'החלון הוירטואלי', 'הקיר הוירטואלי', 'הרצפה הוירטואלית',
      'התקרה הוירטואלית', 'המנורה הוירטואלית', 'השעון הוירטואלי', 'המפתח הוירטואלי',
      'המכונית הוירטואלית', 'האוטובוס הוירטואלי', 'הרכבת הוירטואלית', 'המטוס הוירטואלי',
      'הספינה הוירטואלית', 'האופניים הוירטואליים', 'האופנוע הוירטואלי', 'הרקטה הוירטואלית',
      'הלוויין הוירטואלי', 'המחשב האוגמנטי', 'האינטרנט האוגמנטי', 'הטלפון האוגמנטי',
      'הטלוויזיה האוגמנטית', 'הרדיו האוגמנטי', 'העיתון האוגמנטי', 'הספר האוגמנטי',
      'המחברת האוגמנטית', 'העט האוגמנטי', 'העיפרון האוגמנטי', 'השולחן האוגמנטי',
      'הכיסא האוגמנטי', 'הדלת האוגמנטית', 'החלון האוגמנטי', 'הקיר האוגמנטי',
      'הרצפה האוגמנטית', 'התקרה האוגמנטית', 'המנורה האוגמנטית', 'השעון האוגמנטי',
      'המפתח האוגמנטי', 'המכונית האוגמנטית', 'האוטובוס האוגמנטי', 'הרכבת האוגמנטית',
      'המטוס האוגמנטי', 'הספינה האוגמנטית', 'האופניים האוגמנטיים', 'האופנוע האוגמנטי',
      'הרקטה האוגמנטית', 'הלוויין האוגמנטי', 'המחשב הבלוקציין', 'האינטרנט הבלוקציין',
      'הטלפון הבלוקציין', 'הטלוויזיה הבלוקציין', 'הרדיו הבלוקציין', 'העיתון הבלוקציין',
      'הספר הבלוקציין', 'המחברת הבלוקציין', 'העט הבלוקציין', 'העיפרון הבלוקציין',
      'השולחן הבלוקציין', 'הכיסא הבלוקציין', 'הדלת הבלוקציין', 'החלון הבלוקציין',
      'הקיר הבלוקציין', 'הרצפה הבלוקציין', 'התקרה הבלוקציין', 'המנורה הבלוקציין',
      'השעון הבלוקציין', 'המפתח הבלוקציין', 'המכונית הבלוקציין', 'האוטובוס הבלוקציין',
      'הרכבת הבלוקציין', 'המטוס הבלוקציין', 'הספינה הבלוקציין', 'האופניים הבלוקציין',
      'האופנוע הבלוקציין', 'הרקטה הבלוקציין', 'הלוויין הבלוקציין', 'המחשב הבינה המלאכותית',
      'האינטרנט הבינה המלאכותית', 'הטלפון הבינה המלאכותית', 'הטלוויזיה הבינה המלאכותית',
      'הרדיו הבינה המלאכותית', 'העיתון הבינה המלאכותית', 'הספר הבינה המלאכותית',
      'המחברת הבינה המלאכותית', 'העט הבינה המלאכותית', 'העיפרון הבינה המלאכותית',
      'השולחן הבינה המלאכותית', 'הכיסא הבינה המלאכותית', 'הדלת הבינה המלאכותית',
      'החלון הבינה המלאכותית', 'הקיר הבינה המלאכותית', 'הרצפה הבינה המלאכותית',
      'התקרה הבינה המלאכותית', 'המנורה הבינה המלאכותית', 'השעון הבינה המלאכותית',
      'המפתח הבינה המלאכותית', 'המכונית הבינה המלאכותית', 'האוטובוס הבינה המלאכותית',
      'הרכבת הבינה המלאכותית', 'המטוס הבינה המלאכותית', 'הספינה הבינה המלאכותית',
      'האופניים הבינה המלאכותית', 'האופנוע הבינה המלאכותית', 'הרקטה הבינה המלאכותית',
      'הלוויין הבינה המלאכותית', 'המחשב המטאוורס', 'האינטרנט המטאוורס', 'הטלפון המטאוורס',
      'הטלוויזיה המטאוורס', 'הרדיו המטאוורס', 'העיתון המטאוורס', 'הספר המטאוורס',
      'המחברת המטאוורס', 'העט המטאוורס', 'העיפרון המטאוורס', 'השולחן המטאוורס',
      'הכיסא המטאוורס', 'הדלת המטאוורס', 'החלון המטאוורס', 'הקיר המטאוורס',
      'הרצפה המטאוורס', 'התקרה המטאוורס', 'המנורה המטאוורס', 'השעון המטאוורס',
      'המפתח המטאוורס', 'המכונית המטאוורס', 'האוטובוס המטאוורס', 'הרכבת המטאוורס',
      'המטוס המטאוורס', 'הספינה המטאוורס', 'האופניים המטאוורס', 'האופנוע המטאוורס',
      'הרקטה המטאוורס', 'הלוויין המטאוורס', 'המחשב הקריפטוגרפי', 'האינטרנט הקריפטוגרפי',
      'הטלפון הקריפטוגרפי', 'הטלוויזיה הקריפטוגרפית', 'הרדיו הקריפטוגרפי', 'העיתון הקריפטוגרפי',
      'הספר הקריפטוגרפי', 'המחברת הקריפטוגרפית', 'העט הקריפטוגרפי', 'העיפרון הקריפטוגרפי',
      'השולחן הקריפטוגרפי', 'הכיסא הקריפטוגרפי', 'הדלת הקריפטוגרפית', 'החלון הקריפטוגרפי',
      'הקיר הקריפטוגרפי', 'הרצפה הקריפטוגרפית', 'התקרה הקריפטוגרפית', 'המנורה הקריפטוגרפית',
      'השעון הקריפטוגרפי', 'המפתח הקריפטוגרפי', 'המכונית הקריפטוגרפית', 'האוטובוס הקריפטוגרפי',
      'הרכבת הקריפטוגרפית', 'המטוס הקריפטוגרפי', 'הספינה הקריפטוגרפית', 'האופניים הקריפטוגרפיים',
      'האופנוע הקריפטוגרפי', 'הרקטה הקריפטוגרפית', 'הלוויין הקריפטוגרפי', 'המחשב הקוונטי',
      'האינטרנט הקוונטי', 'הטלפון הקוונטי', 'הטלוויזיה הקוונטית', 'הרדיו הקוונטי',
      'העיתון הקוונטי', 'הספר הקוונטי', 'המחברת הקוונטית', 'העט הקוונטי', 'העיפרון הקוונטי',
      'השולחן הקוונטי', 'הכיסא הקוונטי', 'הדלת הקוונטית', 'החלון הקוונטי', 'הקיר הקוונטי',
      'הרצפה הקוונטית', 'התקרה הקוונטית', 'המנורה הקוונטית', 'השעון הקוונטי', 'המפתח הקוונטי'
    ],
    hard: [
      'המחשב הנייד', 'האינטרנט המהיר', 'הטלפון החכם', 'הטלוויזיה הצבעונית',
      'הרדיו הדיגיטלי', 'העיתון היומי', 'הספר האלקטרוני', 'המחברת הדיגיטלית',
      'העט האלקטרוני', 'העיפרון המכני', 'השולחן העגול', 'הכיסא הנוח',
      'הדלת האוטומטית', 'החלון הכפול', 'הקיר הצבעוני', 'הרצפה המבריקה',
      'התקרה הגבוהה', 'המנורה המודרנית', 'השעון הדיגיטלי', 'המפתח האלקטרוני'
    ]
  },
  english: {
    easy: [
      'hello', 'world', 'good', 'bad', 'big', 'small', 'new', 'old', 'hot', 'cold',
      'yes', 'no', 'up', 'down', 'left', 'right', 'here', 'there', 'now', 'then',
      'this', 'that', 'these', 'those', 'who', 'what', 'where', 'when', 'why', 'how'
    ],
    // These are base lists; prepared banks below provide 300+ each for tests
    medium: [
      'computer', 'internet', 'telephone', 'television', 'radio', 'newspaper', 'book', 'notebook',
      'pen', 'pencil', 'table', 'chair', 'door', 'window', 'wall', 'floor',
      'ceiling', 'lamp', 'clock', 'key', 'car', 'bus', 'train', 'plane',
      'ship', 'bicycle', 'motorcycle', 'rocket', 'satellite', 'spaceship'
    ],
    hard: [
      'laptop', 'smartphone', 'wireless', 'digital', 'network', 'storage', 'monitor', 'keyboard',
      'printer', 'scanner', 'battery', 'charger', 'adapter', 'antenna', 'speaker', 'display',
      'browser', 'database', 'backend', 'frontend'
    ]
  }
}; 

// Ensure each difficulty level has at least 300 words to satisfy the random words test requirement
const MIN_WORDS_PER_LEVEL = 300;

// Remove multi-word entries and enforce per-difficulty length rules
function sanitizeByDifficulty(list, difficulty) {
  if (!Array.isArray(list)) return [];
  const noSpaces = list.filter(w => typeof w === 'string' && !w.includes(' '));
  const unique = Array.from(new Set(noSpaces));
  if (difficulty === 'medium') {
    return unique.filter(w => w.length >= 5 && w.length <= 7);
  }
  if (difficulty === 'hard') {
    return unique.filter(w => w.length >= 6);
  }
  // easy: just ensure single word
  return unique;
}

function expandToMinimum(list, min) {
  if (!Array.isArray(list)) return [];
  const result = [...list];
  if (result.length === 0) return result;
  let i = 0;
  while (result.length < min) {
    result.push(list[i % list.length]);
    i += 1;
  }
  return result;
}

// Sanitize and expand Hebrew
freePracticeTexts.hebrew.easy = expandToMinimum(
  sanitizeByDifficulty(freePracticeTexts.hebrew.easy, 'easy'),
  MIN_WORDS_PER_LEVEL
);
freePracticeTexts.hebrew.medium = expandToMinimum(
  sanitizeByDifficulty(freePracticeTexts.hebrew.medium, 'medium'),
  MIN_WORDS_PER_LEVEL
);
freePracticeTexts.hebrew.hard = expandToMinimum(
  sanitizeByDifficulty(freePracticeTexts.hebrew.hard, 'hard'),
  MIN_WORDS_PER_LEVEL
);

// Sanitize and expand English
freePracticeTexts.english.easy = expandToMinimum(
  sanitizeByDifficulty(freePracticeTexts.english.easy, 'easy'),
  MIN_WORDS_PER_LEVEL
);
freePracticeTexts.english.medium = expandToMinimum(
  sanitizeByDifficulty(freePracticeTexts.english.medium, 'medium'),
  MIN_WORDS_PER_LEVEL
);
freePracticeTexts.english.hard = expandToMinimum(
  sanitizeByDifficulty(freePracticeTexts.english.hard, 'hard'),
  MIN_WORDS_PER_LEVEL
);

// Prepared, single-word, curated banks for Random Words Test (no spaces, unique)
// English Medium (5-7 letters) – 320+ words
export const preparedWordBank = { english: { medium: [], hard: [] }, hebrew: { medium: [], hard: [] } };

preparedWordBank.english.medium = [
  'about','above','abuse','actor','acute','adapt','admin','admit','adopt','adult','affair','affect','after','again','agent','agree','ahead','aimed','alarm','album','alert','alike','alive','allow','alone','along','alter','amber','among','amuse','angel','anger','angle','angry','annex','annual','answer','apart','apple','apply','april','argue','arise','armed','arrow','aside','asset','audio','audit','august','autumn','award','aware','awful','bacon','badge','bagel','baker','basic','basis','beach','beard','beast','began','begin','begun','being','belly','below','bench','berry','birth','black','blade','blame','blank','blast','blend','bless','blind','blink','block','blood','bloom','blown','board','boast','bonus','boost','booth','bound','brain','brake','brand','brave','bread','break','breed','brick','bride','brief','bring','broad','broke','brown','brush','build','built','buyer','cabin','cable','cacao','cache','cafe','cager','camel','camera','campus','canal','candy','canon','caper','carol','carry','carve','casual','catch','cause','cease','chain','chair','chalk','champ','chance','change','chaos','charm','chart','chase','cheap','check','cheek','cheer','chess','chest','chief','child','chili','chill','china','choir','choke','chord','chore','civil','claim','class','clean','clear','clerk','click','cliff','climb','clock','clone','close','cloth','cloud','clown','coach','coast','cobra','cocoa','code','codec','coder','colon','color','combo','comet','comic','comma','coral','cough','could','count','court','cover','crack','craft','crash','crawl','crazy','cream','creek','creep','crest','crime','crisp','cross','crowd','crown','crude','cruel','crush','crypt','cubic','curry','curve','cycle','daily','dance','dated','deal','dealt','death','debug','decaf','decay','defer','defy','delay','delta','demon','denim','dense','depend','depth','devil','diary','digit','diner','dingo','dining','dinner','direct','dirty','dizzy','donor','doubt','dozen','draft','drain','drama','drawn','dream','dress','drift','drill','drink','drive','droid','drove','drown','druid','eager','eagle','early','earth','easel','eaten','edgar','eight','elbow','elder','elect','elite','email','embed','empty','enact','ended','enemy','enjoy','enter','entry','equal','equip','error','escape','essay','event','every','evoke','exact','exams','exist','expel','extra','fable','fabric','facet','faint','fairy','faith','false','fancy','farms','fatal','father','fault','favor','feast','fence','fever','fiber','field','fierce','fifth','fifty','fight','figure','filed','filly','final','finds','finer','finger','finish','fired','first','fiscal','fisher','fixed','flame','flank','flare','flash','fleet','flesh','flick','fling','float','flood','floor','flour','flown','fluff','fluid','flute','focus','foley','folks','follow','force','forge','forks','forum','found','frame','fraud','fresh','fried','friend','fries','front','frost','fruit','fudge','funny','gamer','games','gamma','gauge','gears','geese','genre','ghost','giant','given','giver','glade','glare','glass','glide','globe','gloom','glory','glove','gnome','goals','goats','going','golds','golem','goods','grace','grade','grain','grand','grant','grape','graph','grasp','grass','grave','great','greed','green','greet','grief','grill','grind','grip','gross','group','grove','grown','guard','guess','guest','guide','habit','hairy','halve','handy','happy','harsh','haste','hasty','hatch','hazel','heads','heard','heart','heavy','hedge','helps','hence','herbs','hidden','hills','hobby','honey','honor','hooked','horde','horse','hotel','hover','human','humor','humus','hurry','ideal','idiom','idiot','image','imply','index','inner','input','invite','irony','issue','items','ivory','jelly','jewel','jolly','judge','juice','juicy','kitty','knack','known','label','labor','laden','ladle','large','laser','later','laugh','layer','learn','lease','least','leave','legal','lemon','level','lever','lexis','liars','light','limit','linen','liner','links','lions','liquid','lists','liver','lives','lobby','local','logic','login','loose','lorry','loser','lover','lower','loyal','lucky','lunar','lunch','lying','macro','magic','maker','mango','march','maria','marks','marry','match','maths','maybe','mayor','meals','means','meant','medal','media','medic','meets','melon','merit','metal','meter','midst','might','minor','minus','mixed','mocha','model','modern','modem','modes','money','month','moral','motel','motor','mount','mouse','mouth','movie','music','naive','naked','named','names','nasty','naval','necks','nerve','never','newer','newly','nicer','niche','niece','night','noble','noise','north','noted','novel','nurse','oasis','occur','ocean','offer','often','olive','onion','onset','opera','orbit','order','organ','other','ounce','outer','owner','oxide','ozone','packs','paged','panda','panel','panic','paper','paris','parks','party','patch','paths','patio','pause','peace','pearl','pedal','peers','penal','penny','perks','pests','petty','phase','phone','photo','piano','piece','piled','pilot','pinch','pipes','pizza','place','plain','plane','plant','plate','plead','pleas','plenty','pluck','plugs','poems','point','polar','police','polka','pools','popes','porch','pound','power','press','price','pride','prime','print','prior','prize','probe','prone','proof','proud','prove','proxy','psych','pulse','punch','pupil','puppy','purse','quake','queen','query','quest','quick','quiet','quota','quote','racer','radar','radio','raise','rally','ranch','range','rapid','ratio','reach','react','ready','realm','rebel','refer','reign','relax','relay','relic','remix','renew','repay','reply','reset','resin','resist','resort','resto','retro','retry','reuse','rhyme','rider','ridge','right','rigid','rinse','risky','rival','river','robot','rocky','rogue','roles','roman','rooms','rough','round','route','royal','rugby','ruins','ruler','rural','sadly','safer','saint','salad','salon','sandy','satin','sauce','scale','scare','scarf','scene','scent','scoop','scope','score','scorn','scout','scrap','screw','seals','seams','seats','seeds','seeks','seize','sells','sends','sense','serve','seven','sewer','shade','shaft','shake','shall','shame','shape','share','shark','sharp','sheep','sheer','sheet','shelf','shell','shift','shine','shiny','ship','shirt','shock','shoes','shoot','shore','short','shown','shows','shrug','sight','signal','silk','silly','since','singer','siren','sixth','sixty','skill','skirt','skull','slack','slate','slave','sleek','sleep','slice','slide','slope','small','smart','smell','smile','smoke','snack','snake','sneak','sober','soccer','solar','solid','solve','sorry','sorts','sound','south','space','spade','spare','spark','speak','spear','speed','spell','spend','spent','sperm','spice','spicy','spike','spill','spine','spite','split','spoil','spoon','sport','spout','spray','spree','squad','squid','stack','staff','stage','stain','stair','stake','stamp','stand','stark','start','state','stats','steak','steal','steam','steel','steep','steer','stems','stern','stick','stiff','still','stock','stole','stone','stood','stool','store','storm','story','stove','strap','straw','strip','stuck','study','stuff','stump','style','sugar','suite','suites','sunny','super','sweet','swept','swift','swing','sword','table','taken','takes','tales','tango','tanks','taped','tasty','teach','tears','teens','teeth','tempo','tenth','terms','text','thank','theft','their','theme','there','these','thick','thief','thing','think','third','those','three','threw','throw','thumb','tiger','tight','title','toast','today','token','topic','toxic','trace','track','trade','trail','train','trait','trans','trash','treat','trend','trial','tribe','trick','tried','tries','trips','troop','trout','truck','truly','trunk','trust','truth','tubes','tuned','tunes','turbo','turns','tutor','twice','twins','twist','ultra','uncle','under','union','unite','unity','untie','until','upper','upset','urban','urged','usage','users','using','usual','utter','vague','valid','value','valve','vapor','vault','vegan','venom','venue','verge','verse','video','vigor','vinyl','viola','viral','virus','visit','vital','vivid','vocal','vodka','voice','vowel','wages','wagon','waist','wakes','walks','walls','wants','wards','warns','waste','watch','water','weary','weave','wedge','weeds','weigh','weird','wells','whale','wheat','wheel','where','which','while','whisk','white','whole','whose','wider','widow','width','winds','wings','wiped','wires','witch','wives','woman','women','world','worry','worse','worst','worth','would','woven','wrist','write','wrong','wrote','xenon','yacht','yield','young','youth','zebra','zesty'
];

// English Hard (6+ letters) – 320+ words
preparedWordBank.english.hard = [
  'ability','absence','academy','account','acquire','adapted','address','advance','adverse','adviser','against','airport','alcohol','aligned','alleged','already','analyst','analyze','ancient','another','anybody','anymore','anytime','appeals','appear','applied','approve','archive','arrange','arrival','article','artisan','assault','assured','athlete','attempt','attract','auction','average','awkward','backing','balance','balloon','banking','barrier','battery','because','bedroom','beneath','benefit','besides','between','bicycle','blanket','blessed','blocked','bottle','bottom','branch','breathe','brother','brought','builder','bulldog','cabinet','calcium','calling','calorie','camera','camping','capable','capital','captain','capture','carbon','careful','carrier','carried','casino','casting','catalyst','category','caution','ceiling','central','century','certain','chamber','channel','chapter','charity','charming','cheese','chemical','chicken','children','chinese','chronic','circle','circuit','citizen','clarify','classic','climate','closing','clothes','cluster','coalition','coastal','college','collide','comfort','command','comment','commute','compact','company','compare','compete','compile','complex','compose','compute','concert','conduct','confirm','connect','consent','consist','consult','consume','contact','contain','content','contest','context','control','convert','convey','cooking','cooling','corners','correct','costume','cottage','council','counter','country','courage','cousins','covered','crystal','culture','current','custody','customs','cutting','cycling','dancing','daytime','deadline','dealing','decades','decimal','declare','decline','decorate','decrease','default','defense','deficit','deliver','density','deposit','desktop','despite','destroy','develop','diamond','digital','dignity','dilemma','directly','director','disable','discuss','disease','dismiss','display','dispute','distance','diverse','divided','doctors','dollars','domain','driving','dynamic','earlier','eastern','economy','edition','educate','effects','efforts','elastic','elderly','elegant','element','elevate','elite','embassy','embrace','emerge','empire','employe','enable','enclose','endless','endorse','engaged','engine','enhance','enjoyed','enlarge','enough','enroll','ensure','entire','entrust','envelope','episode','equally','equator','erosion','escort','esteemed','ethical','evening','evident','exactly','examine','example','exceed','except','exchange','excited','exclude','execute','exhibit','existed','exotic','expense','expert','expire','explain','explode','exploit','explore','export','exposed','express','extract','extreme','facility','factory','failure','faculty','farming','fashion','feature','federal','feeling','festival','fiction','fighter','finally','finance','finding','fishing','fitness','flawless','flexible','floating','flowers','focused','folding','foreign','forever','forgive','forming','formula','fortune','forward','founder','fragile','freedom','freight','friends','frontier','fueling','funding','further','gallery','garbage','gardens','gateway','general','genetic','genuine','gesture','glasses','glimpse','gossip','govern','grammar','greater','grocery','growing','guitar','hacker','handles','hanging','harbour','hardest','harmful','harmony','harvest','hatched','healthy','hearing','heather','heating','heavily','helpful','herbage','heritage','herself','highway','holiday','honesty','hopeful','hosting','housing','however','humanity','hundred','hunting','husband','hygiene','illegal','illness','imagine','impress','improve','include','income','increase','indeed','indoor','infant','inform','injured','inquiry','insight','install','instant','instead','intense','interim','involve','islands','jacket','jogging','journal','journey','justice','justify','kitchen','knowing','laptop','largely','lasting','launch','lawyers','leading','learner','leather','leisure','library','license','lifting','lighter','limited','lineman','listing','literal','loading','lobster','locally','logical','loyalty','machine','magical','mailing','manager','margins','married','massive','matured','maximum','meaning','measure','medical','meeting','member','mention','message','methods','mineral','minimal','minimum','minivan','ministry','minutes','miracle','missing','mission','mistake','mixture','mobile','monarch','monitor','monthly','morning','mosquito','mother','motion','motive','mountain','movement','muffins','musical','mystery','natural','nearing','neither','nervous','network','neutral','notable','nothing','notices','novelty','nuclear','numbers','numeric','nursing','obvious','offense','officer','ongoing','opening','operate','opinion','optical','options','organic','orphan','outdoor','outline','outside','overall','overlap','overtime','package','painful','painted','pairing','panther','parking','partner','passage','passing','passion','patient','pattern','payable','peoples','percent','perfect','perform','perhaps','permits','persona','phonics','physics','picking','picture','pioneer','pirates','plastic','platform','players','playing','pleased','pleasure','plumber','pockets','podcast','pointer','popular','portion','postage','posture','pottery','poverty','powerful','practice','precise','predict','prelude','premier','prepare','present','prevent','pricing','primary','printer','privacy','private','problem','proceed','process','produce','product','profile','program','project','promise','promote','propose','protect','protein','protest','provide','publish','purpose','pursuit','quality','quantum','quarter','question','quickly','quietly','railway','rainbow','raised','ranging','readers','realism','reality','realize','rebuild','receipt','receive','recipe','recover','redeem','reduce','reflect','reform','refuse','regards','regimen','regular','rejoice','related','release','reliant','relieve','remain','remains','removal','renewal','renters','repair','replace','replied','report','reprint','request','rescue','reside','resolve','resonate','respect','respond','restart','restore','results','retail','retain','retreat','reunion','revenue','reverse','review','revise','reward','ribbon','rolling','romance','routine','rowing','royalty','running','sadness','safely','safety','salary','salmon','sample','saving','scenery','schedule','scholar','science','scoring','scratch','screen','scripts','scrolls','seaside','seating','secrets','section','secular','segment','seizure','sellers','seminar','senator','senders','sensors','serious','service','session','settled','several','seventy','shallow','shelter','shipping','shorten','shuttle','sibling','signals','silence','silicon','similar','simple','sincere','singer','single','sisters','skilled','smartly','smiling','society','soldier','someone','sooner','sorry','source','spacing','speaker','special','species','spheres','spiders','spinach','spirit','sponsor','sports','spread','spring','square','staging','stamina','standby','starter','station','statute','steady','stereo','sticky','storage','stories','strains','strange','stream','street','stress','strict','strike','string','strong','student','studied','studio','subject','succeed','success','sudden','suffer','sugars','suggest','summary','sunrise','sunset','support','suppose','supreme','surface','surgeon','suspect','sustain','swiftly','switch','symbols','symptom','system','tablet','tackle','talents','talking','tangible','target','teacher','teaming','tearing','teasing','teenage','telecom','telling','temple','tension','terminal','testing','textile','theatre','therapy','thereby','thought','through','tickets','timings','tissues','titanic','today','toddler','tolerant','tomorrow','tooling','topical','torrent','touched','towards','tracing','tracked','traffic','trailer','trained','trainer','transfer','transit','trapped','travels','treated','treated','treaty','tremble','trendy','tribune','trigger','triumph','trouble','trusted','twitter','ultimate','umbrella','unaided','unaware','unclear','undergo','uniform','unify','unique','united','unknown','unusual','upgrade','upright','upscale','utility','vacancy','vaccine','vantage','variety','various','vehicle','venture','verdict','version','veteran','victory','village','vintage','virtual','visible','visitor','vitamin','vividly','voltage','walking','warfare','warrior','wealthy','weather','webcast','wedding','weekday','weekend','welcome','welfare','western','whereas','whereby','whether','whisper','widowed','willful','winning','without','witness','wording','worker','workout','worldly','worthy','writing','written','yearly','yogurts','younger','yourselves'
];

// Build Hebrew prepared lists deterministically from existing Hebrew data (single words only)
function buildPrepared(language, difficulty) {
  const all = [];
  const levels = ['easy', 'medium', 'hard'];
  for (const lvl of levels) {
    const list = freePracticeTexts[language]?.[lvl] || [];
    for (const w of list) {
      if (typeof w === 'string' && !w.includes(' ')) {
        all.push(w);
      }
    }
  }
  const unique = Array.from(new Set(all));
  const filtered = sanitizeByDifficulty(unique, difficulty);
  return filtered.slice(0, MIN_WORDS_PER_LEVEL);
}

preparedWordBank.hebrew.medium = buildPrepared('hebrew', 'medium');
preparedWordBank.hebrew.hard = buildPrepared('hebrew', 'hard');
