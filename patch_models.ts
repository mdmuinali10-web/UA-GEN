import fs from 'fs';

let content = fs.readFileSync('src/utils/generator.ts', 'utf8');

const newModelsStr = `export const DEVICE_MODELS: Record<string, string[]> = {
  Pixel: [
    'Pixel 10 Pro XL',
    'Pixel 10 Pro',
    'Pixel 10',
    'Pixel 9 Pro Fold',
    'Pixel 9 Pro XL',
    'Pixel 9 Pro',
    'Pixel 9',
    'Pixel 9a',
    'Pixel 8a',
    'Pixel 8 Pro',
    'Pixel 7 Pro',
    'Pixel 7',
    'Pixel Fold',
    'Pixel 6a',
    'Pixel 6 Pro'
  ],
  Samsung: [
    'SM-S938B',
    'SM-S936B',
    'SM-S931B',
    'SM-S928B',
    'SM-S921B',
    'SM-F956B',
    'SM-F741B',
    'SM-S918B',
    'SM-S908B',
    'SM-A556B',
    'SM-A546B',
    'SM-A356B',
    'SM-A346B',
    'SM-G998B',
    'SM-N986B'
  ],
  OnePlus: [
    'CPH2573',
    'CPH2581',
    'CPH2447',
    'CPH2449',
    'NE2213',
    'CPH2309',
    'CPH2493',
    'CPH2201'
  ],
  Nothing: [
    'Nothing Phone (2)',
    'Nothing Phone (1)',
    'Nothing Phone (2a)'
  ],
  Xiaomi: [
    '24069PC21G',
    '23127PN0CG',
    '23127PN0CC',
    '2312CRAD3C',
    '2210132G',
    '23076RA4RG'
  ],
  Sony: [
    'XQ-EC72',
    'XQ-DE72',
    'XQ-DC72',
    'XQ-DQ72',
    'XQ-CC72'
  ]
};

export const ANDROID_MODEL_NAMES: Record<string, string> = {
  // Samsung
  'SM-S938B': 'Galaxy S25 Ultra',
  'SM-S936B': 'Galaxy S25+',
  'SM-S931B': 'Galaxy S25',
  'SM-S928B': 'Galaxy S24 Ultra',
  'SM-S921B': 'Galaxy S24',
  'SM-F956B': 'Galaxy Z Fold 6',
  'SM-F741B': 'Galaxy Z Flip 6',
  'SM-S918B': 'Galaxy S23 Ultra',
  'SM-S908B': 'Galaxy S22 Ultra',
  'SM-A556B': 'Galaxy A55',
  'SM-A546B': 'Galaxy A54 5G',
  'SM-A356B': 'Galaxy A35',
  'SM-A346B': 'Galaxy A34 5G',
  'SM-G998B': 'Galaxy S21 Ultra',
  'SM-N986B': 'Galaxy Note 20 Ultra',

  // OnePlus
  'CPH2573': 'OnePlus 12',
  'CPH2581': 'OnePlus 12R',
  'CPH2447': 'OnePlus 11',
  'CPH2449': 'OnePlus 11 (Alt)',
  'NE2213': 'OnePlus 10 Pro',
  'CPH2309': 'OnePlus 10 Pro (Alt)',
  'CPH2493': 'OnePlus Nord 3',
  'CPH2201': 'OnePlus Nord 2',

  // Xiaomi
  '24069PC21G': 'POCO F6',
  '23127PN0CG': 'Xiaomi 14',
  '23127PN0CC': 'Xiaomi 14 Pro',
  '2312CRAD3C': 'Redmi Note 13 Pro',
  '2210132G': 'Xiaomi 13 Pro',
  '23076RA4RG': 'Redmi Note 12S',

  // Sony
  'XQ-EC72': 'Xperia 1 VI',
  'XQ-DE72': 'Xperia 5 V',
  'XQ-DC72': 'Xperia 10 V',
  'XQ-DQ72': 'Xperia 1 V',
  'XQ-CC72': 'Xperia 10 IV'
};

export interface DeviceOSRange {
  launch: number;
  max: number;
}

export const DEVICE_OS_MAPPINGS: Record<string, DeviceOSRange> = {
  // Google Pixel
  'Pixel 10 Pro XL': { launch: 16, max: 16 },
  'Pixel 10 Pro': { launch: 16, max: 16 },
  'Pixel 10': { launch: 16, max: 16 },
  'Pixel 9 Pro Fold': { launch: 14, max: 16 },
  'Pixel 9 Pro XL': { launch: 14, max: 16 },
  'Pixel 9 Pro': { launch: 14, max: 16 },
  'Pixel 9': { launch: 14, max: 16 },
  'Pixel 9a': { launch: 15, max: 16 },
  'Pixel 8a': { launch: 14, max: 16 },
  'Pixel 8 Pro': { launch: 14, max: 16 },
  'Pixel 7 Pro': { launch: 13, max: 16 },
  'Pixel 7': { launch: 13, max: 16 },
  'Pixel Fold': { launch: 13, max: 16 },
  'Pixel 6a': { launch: 12, max: 15 },
  'Pixel 6 Pro': { launch: 12, max: 15 },

  // Samsung Galaxy
  'SM-S938B': { launch: 15, max: 16 }, // Galaxy S25 Ultra
  'SM-S936B': { launch: 15, max: 16 }, // Galaxy S25+
  'SM-S931B': { launch: 15, max: 16 }, // Galaxy S25
  'SM-S928B': { launch: 14, max: 16 }, // Galaxy S24 Ultra
  'SM-S921B': { launch: 14, max: 16 }, // Galaxy S24
  'SM-F956B': { launch: 14, max: 16 }, // Galaxy Z Fold 6
  'SM-F741B': { launch: 14, max: 16 }, // Galaxy Z Flip 6
  'SM-S918B': { launch: 13, max: 16 }, // Galaxy S23 Ultra
  'SM-S908B': { launch: 12, max: 16 }, // Galaxy S22 Ultra
  'SM-A556B': { launch: 14, max: 16 }, // Galaxy A55
  'SM-A546B': { launch: 13, max: 16 }, // Galaxy A54 5G
  'SM-A356B': { launch: 14, max: 16 }, // Galaxy A35
  'SM-A346B': { launch: 13, max: 16 }, // Galaxy A34 5G
  'SM-G998B': { launch: 11, max: 15 }, // Galaxy S21 Ultra
  'SM-N986B': { launch: 10, max: 13 }, // Galaxy Note 20 Ultra

  // OnePlus
  'CPH2573': { launch: 14, max: 16 }, // OnePlus 12
  'CPH2581': { launch: 14, max: 16 }, // OnePlus 12R
  'CPH2447': { launch: 13, max: 16 }, // OnePlus 11
  'CPH2449': { launch: 13, max: 16 }, // OnePlus 11 (Alt)
  'NE2213': { launch: 12, max: 15 }, // OnePlus 10 Pro
  'CPH2309': { launch: 12, max: 15 }, // OnePlus 10 Pro (Alt)
  'CPH2493': { launch: 13, max: 16 }, // OnePlus Nord 3
  'CPH2201': { launch: 11, max: 13 }, // OnePlus Nord 2

  // Nothing Phone
  'Nothing Phone (2)': { launch: 13, max: 16 },
  'Nothing Phone (1)': { launch: 12, max: 15 },
  'Nothing Phone (2a)': { launch: 14, max: 16 },

  // Xiaomi
  '24069PC21G': { launch: 14, max: 16 }, // POCO F6
  '23127PN0CG': { launch: 14, max: 16 }, // Xiaomi 14
  '23127PN0CC': { launch: 14, max: 16 }, // Xiaomi 14 Pro
  '2312CRAD3C': { launch: 13, max: 16 }, // Redmi Note 13 Pro
  '2210132G': { launch: 12, max: 15 }, // Xiaomi 13 Pro
  '23076RA4RG': { launch: 13, max: 16 }, // Redmi Note 12S

  // Sony Xperia
  'XQ-EC72': { launch: 14, max: 16 }, // Xperia 1 VI
  'XQ-DE72': { launch: 13, max: 15 }, // Xperia 5 V
  'XQ-DC72': { launch: 13, max: 15 }, // Xperia 10 V
  'XQ-DQ72': { launch: 13, max: 15 }, // Xperia 1 V
  'XQ-CC72': { launch: 12, max: 14 }  // Xperia 10 IV
};`;

const startIndex = content.indexOf('export const DEVICE_MODELS');
const endIndex = content.indexOf('export const IPHONE_OS_MAPPINGS');

content = content.substring(0, startIndex) + newModelsStr + "\n\n" + content.substring(endIndex);

fs.writeFileSync('src/utils/generator.ts', content);
