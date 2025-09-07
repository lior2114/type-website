import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Keyboard.css';

const Keyboard = ({ targetKeys = [], currentKey = null, overrideLanguage = undefined, guideLanguage = undefined }) => {
  const { language } = useLanguage();
  const effectiveLanguage = overrideLanguage || language;
  const effectiveGuideLanguage = guideLanguage || language;

  // Hebrew QWERTY layout - CORRECTED
  const hebrewLayout = [
    ['ק', 'ו', 'א', 'ר', 'ט', 'י', 'ן', 'ם', 'פ'],
    ['ש', 'ד', 'ג', 'כ', 'ע', 'ח', 'ל', 'ך', 'ף'],
    ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ']
  ];

  // English QWERTY layout
  const englishLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  const layout = effectiveLanguage === 'hebrew' ? hebrewLayout : englishLayout;

  // Hebrew finger positions - CORRECT TOUCH TYPING
  const hebrewFingerPositions = {
    // Left hand - Middle finger
    'ק': { finger: 'left-middle', name: 'אמה שמאל', description: 'אמה שמאל על ק' },
    'ג': { finger: 'left-middle', name: 'אמה שמאל', description: 'אמה שמאל על ג' },
    'ב': { finger: 'left-middle', name: 'אמה שמאל', description: 'אמה שמאל על ב' },
    
    // Left hand - Index finger
    'ר': { finger: 'left-index', name: 'אצבע מורה שמאל', description: 'אצבע מורה שמאל על ר' },
    'א': { finger: 'left-index', name: 'אצבע מורה שמאל', description: 'אצבע מורה שמאל על א' },
    'כ': { finger: 'left-index', name: 'אצבע מורה שמאל', description: 'אצבע מורה שמאל על כ' },
    'ע': { finger: 'left-index', name: 'אצבע מורה שמאל', description: 'אצבע מורה שמאל על ע' },
    'ה': { finger: 'left-index', name: 'אצבע מורה שמאל', description: 'אצבע מורה שמאל על ה' },
    'נ': { finger: 'left-index', name: 'אצבע מורה שמאל', description: 'אצבע מורה שמאל על נ' },
    
    // Right hand - Index finger
    'ט': { finger: 'right-index', name: 'אצבע מורה ימין', description: 'אצבע מורה ימין על ט' },
    'ו': { finger: 'right-index', name: 'אצבע מורה ימין', description: 'אצבע מורה ימין על ו' },
    'י': { finger: 'right-index', name: 'אצבע מורה ימין', description: 'אצבע מורה ימין על י' },
    'ח': { finger: 'right-index', name: 'אצבע מורה ימין', description: 'אצבע מורה ימין על ח' },
    'מ': { finger: 'right-index', name: 'אצבע מורה ימין', description: 'אצבע מורה ימין על מ' },
    'צ': { finger: 'right-index', name: 'אצבע מורה ימין', description: 'אצבע מורה ימין על צ' },
    
    // Right hand - Middle finger
    'ן': { finger: 'right-middle', name: 'אמה ימין', description: 'אמה ימין על ן' },
    'ל': { finger: 'right-middle', name: 'אמה ימין', description: 'אמה ימין על ל' },
    'ת': { finger: 'right-middle', name: 'אמה ימין', description: 'אמה ימין על ת' },
    
      // Right hand - Ring finger
  'ם': { finger: 'right-ring', name: 'קמיצה ימין', description: 'קמיצה ימין על ם' },
  'ך': { finger: 'right-ring', name: 'קמיצה ימין', description: 'קמיצה ימין על ך' },
  'ץ': { finger: 'right-ring', name: 'קמיצה ימין', description: 'קמיצה ימין על ץ' },
  
  // Right hand - Pinky
  'פ': { finger: 'right-pinky', name: 'זרת ימין', description: 'זרת ימין על פ' },
  'ף': { finger: 'right-pinky', name: 'זרת ימין', description: 'זרת ימין על ף' },
    
    // Left hand - Ring finger
    'ד': { finger: 'left-ring', name: 'קמיצה שמאל', description: 'קמיצה שמאל על ד' },
    'ס': { finger: 'left-ring', name: 'קמיצה שמאל', description: 'קמיצה שמאל על ס' },
    
    // Left hand - Pinky
    'ש': { finger: 'left-pinky', name: 'זרת שמאל', description: 'זרת שמאל על ש' },
    'ז': { finger: 'left-pinky', name: 'זרת שמאל', description: 'זרת שמאל על ז' }
  };

  // English finger positions - CORRECT TOUCH TYPING
  const englishFingerPositions = {
    // Left hand - Middle finger
    'q': { finger: 'left-middle', name: 'Left Middle Finger', description: 'Left middle finger on Q' },
    'd': { finger: 'left-middle', name: 'Left Middle Finger', description: 'Left middle finger on D' },
    'b': { finger: 'left-middle', name: 'Left Middle Finger', description: 'Left middle finger on B' },
    
    // Left hand - Index finger
    'w': { finger: 'left-index', name: 'Left Index Finger', description: 'Left index finger on W' },
    'e': { finger: 'left-index', name: 'Left Index Finger', description: 'Left index finger on E' },
    'f': { finger: 'left-index', name: 'Left Index Finger', description: 'Left index finger on F' },
    'g': { finger: 'left-index', name: 'Left Index Finger', description: 'Left index finger on G' },
    'h': { finger: 'left-index', name: 'Left Index Finger', description: 'Left index finger on H' },
    'n': { finger: 'left-index', name: 'Left Index Finger', description: 'Left index finger on N' },
    
    // Right hand - Index finger
    't': { finger: 'right-index', name: 'Right Index Finger', description: 'Right index finger on T' },
    'y': { finger: 'right-index', name: 'Right Index Finger', description: 'Right index finger on Y' },
    'u': { finger: 'right-index', name: 'Right Index Finger', description: 'Right index finger on U' },
    'j': { finger: 'right-index', name: 'Right Index Finger', description: 'Right index finger on J' },
    'm': { finger: 'right-index', name: 'Right Index Finger', description: 'Right index finger on M' },
    ',': { finger: 'right-index', name: 'Right Index Finger', description: 'Right index finger on comma' },
    
    // Right hand - Middle finger
    'i': { finger: 'right-middle', name: 'Right Middle Finger', description: 'Right middle finger on I' },
    'k': { finger: 'right-middle', name: 'Right Middle Finger', description: 'Right middle finger on K' },
    '.': { finger: 'right-middle', name: 'Right Middle Finger', description: 'Right middle finger on period' },
    
    // Right hand - Ring finger
    'o': { finger: 'right-ring', name: 'Right Ring Finger', description: 'Right ring finger on O' },
    'l': { finger: 'right-ring', name: 'Right Ring Finger', description: 'Right ring finger on L' },
    
    // Right hand - Pinky
    'p': { finger: 'right-pinky', name: 'Right Pinky', description: 'Right pinky on P' },
    ';': { finger: 'right-pinky', name: 'Right Pinky', description: 'Right pinky on semicolon' },
    '/': { finger: 'right-pinky', name: 'Right Pinky', description: 'Right pinky on forward slash' },
    
    // Left hand - Ring finger
    's': { finger: 'left-ring', name: 'Left Ring Finger', description: 'Left ring finger on S' },
    'x': { finger: 'left-ring', name: 'Left Ring Finger', description: 'Left ring finger on X' },
    
    // Left hand - Pinky
    'a': { finger: 'left-pinky', name: 'Left Pinky', description: 'Left pinky on A' },
    'z': { finger: 'left-pinky', name: 'Left Pinky', description: 'Left pinky on Z' }
  };

  // Use effectiveLanguage for key-to-finger mapping so overrides work in translated modes
  const fingerPositions = effectiveLanguage === 'hebrew' ? hebrewFingerPositions : englishFingerPositions;

  const fingerNameByClassHe = {
    'left-pinky': 'זרת שמאל',
    'left-ring': 'קמיצה שמאל',
    'left-middle': 'אמה שמאל',
    'left-index': 'אצבע מורה שמאל',
    'right-pinky': 'זרת ימין',
    'right-ring': 'קמיצה ימין',
    'right-middle': 'אמה ימין',
    'right-index': 'אצבע מורה ימין'
  };

  const fingerNameByClassEn = {
    'left-pinky': 'Left Pinky',
    'left-ring': 'Left Ring Finger',
    'left-middle': 'Left Middle Finger',
    'left-index': 'Left Index Finger',
    'right-pinky': 'Right Pinky',
    'right-ring': 'Right Ring Finger',
    'right-middle': 'Right Middle Finger',
    'right-index': 'Right Index Finger'
  };

  const getFingerInfo = (key) => {
    const finger = fingerPositions[key.toLowerCase()] || fingerPositions[key];
    return finger || null;
  };

  const isTargetKey = (key) => {
    return targetKeys.includes(key.toLowerCase()) || targetKeys.includes(key);
  };

  const isCurrentKey = (key) => {
    return currentKey === key.toLowerCase() || currentKey === key;
  };

  // Get relevant fingers for current lesson
  const getRelevantFingers = () => {
    const relevantFingers = new Set();
    targetKeys.forEach(key => {
      const fingerInfo = getFingerInfo(key);
      if (fingerInfo) {
        relevantFingers.add(fingerInfo.finger);
      }
    });
    return Array.from(relevantFingers);
  };

  const relevantFingers = getRelevantFingers();

  // Check if a key should be highlighted based on current text
  const shouldHighlightKey = (key) => {
    // Only highlight keys that are in the target keys for this lesson
    return isTargetKey(key);
  };

  // Get finger guide text for current lesson
  const getFingerGuideText = () => {
    if (targetKeys.length === 0) return '';
    const nameMap = effectiveGuideLanguage === 'hebrew' ? fingerNameByClassHe : fingerNameByClassEn;
    const joinWord = effectiveGuideLanguage === 'hebrew' ? 'על' : 'on';

    const fingerGuides = targetKeys.map(key => {
      const fingerInfo = getFingerInfo(key);
      if (!fingerInfo) return '';
      const name = nameMap[fingerInfo.finger] || fingerInfo.finger;
      const displayKey = (typeof key === 'string') ? key.toUpperCase() : key;
      return `${name} ${joinWord} ${displayKey}`;
    }).filter(guide => guide);

    return fingerGuides.join(' • ');
  };

  const fingerGuideText = getFingerGuideText();

  // Finger emojis
  const getFingerEmoji = (fingerClass) => {
    if (fingerClass.includes('pinky')) return '👆';
    if (fingerClass.includes('ring')) return '🖐️';
    if (fingerClass.includes('middle')) return '✋';
    if (fingerClass.includes('index')) return '👆';
    return '👆';
  };

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => {
              const fingerInfo = getFingerInfo(key);
              const isRelevant = fingerInfo && relevantFingers.includes(fingerInfo.finger);
              const isTarget = isTargetKey(key);
              const isCurrent = isCurrentKey(key);
              const shouldHighlight = shouldHighlightKey(key);
              
              return (
                <div
                  key={key}
                  className={`key ${fingerInfo ? fingerInfo.finger : ''} ${isTarget ? 'target' : ''} ${isCurrent ? 'active' : ''} ${shouldHighlight ? 'highlight' : 'dimmed'}`}
                >
                  {key}
                  {isRelevant && fingerInfo && (
                    <div className="finger-indicator">
                      <div className={`finger ${fingerInfo.finger}`}>
                        {getFingerEmoji(fingerInfo.finger)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {fingerGuideText && (
        <div className="finger-guide">
          <h4 style={{ textAlign: 'center' }}>{effectiveGuideLanguage === 'hebrew' ? 'הדרכת מיקום אצבעות:' : 'Finger Position Guide:'}</h4>
          <p style={{ textAlign: 'center' }}>{fingerGuideText}</p>
        </div>
      )}
      
      <div className="finger-legend">
        {relevantFingers.map(finger => {
          const nameMap = effectiveGuideLanguage === 'hebrew' ? fingerNameByClassHe : fingerNameByClassEn;
          const displayName = nameMap[finger] || finger;
          return (
            <div key={finger} className="legend-item">
              <span className={`finger ${finger}`}>
                {getFingerEmoji(finger)}
              </span>
              <span>{displayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Keyboard; 