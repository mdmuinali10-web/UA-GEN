/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserType, OSType, UserAgentItem, EngineSettings } from '../types';

// Helper for generating random numbers in range
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper for picking a random element from an array
const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Dedicated device model pools
export const DEVICE_MODELS: Record<string, string[]> = {
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
};

export const IPHONE_OS_MAPPINGS: Record<string, DeviceOSRange> = {
  'iPhone18,1': { launch: 26, max: 26 }, // iPhone 17 Pro
  'iPhone18,2': { launch: 26, max: 26 }, // iPhone 17 Pro Max
  'iPhone18,3': { launch: 26, max: 26 }, // iPhone 17
  'iPhone18,4': { launch: 26, max: 26 }, // iPhone 17 Air
  'iPhone17,1': { launch: 18, max: 26 }, // iPhone 16 Pro
  'iPhone17,2': { launch: 18, max: 26 }, // iPhone 16 Pro Max
  'iPhone17,3': { launch: 18, max: 26 }, // iPhone 16
  'iPhone17,4': { launch: 18, max: 26 }, // iPhone 16 Plus
  'iPhone16,1': { launch: 17, max: 26 }, // iPhone 15 Pro
  'iPhone16,2': { launch: 17, max: 26 }, // iPhone 15 Pro Max
  'iPhone15,4': { launch: 17, max: 26 }, // iPhone 15
  'iPhone15,5': { launch: 17, max: 26 }, // iPhone 15 Plus
  'iPhone15,2': { launch: 16, max: 26 }, // iPhone 14 Pro
  'iPhone15,3': { launch: 16, max: 26 }, // iPhone 14 Pro Max
  'iPhone14,7': { launch: 16, max: 26 }, // iPhone 14
  'iPhone14,8': { launch: 16, max: 26 }, // iPhone 14 Plus
};

export function getIosDeviceOSRange(model: string): DeviceOSRange {
  return IPHONE_OS_MAPPINGS[model] || { launch: 16, max: 26 };
}

export function getCompatibleIphoneModels(iosVer: number): string[] {
  const models = Object.keys(IPHONE_OS_MAPPINGS).filter((m) => {
    const range = IPHONE_OS_MAPPINGS[m];
    return iosVer >= range.launch && iosVer <= range.max;
  });
  return models.length > 0 ? models : ['iPhone15,2'];
}

export function getDeviceOSRange(model: string, manufacturer?: string): DeviceOSRange {
  if (model === 'auto' && manufacturer) {
    const manufacturers = manufacturer.split(',').map(m => m.trim()).filter(Boolean);
    const models: string[] = [];
    for (const m of manufacturers) {
      if (DEVICE_MODELS[m]) {
        models.push(...DEVICE_MODELS[m]);
      }
    }
    if (models.length > 0) {
      let minLaunch = 16;
      let maxMax = 10;
      models.forEach((m) => {
        const r = DEVICE_OS_MAPPINGS[m];
        if (r) {
          if (r.launch < minLaunch) minLaunch = r.launch;
          if (r.max > maxMax) maxMax = r.max;
        }
      });
      return { launch: minLaunch === 16 ? 10 : minLaunch, max: maxMax === 10 ? 16 : maxMax };
    }
  }
  return DEVICE_OS_MAPPINGS[model] || { launch: 10, max: 16 };
}

// Chrome Exact Lists requested by user
const CHROME_VERSIONS_147 = [
  '147.0.7727.24',
  '147.0.7727.50',
  '147.0.7727.56',
  '147.0.7727.101',
  '147.0.7727.117',
  '147.0.7727.138'
];
const CHROME_VERSIONS_148 = [
  '148.0.7778.56',
  '148.0.7778.97',
  '148.0.7778.168',
  '148.0.7778.179',
  '148.0.7778.215',
  '148.0.7778.216',
  '148.0.7778.217'
];
const CHROME_VERSIONS_149 = [
  '149.0.7827.54',
  '149.0.7827.103',
  '149.0.7827.115',
  '149.0.7827.156',
  '149.0.7827.197',
  '149.0.7827.201'
];
const CHROME_VERSIONS_150 = [
  '150.0.7871.24',
  '150.0.7871.47'
];

const ALL_CHROME_VERSIONS = [
  ...CHROME_VERSIONS_147,
  ...CHROME_VERSIONS_148,
  ...CHROME_VERSIONS_149,
  ...CHROME_VERSIONS_150
];

// Firefox Exact List requested by user
const FIREFOX_VERSIONS = [
  '149.0.2',
  '150.0',
  '150.0.1',
  '150.0.2',
  '150.0.3',
  '151.0',
  '151.0.1',
  '151.0.2',
  '151.0.3',
  '151.0.4',
  '152.0',
  '152.0.1',
  '152.0.2',
  '152.0.3',
  '152.0.4',
  '152.0.5'
];

// Edge Exact Lists requested by user
const EDGE_VERSIONS_147 = [
  '147.0.3911.53',
  '147.0.3912.41',
  '147.0.3912.47',
  '147.0.3912.60',
  '147.0.3912.65'
];
const EDGE_VERSIONS_148 = [
  '148.0.3967.47',
  '148.0.3967.60',
  '148.0.3967.83',
  '148.0.3967.96',
  '148.0.3967.118',
  '148.0.3967.128'
];
const EDGE_VERSIONS_149 = [
  '149.0.4022.52',
  '149.0.4022.62',
  '149.0.4022.69',
  '149.0.4022.80',
  '149.0.4022.96',
  '149.0.4022.98'
];
const EDGE_VERSIONS_150 = [
  '150.0.4078.5',
  '150.0.4078.24',
  '150.0.4078.36',
  '150.0.4078.42',
  '150.0.4078.46',
  '150.0.4078.48'
];

const ALL_EDGE_VERSIONS = [
  ...EDGE_VERSIONS_147,
  ...EDGE_VERSIONS_148,
  ...EDGE_VERSIONS_149,
  ...EDGE_VERSIONS_150
];

/**
 * Generates an exact Edge version from user-specified pools
 */
export function getEdgeVersion(randomize: boolean, versionOverride?: string): string {
  if (versionOverride && versionOverride !== 'auto') {
    const major = parseInt(versionOverride, 10);
    if (major === 147) {
      return pickRandom(EDGE_VERSIONS_147);
    } else if (major === 148) {
      return pickRandom(EDGE_VERSIONS_148);
    } else if (major === 149) {
      return pickRandom(EDGE_VERSIONS_149);
    } else if (major === 150) {
      return pickRandom(EDGE_VERSIONS_150);
    }
  }

  if (!randomize) {
    return ALL_EDGE_VERSIONS[ALL_EDGE_VERSIONS.length - 1]; // return latest
  }
  return pickRandom(ALL_EDGE_VERSIONS);
}

/**
 * Generates an exact Chrome version from user-specified pools
 */
export function getChromeVersion(randomize: boolean, versionOverride?: string): string {
  if (versionOverride && versionOverride !== 'auto') {
    const major = parseInt(versionOverride, 10);
    if (major === 147) {
      return pickRandom(CHROME_VERSIONS_147);
    } else if (major === 148) {
      return pickRandom(CHROME_VERSIONS_148);
    } else if (major === 149) {
      return pickRandom(CHROME_VERSIONS_149);
    } else if (major === 150) {
      return pickRandom(CHROME_VERSIONS_150);
    }
  }

  if (!randomize) {
    return ALL_CHROME_VERSIONS[ALL_CHROME_VERSIONS.length - 1]; // return latest
  }
  return pickRandom(ALL_CHROME_VERSIONS);
}

/**
 * Generates an exact Firefox version from user-specified pool
 */
export function getFirefoxVersion(randomize: boolean, versionOverride?: string): string {
  if (versionOverride && versionOverride !== 'auto') {
    const major = parseInt(versionOverride, 10);
    const filtered = FIREFOX_VERSIONS.filter((v) => v.startsWith(`${major}.`));
    if (filtered.length > 0) {
      return pickRandom(filtered);
    }
  }

  if (!randomize) {
    return FIREFOX_VERSIONS[FIREFOX_VERSIONS.length - 1]; // return latest
  }
  return pickRandom(FIREFOX_VERSIONS);
}

/**
 * Generates a Safari WebKit version of 605.1.15
 */
export function getSafariWebKitVersion(randomize: boolean): { webKit: string; safVer: string } {
  return {
    webKit: '605.1.15',
    safVer: '18.1'
  };
}

export interface DeviceHardwareProfile {
  brand: string;
  model: string;
  readable_name: string;
  codename: string;
  chipset: string;
  dpi: number;
  width: number;
  height: number;
  density_scale: string;
  build_id: string;
}

export const getApiLevel = (ver: string): number => {
  const major = parseInt(ver, 10);
  if (major === 10) return 29;
  if (major === 11) return 30;
  if (major === 12) {
    if (ver === '12L') return 32;
    return 31;
  }
  if (major === 13) return 33;
  if (major === 14) return 34;
  if (major === 15) return 35;
  if (major === 16) return 36;
  return 34; // default
};

export function getDeviceHardwareProfile(model: string): DeviceHardwareProfile {
  const norm = model.toLowerCase();
  
  // Base profiles map
  const profiles: Record<string, Partial<DeviceHardwareProfile>> = {
    // Pixel
    'pixel 10 pro xl': { brand: 'Google', codename: 'beast', chipset: 'google_tensor_g5', dpi: 530, width: 1280, height: 2856, density_scale: '3.3' },
    'pixel 10 pro': { brand: 'Google', codename: 'pro', chipset: 'google_tensor_g5', dpi: 490, width: 1344, height: 2992, density_scale: '3.1' },
    'pixel 10': { brand: 'Google', codename: 'base', chipset: 'google_tensor_g5', dpi: 420, width: 1080, height: 2424, density_scale: '2.6' },
    'pixel 9 pro fold': { brand: 'Google', codename: 'comet', chipset: 'google_tensor_g4', dpi: 380, width: 1840, height: 2208, density_scale: '2.4' },
    'pixel 9 pro xl': { brand: 'Google', codename: 'komodo', chipset: 'google_tensor_g4', dpi: 530, width: 1280, height: 2856, density_scale: '3.3' },
    'pixel 9 pro': { brand: 'Google', codename: 'caiman', chipset: 'google_tensor_g4', dpi: 490, width: 1344, height: 2992, density_scale: '3.1' },
    'pixel 9': { brand: 'Google', codename: 'tokay', chipset: 'google_tensor_g4', dpi: 420, width: 1080, height: 2424, density_scale: '2.6' },
    'pixel 9a': { brand: 'Google', codename: 'tegu', chipset: 'google_tensor_g4', dpi: 420, width: 1080, height: 2424, density_scale: '2.6' },
    'pixel 8a': { brand: 'Google', codename: 'akita', chipset: 'google_tensor_g3', dpi: 420, width: 1080, height: 2400, density_scale: '2.6' },
    'pixel 8 pro': { brand: 'Google', codename: 'husky', chipset: 'google_tensor_g3', dpi: 490, width: 1344, height: 2992, density_scale: '3.1' },
    'pixel 7 pro': { brand: 'Google', codename: 'cheetah', chipset: 'google_tensor_g2', dpi: 512, width: 1440, height: 3120, density_scale: '3.2' },
    'pixel 7': { brand: 'Google', codename: 'panther', chipset: 'google_tensor_g2', dpi: 420, width: 1080, height: 2400, density_scale: '2.6' },
    'pixel fold': { brand: 'Google', codename: 'felix', chipset: 'google_tensor_g2', dpi: 380, width: 1840, height: 2208, density_scale: '2.4' },
    'pixel 6a': { brand: 'Google', codename: 'bluejay', chipset: 'google_tensor', dpi: 420, width: 1080, height: 2400, density_scale: '2.6' },
    'pixel 6 pro': { brand: 'Google', codename: 'raven', chipset: 'google_tensor', dpi: 512, width: 1440, height: 3120, density_scale: '3.2' },
    
    // Samsung
    'sm-s938b': { brand: 'samsung', codename: 'e3q', chipset: 'qcom', dpi: 500, width: 1440, height: 3120, density_scale: '3.1' },
    'sm-s936b': { brand: 'samsung', codename: 'e2q', chipset: 'qcom', dpi: 500, width: 1440, height: 3120, density_scale: '3.1' },
    'sm-s931b': { brand: 'samsung', codename: 'e1q', chipset: 'exynos2500', dpi: 420, width: 1080, height: 2340, density_scale: '2.6' },
    'sm-s928b': { brand: 'samsung', codename: 'eureka', chipset: 'qcom', dpi: 500, width: 1440, height: 3120, density_scale: '3.1' },
    'sm-s921b': { brand: 'samsung', codename: 'e1q', chipset: 'exynos2400', dpi: 420, width: 1080, height: 2340, density_scale: '2.6' },
    'sm-s918b': { brand: 'samsung', codename: 'dm3q', chipset: 'qcom', dpi: 500, width: 1440, height: 3088, density_scale: '3.1' },
    'sm-s908b': { brand: 'samsung', codename: 'rainbow', chipset: 'qcom', dpi: 500, width: 1440, height: 3088, density_scale: '3.1' },
    'sm-f956b': { brand: 'samsung', codename: 'q6', chipset: 'qcom', dpi: 374, width: 1856, height: 2160, density_scale: '2.3' },
    'sm-f741b': { brand: 'samsung', codename: 'b6', chipset: 'qcom', dpi: 425, width: 1080, height: 2640, density_scale: '2.6' },
    'sm-a556b': { brand: 'samsung', codename: 'a55x', chipset: 'exynos1480', dpi: 390, width: 1080, height: 2340, density_scale: '2.4' },
    'sm-a546b': { brand: 'samsung', codename: 'a54x', chipset: 'exynos1380', dpi: 405, width: 1080, height: 2340, density_scale: '2.5' },
    'sm-a356b': { brand: 'samsung', codename: 'a35x', chipset: 'exynos1380', dpi: 390, width: 1080, height: 2340, density_scale: '2.4' },
    'sm-a346b': { brand: 'samsung', codename: 'a34x', chipset: 'mtk6877', dpi: 390, width: 1080, height: 2340, density_scale: '2.4' },
    'sm-g998b': { brand: 'samsung', codename: 'o1s', chipset: 'exynos2100', dpi: 515, width: 1440, height: 3200, density_scale: '3.2' },
    'sm-n986b': { brand: 'samsung', codename: 'canvas', chipset: 'exynos990', dpi: 496, width: 1440, height: 3088, density_scale: '3.1' },
    
    // OnePlus
    'cph2573': { brand: 'oneplus', codename: 'oneplus12', chipset: 'qcom', dpi: 510, width: 1440, height: 3168, density_scale: '3.2' },
    'cph2581': { brand: 'oneplus', codename: 'oneplus12r', chipset: 'qcom', dpi: 450, width: 1264, height: 2780, density_scale: '2.8' },
    'cph2447': { brand: 'oneplus', codename: 'oneplus11', chipset: 'qcom', dpi: 525, width: 1440, height: 3216, density_scale: '3.3' },
    'cph2449': { brand: 'oneplus', codename: 'oneplus11', chipset: 'qcom', dpi: 525, width: 1440, height: 3216, density_scale: '3.3' },
    'ne2213': { brand: 'oneplus', codename: 'oneplus10pro', chipset: 'qcom', dpi: 525, width: 1440, height: 3216, density_scale: '3.3' },
    'cph2309': { brand: 'oneplus', codename: 'oneplus10pro', chipset: 'qcom', dpi: 525, width: 1440, height: 3216, density_scale: '3.3' },
    'cph2493': { brand: 'oneplus', codename: 'opnord3', chipset: 'mtk9000', dpi: 450, width: 1240, height: 2772, density_scale: '2.8' },
    'cph2201': { brand: 'oneplus', codename: 'opnord2', chipset: 'mtk1200', dpi: 410, width: 1080, height: 2400, density_scale: '2.6' },
    
    // Nothing
    'nothing phone (2)': { brand: 'Nothing', codename: 'Pong', chipset: 'qcom', dpi: 394, width: 1080, height: 2412, density_scale: '2.5' },
    'nothing phone (1)': { brand: 'Nothing', codename: 'Spacewar', chipset: 'qcom', dpi: 402, width: 1080, height: 2400, density_scale: '2.5' },
    'nothing phone (2a)': { brand: 'Nothing', codename: 'Pacman', chipset: 'mtk7200', dpi: 394, width: 1080, height: 2412, density_scale: '2.5' },
    
    // Xiaomi
    '24069pc21g': { brand: 'xiaomi', codename: 'peridot', chipset: 'qcom', dpi: 446, width: 1220, height: 2712, density_scale: '2.8' },
    '23127pn0cg': { brand: 'xiaomi', codename: 'houji', chipset: 'qcom', dpi: 460, width: 1200, height: 2670, density_scale: '2.9' },
    '23127pn0cc': { brand: 'xiaomi', codename: 'houji', chipset: 'qcom', dpi: 460, width: 1200, height: 2670, density_scale: '2.9' },
    '2312crad3c': { brand: 'xiaomi', codename: 'garnet', chipset: 'qcom', dpi: 446, width: 1220, height: 2712, density_scale: '2.8' },
    '2210132g': { brand: 'xiaomi', codename: 'diting', chipset: 'qcom', dpi: 446, width: 1220, height: 2712, density_scale: '2.8' },
    '23076ra4rg': { brand: 'xiaomi', codename: 'diting', chipset: 'qcom', dpi: 446, width: 1220, height: 2712, density_scale: '2.8' },
    
    // Sony
    'xq-ec72': { brand: 'sony', codename: 'pdx245', chipset: 'qcom', dpi: 396, width: 1080, height: 2340, density_scale: '2.5' },
    'xq-de72': { brand: 'sony', codename: 'pdx235', chipset: 'qcom', dpi: 449, width: 1080, height: 2520, density_scale: '2.8' },
    'xq-dc72': { brand: 'sony', codename: 'pdx238', chipset: 'qcom', dpi: 449, width: 1080, height: 2520, density_scale: '2.8' },
    'xq-dq72': { brand: 'sony', codename: 'pdx235', chipset: 'qcom', dpi: 449, width: 1080, height: 2520, density_scale: '2.8' },
    'xq-cc72': { brand: 'sony', codename: 'pdx225', chipset: 'qcom', dpi: 449, width: 1080, height: 2520, density_scale: '2.8' }
  };

  const found = profiles[norm];
  
  const brand = found?.brand || (norm.includes('pixel') ? 'Google' : 'samsung');
  const codename = found?.codename || 'unknown';
  const chipset = found?.chipset || 'qcom';
  const dpi = found?.dpi || 420;
  const width = found?.width || 1080;
  const height = found?.height || 2400;
  const density_scale = found?.density_scale || '2.6';
  
  const build_id = found?.build_id || (norm.includes('pixel 9') ? 'AP1A.240805.015' : 'UP1A.231005.007');
  
  return {
    brand,
    model,
    readable_name: model,
    codename,
    chipset,
    dpi,
    width,
    height,
    density_scale,
    build_id
  };
}

const getIphoneScale = (model: string): number => {
  const norm = model.toLowerCase();
  if (
    norm.includes('iphone10,1') || 
    norm.includes('iphone10,4') || 
    norm.includes('iphone12,1') || 
    norm.includes('iphone11,8')
  ) {
    return 2;
  }
  return 3; // Default scale is 3 for modern iPhones
};

const getIosHardwareIdAndScale = (iosVerStr: string, devName?: string): { hardwareId: string; scale: number } => {
  if (devName && devName.startsWith('iPhone')) {
    const scale = getIphoneScale(devName);
    return { hardwareId: devName, scale };
  }
  
  // Fallback map based on iOS version
  const iosVerNum = parseInt(iosVerStr.split('_')[0], 10);
  if (iosVerNum >= 26) {
    return { hardwareId: 'iPhone18,1', scale: 3 };
  } else if (iosVerNum >= 17) {
    return { hardwareId: 'iPhone17,1', scale: 3 };
  } else if (iosVerNum >= 15) {
    return { hardwareId: 'iPhone16,1', scale: 3 };
  } else {
    return { hardwareId: 'iPhone15,2', scale: 3 };
  }
};


export function generateAndroidBuildId(osVer: string, brand: string, randomize: boolean): string {
  const ver = parseInt(osVer.split('.')[0] || '14', 10);
  
  // Base prefixes per Android version
  const prefixes: Record<number, string[]> = {
    10: ['QP1A'],
    11: ['RQ1A', 'RQ2A', 'RQ3A'],
    12: ['SP1A', 'SP2A'],
    13: ['TP1A', 'TQ1A', 'TQ2A', 'TQ3A'],
    14: ['UP1A', 'UQ1A'],
    15: ['AP1A', 'AP2A', 'AP3A', 'AP4A'],
    16: ['BP1A', 'BP2A']
  };
  
  const years: Record<number, number[]> = {
    10: [19, 20],
    11: [20, 21],
    12: [21, 22],
    13: [22, 23],
    14: [23, 24],
    15: [24, 25],
    16: [25, 26]
  };
  
  const prefixList = prefixes[ver] || ['UP1A'];
  const prefix = randomize ? pickRandom(prefixList) : prefixList[0];
  
  const yearOptions = years[ver] || [23, 24];
  const year = randomize ? pickRandom(yearOptions) : yearOptions[0];
  
  // Generate random month and day
  const month = randomize ? getRandomInt(1, 12).toString().padStart(2, '0') : '10';
  const day = randomize ? getRandomInt(1, 28).toString().padStart(2, '0') : '05';
  
  const dateStr = `${year}${month}${day}`;
  
  // Sequence number
  const seq = randomize ? getRandomInt(1, 999).toString().padStart(3, '0') : '001';
  
  // Suffix (security patch/variant)
  const hasSuffix = randomize ? Math.random() > 0.5 : false;
  const suffixChar = randomize ? pickRandom(['A', 'B', 'C', 'V']) : 'A';
  const suffixNum = randomize ? getRandomInt(1, 9) : 1;
  const suffix = hasSuffix || brand.toLowerCase() === 'google' ? `.${suffixChar}${suffixNum}` : '';
  
  let brandPrefix = prefix;
  if (brand.toLowerCase() === 'xiaomi' && ver >= 13) {
    // Xiaomi uses UKQ1 for Android 14, TKQ1 for Android 13
    brandPrefix = ver === 14 ? 'UKQ1' : (ver === 13 ? 'TKQ1' : prefix);
  }
  
  return `${brandPrefix}.${dateStr}.${seq}${suffix}`;
}

export function generateSingleUserAgent(
  browser: BrowserType,
  os: OSType,
  deviceManufacturer: string = 'Pixel',
  randomize: boolean = true,
  settings: EngineSettings,
  browserVersionOverride?: string,
  osVersionOverride?: string,
  deviceModelOverride?: string,
  socialMedia?: string
): { userAgent: string; browserVer: string; osVer: string; devName?: string } {
  
  // 1. Browser version string
  let browserVer = '';
  let fullChromeVer = getChromeVersion(randomize, browserVersionOverride);
  let fullFirefoxVer = getFirefoxVersion(randomize, browserVersionOverride);
  const { webKit: safariWebKit, safVer: safariVer } = getSafariWebKitVersion(randomize);

  // 2. OS Version
  let osVer = '';
  let devName: string | undefined = undefined;

  switch (os) {
    case 'windows':
      if (osVersionOverride && osVersionOverride !== 'auto') {
        osVer = osVersionOverride === '10' ? '10.0' : '11.0';
      } else {
        osVer = randomize ? (Math.random() > 0.5 ? '10.0' : '11.0') : '11.0';
      }
      break;
    case 'macos':
      const macMajor = randomize ? getRandomInt(13, 15) : 14;
      const macMinor = randomize ? getRandomInt(0, 5) : 5;
      osVer = `10_${15}_${macMinor}`; // Standard macOS user-agent fallback
      if (browser === 'safari') {
        osVer = `${macMajor}_${macMinor}`;
      }
      break;
    case 'linux':
      osVer = 'x86_64';
      break;
    case 'android': {
      let models: string[] = [];
      const manufacturers = deviceManufacturer.split(',').map(m => m.trim()).filter(Boolean);
      for (const m of manufacturers) {
        if (DEVICE_MODELS[m]) {
          models.push(...DEVICE_MODELS[m]);
        }
      }
      if (models.length === 0) {
        models = DEVICE_MODELS['Pixel'] || [];
      }
      let model = '';
      if (deviceModelOverride && deviceModelOverride !== 'auto') {
        model = deviceModelOverride;
      } else {
        if (osVersionOverride && osVersionOverride !== 'auto') {
          const reqVer = parseInt(osVersionOverride, 10);
          const validModels = models.filter((m) => {
            const range = DEVICE_OS_MAPPINGS[m];
            return range ? (reqVer >= range.launch && reqVer <= range.max) : true;
          });
          if (validModels.length > 0) {
            model = randomize ? pickRandom(validModels) : validModels[0];
          } else {
            model = randomize ? pickRandom(models) : models[0];
          }
        } else {
          model = randomize ? pickRandom(models) : models[0];
        }
      }
      devName = model;

      const range = DEVICE_OS_MAPPINGS[model] || { launch: 10, max: 16 };

      if (osVersionOverride && osVersionOverride !== 'auto') {
        const requestedVer = parseInt(osVersionOverride, 10);
        if (requestedVer < range.launch) {
          osVer = `${range.launch}`;
        } else if (requestedVer > range.max) {
          osVer = `${range.max}`;
        } else {
          osVer = osVersionOverride;
        }
      } else {
        if (!randomize) {
          osVer = `${range.max}`;
        } else {
          osVer = `${getRandomInt(range.launch, range.max)}`;
        }
      }
      break;
    }
    case 'ios': {
      let activeModel = deviceModelOverride;
      
      // 1. Determine device model first
      if (!activeModel || activeModel === 'auto') {
        if (osVersionOverride && osVersionOverride !== 'auto') {
          const targetVer = parseInt(osVersionOverride, 10);
          const compModels = getCompatibleIphoneModels(targetVer);
          activeModel = randomize ? pickRandom(compModels) : compModels[0];
        } else {
          const allIphones = Object.keys(IPHONE_OS_MAPPINGS);
          activeModel = randomize ? pickRandom(allIphones) : 'iPhone16,1';
        }
      }

      devName = activeModel;
      const range = getIosDeviceOSRange(devName);

      // 2. Now determine valid iOS version for this model
      let finalIosVer = 17; // default fallback
      if (osVersionOverride && osVersionOverride !== 'auto') {
        const requestedVer = parseInt(osVersionOverride, 10);
        if (requestedVer < range.launch) {
          finalIosVer = range.launch;
        } else if (requestedVer > range.max) {
          finalIosVer = range.max;
        } else {
          finalIosVer = requestedVer;
        }
      } else {
        if (!randomize) {
          finalIosVer = range.max;
        } else {
          finalIosVer = getRandomInt(range.launch, range.max);
          // Skip non-existent iOS 19-25 range
          if (finalIosVer >= 19 && finalIosVer <= 25) {
            finalIosVer = Math.random() > 0.5 ? 26 : 18;
          }
        }
      }

      const iosSubVer = randomize ? getRandomInt(0, 5) : 4;
      osVer = `${finalIosVer}_${iosSubVer}`;
      break;
    }
  }

  // 3. User agent composition
  let ua = '';

  if (os === 'windows') {
    const arch = 'Win64; x64';
    const winVer = '10.0'; // Always use "10.0" for Windows 10 and 11 UA strings due to backwards compatibility
    if (browser === 'chrome') {
      ua = `Mozilla/5.0 (Windows NT ${winVer}; ${arch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Safari/537.36`;
      browserVer = fullChromeVer.split('.').slice(0, 2).join('.');
    } else if (browser === 'firefox') {
      const loc = settings.locale || 'en-US';
      ua = `Mozilla/5.0 (Windows NT ${winVer}; ${arch}; ${loc}; rv:${fullFirefoxVer}) Gecko/20100101 Firefox/${fullFirefoxVer}`;
      browserVer = fullFirefoxVer;
    } else if (browser === 'edge') {
      const edgeVer = getEdgeVersion(randomize, browserVersionOverride);
      const edgeMajor = parseInt(edgeVer.split('.')[0], 10);
      const matchedChromeVer = getChromeVersion(randomize, edgeMajor.toString());
      ua = `Mozilla/5.0 (Windows NT ${winVer}; ${arch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${matchedChromeVer} Safari/537.36 Edg/${edgeVer}`;
      browserVer = edgeVer;
    } else if (browser === 'opera') {
      const operaVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.${getRandomInt(50, 180)}`;
      ua = `Mozilla/5.0 (Windows NT ${winVer}; ${arch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Safari/537.36 OPR/${operaVer}`;
      browserVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.0`;
    } else {
      ua = `Mozilla/5.0 (Windows NT ${winVer}; ${arch}) AppleWebKit/${safariWebKit} (KHTML, like Gecko) Version/${safariVer} Safari/604.1`;
      browserVer = safariVer;
    }
  } else if (os === 'macos') {
    if (browser === 'chrome') {
      ua = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Safari/537.36`;
      browserVer = fullChromeVer.split('.').slice(0, 2).join('.');
    } else if (browser === 'safari') {
      ua = `Mozilla/5.0 (Macintosh; Intel Mac OS X ${osVer}) AppleWebKit/${safariWebKit} (KHTML, like Gecko) Version/${safariVer} Safari/604.1`;
      browserVer = safariVer;
    } else if (browser === 'firefox') {
      const loc = settings.locale || 'en-US';
      ua = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:${fullFirefoxVer}; ${loc}) Gecko/20100101 Firefox/${fullFirefoxVer}`;
      browserVer = fullFirefoxVer;
    } else if (browser === 'edge') {
      const edgeVer = getEdgeVersion(randomize, browserVersionOverride);
      const edgeMajor = parseInt(edgeVer.split('.')[0], 10);
      const matchedChromeVer = getChromeVersion(randomize, edgeMajor.toString());
      ua = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${matchedChromeVer} Safari/537.36 Edg/${edgeVer}`;
      browserVer = edgeVer;
    } else {
      const operaVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.${getRandomInt(50, 180)}`;
      ua = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Safari/537.36 OPR/${operaVer}`;
      browserVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.0`;
    }
  } else if (os === 'linux') {
    if (browser === 'chrome') {
      ua = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Safari/537.36`;
      browserVer = fullChromeVer.split('.').slice(0, 2).join('.');
    } else if (browser === 'firefox') {
      const loc = settings.locale || 'en-US';
      ua = `Mozilla/5.0 (X11; Linux x86_64; rv:${fullFirefoxVer}; ${loc}) Gecko/20100101 Firefox/${fullFirefoxVer}`;
      browserVer = fullFirefoxVer;
    } else if (browser === 'edge') {
      const edgeVer = getEdgeVersion(randomize, browserVersionOverride);
      const edgeMajor = parseInt(edgeVer.split('.')[0], 10);
      const matchedChromeVer = getChromeVersion(randomize, edgeMajor.toString());
      ua = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${matchedChromeVer} Safari/537.36 Edg/${edgeVer}`;
      browserVer = edgeVer;
    } else if (browser === 'opera') {
      const operaVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.${getRandomInt(50, 180)}`;
      ua = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Safari/537.36 OPR/${operaVer}`;
      browserVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.0`;
    } else {
      ua = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/${safariWebKit} (KHTML, like Gecko) Version/${safariVer} Safari/604.1`;
      browserVer = safariVer;
    }
  } else if (os === 'android') {
    const model = devName || 'Pixel 9';
    if (browser === 'chrome') {
      const buildId = generateAndroidBuildId(osVer, getDeviceHardwareProfile(model).brand, randomize);
      ua = `Mozilla/5.0 (Linux; Android ${osVer}; ${model} Build/${buildId}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Mobile Safari/537.36`;
      browserVer = fullChromeVer.split('.').slice(0, 2).join('.');
    } else if (browser === 'firefox') {
      const loc = settings.locale || 'en-US';
      const firefoxMajorMinor = fullFirefoxVer.split('.').slice(0, 2).join('.') || '150.0';
      ua = `Mozilla/5.0 (Android ${osVer}; Mobile; rv:${firefoxMajorMinor}; ${loc}) Gecko/${firefoxMajorMinor} Firefox/${fullFirefoxVer}`;
      browserVer = fullFirefoxVer;
    } else if (browser === 'edge') {
      const edgeVer = getEdgeVersion(randomize, browserVersionOverride);
      const edgeMajor = parseInt(edgeVer.split('.')[0], 10);
      const matchedChromeVer = getChromeVersion(randomize, edgeMajor.toString());
      const buildId = generateAndroidBuildId(osVer, getDeviceHardwareProfile(model).brand, randomize);
      ua = `Mozilla/5.0 (Linux; Android ${osVer}; ${model} Build/${buildId}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${matchedChromeVer} Mobile Safari/537.36 EdgA/${edgeVer}`;
      browserVer = edgeVer;
    } else if (browser === 'opera') {
      const operaVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.${getRandomInt(50, 180)}`;
      const buildId = generateAndroidBuildId(osVer, getDeviceHardwareProfile(model).brand, randomize);
      ua = `Mozilla/5.0 (Linux; Android ${osVer}; ${model} Build/${buildId}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullChromeVer} Mobile Safari/537.36 OPR/${operaVer}`;
      browserVer = `${parseInt(fullChromeVer.split('.')[0]) - 10}.0`;
    } else {
      const buildId = generateAndroidBuildId(osVer, getDeviceHardwareProfile(model).brand, randomize);
      ua = `Mozilla/5.0 (Linux; Android ${osVer}; ${model} Build/${buildId}) AppleWebKit/${safariWebKit} (KHTML, like Gecko) Version/4.0 Chrome/${fullChromeVer} Mobile Safari/604.1`;
      browserVer = '4.0';
    }
  } else if (os === 'ios') {
    const iosStr = osVer.replace('_', '.');
    const iosUaStr = osVer;
    if (browser === 'safari') {
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosUaStr} like Mac OS X) AppleWebKit/${safariWebKit} (KHTML, like Gecko) Version/${iosStr} Mobile/15E148 Safari/604.1`;
      browserVer = iosStr;
    } else if (browser === 'chrome') {
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosUaStr} like Mac OS X) AppleWebKit/${safariWebKit} (KHTML, like Gecko) CriOS/${fullChromeVer} Mobile/15E148 Safari/604.1`;
      browserVer = fullChromeVer.split('.').slice(0, 2).join('.');
    } else if (browser === 'firefox') {
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosUaStr} like Mac OS X) AppleWebKit/${safariWebKit} (KHTML, like Gecko) FxiOS/${fullFirefoxVer} Mobile/15E148 Safari/604.1`;
      browserVer = fullFirefoxVer;
    } else if (browser === 'edge') {
      const edgeVer = getEdgeVersion(randomize, browserVersionOverride);
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosUaStr} like Mac OS X) AppleWebKit/${safariWebKit} (KHTML, like Gecko) EdgiOS/${edgeVer} Mobile/15E148 Safari/604.1`;
      browserVer = edgeVer;
    } else {
      ua = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosUaStr} like Mac OS X) AppleWebKit/${safariWebKit} (KHTML, like Gecko) OPT/${fullChromeVer} Mobile/15E148 Safari/604.1`;
      browserVer = fullChromeVer.split('.').slice(0, 2).join('.');
    }
  }

  if (socialMedia && socialMedia !== 'none') {
    const locale_underscore = settings.locale ? settings.locale.replace('-', '_') : 'en_US';
    const profile = getDeviceHardwareProfile(devName || 'Pixel 9');
    const apiLevel = getApiLevel(osVer);
    
    // Hash-based IG build ID generator to keep it realistic and consistent
    const getIgBuildId = (modelStr: string): string => {
      let hash = 0;
      for (let i = 0; i < modelStr.length; i++) {
        hash = (hash << 5) - hash + modelStr.charCodeAt(i);
        hash |= 0;
      }
      const positive = Math.abs(hash);
      return (positive % 900000000 + 100000000).toString();
    };
    const igBuildId = getIgBuildId(profile.model);

    switch (socialMedia) {
      case 'facebook':
        if (os === 'android') {
          ua += ` [FB_IAB/FB4A;FBAV/450.0.0.44.111;FBBV/612345678;FBDV/${profile.model};FBMD/${profile.readable_name};FBSN/Android;FBSV/${osVer};FBSS/${profile.density_scale};FBID/phone;FBLC/${locale_underscore};FBOP/1]`;
        } else if (os === 'ios') {
          const iosVersion = osVer.replace(/_/g, '.');
          const hw = getIosHardwareIdAndScale(osVer, devName);
          ua += ` [FBAN/FBIOS;FBAV/450.0.0.44.111;FBBV/612345678;FBDV/${hw.hardwareId};FBMD/iPhone;FBSN/iOS;FBSV/${iosVersion};FBSS/${hw.scale};FBLC/${locale_underscore};FBID/phone;FBOP/1]`;
        } else {
          ua += ` [FB_IAB/FB4A;FBAV/450.0.0.44.111;FBLC/${locale_underscore};]`;
        }
        break;
      case 'instagram':
        if (os === 'android') {
          ua += ` Instagram 320.0.0.30.112 Android (${apiLevel}/${osVer}; ${profile.dpi}dpi; ${profile.width}x${profile.height}; ${profile.brand.toLowerCase()}; ${profile.model}; ${profile.codename}; ${profile.chipset}; ${locale_underscore}; ${igBuildId})`;
        } else if (os === 'ios') {
          ua += ` Instagram 320.0.0.30.112 (iPhone; iOS ${osVer.replace(/_/g, '_')}; ${locale_underscore}; en-US; scale=3.00; ${profile.width}x${profile.height})`;
        } else {
          ua += ` Instagram 320.0.0.30.112`;
        }
        break;
      case 'twitter':
        if (os === 'android') {
          ua += ` TwitterAndroid`;
        } else if (os === 'ios') {
          ua += ` Twitter for iPhone/11.67`;
        } else {
          ua += ` Twitter/11.67`;
        }
        break;
      case 'snapchat':
        if (os === 'android') {
          ua += ` Snapchat/13.17.0.42 (${profile.model}; Android ${osVer}#5203b0-96602e#${apiLevel}; gzip; ${profile.codename};)`;
        } else if (os === 'ios') {
          ua += ` Snapchat/13.17.0.42 (like Safari/${safariWebKit}, iphonedock)`;
        } else {
          ua += ` Snapchat/13.17.0.42 (gzip)`;
        }
        break;
      case 'linkedin':
        if (os === 'ios') {
          ua += ` [LinkedInApp]/9.30.1317`;
        } else if (os === 'android') {
          ua += ` [LinkedInApp]/9.30.1317`;
        } else {
          ua += ` [LinkedInApp]/9.30.1317`;
        }
        break;
      default:
        // Fallback for custom/unsupported apps
        ua += ` [${socialMedia.toUpperCase()}/1.0]`;
        break;
    }
  }

  return {
    userAgent: ua,
    browserVer,
    osVer,
    devName
  };
}

export function generateUserAgentsBulk(
  browser: BrowserType | string,
  os: OSType | string,
  deviceManufacturer: string = 'Pixel',
  density: number = 125,
  randomize: boolean = true,
  settings: EngineSettings,
  browserVersionOverride?: string,
  osVersionOverride?: string,
  deviceModelOverride?: string,
  socialMedia?: string,
  iosModelOverride?: string
): UserAgentItem[] {
  const list: UserAgentItem[] = [];
  const now = Date.now();

  const browsers = typeof browser === 'string'
    ? browser.split(',').map(b => b.trim() as BrowserType).filter(Boolean)
    : [browser];

  const oss = typeof os === 'string'
    ? os.split(',').map(o => o.trim() as OSType).filter(Boolean)
    : [os];

  const socialMediaApps = socialMedia && socialMedia !== 'none'
    ? socialMedia.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Build the combined pool of all available models for the selected brands
  const brands = deviceManufacturer.split(',').map(b => b.trim()).filter(Boolean);
  const modelPool: { brand: string; model: string }[] = [];
  for (const b of brands) {
    const models = DEVICE_MODELS[b];
    if (models) {
      for (const m of models) {
        modelPool.push({ brand: b, model: m });
      }
    }
  }

  // Fallback to Pixel if empty
  if (modelPool.length === 0) {
    const models = DEVICE_MODELS['Pixel'] || [];
    for (const m of models) {
      modelPool.push({ brand: 'Pixel', model: m });
    }
  }

  // Shuffle the pool to ensure fully random selection with no duplicates
  let shuffledPool = [...modelPool];
  if (randomize) {
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }
  }

  for (let i = 0; i < density; i++) {
    const activeBrowser = browsers[i % browsers.length] || 'chrome';
    const activeOS = oss[i % oss.length] || 'windows';
    const activeSocialMedia = socialMediaApps.length > 0
      ? socialMediaApps[i % socialMediaApps.length]
      : undefined;

    let currentModelOverride = deviceModelOverride;
    if (activeOS === 'android') {
      if (!deviceModelOverride || deviceModelOverride === 'auto') {
        const poolIndex = i % shuffledPool.length;
        // Reshuffle on wrap-around for maximum entropy if randomized
        if (i > 0 && poolIndex === 0 && randomize) {
          for (let s = shuffledPool.length - 1; s > 0; s--) {
            const j = Math.floor(Math.random() * (s + 1));
            [shuffledPool[s], shuffledPool[j]] = [shuffledPool[j], shuffledPool[s]];
          }
        }
        currentModelOverride = shuffledPool[poolIndex].model;
      }
    } else if (activeOS === 'ios') {
      currentModelOverride = iosModelOverride || 'auto';
    }

    // Generate strictly with the chosen specifications
    const { userAgent, browserVer, osVer, devName } = generateSingleUserAgent(
      activeBrowser,
      activeOS,
      deviceManufacturer,
      randomize,
      settings,
      browserVersionOverride,
      osVersionOverride,
      currentModelOverride,
      activeSocialMedia
    );

    const browserLabel = activeBrowser.charAt(0).toUpperCase() + activeBrowser.slice(1);
    const osLabel = activeOS === 'macos' ? 'macOS' : activeOS === 'ios' ? 'iOS' : activeOS.charAt(0).toUpperCase() + activeOS.slice(1);

    list.push({
      id: `${now}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      userAgent,
      browser: activeBrowser,
      browserVersion: `${browserLabel} ${browserVer}`,
      os: activeOS,
      osVersion: activeOS === 'android' ? `${osLabel} ${osVer} (${devName || 'Device'})` : `${osLabel} ${osVer.replace(/_/g, '.')}`,
      device: devName,
      timestamp: now - i * 1000,
      starred: false,
      locale: settings.locale,
      socialMedia: activeSocialMedia && activeSocialMedia !== 'none' ? activeSocialMedia : undefined
    });
  }

  return list;
}

export function getInitialSettings(): EngineSettings {
  return {
    chromeMinVersion: 147,
    chromeMaxVersion: 150,
    firefoxMinVersion: 149,
    firefoxMaxVersion: 152,
    safariMinVersion: 12,
    safariMaxVersion: 18,
    locale: 'en-US',
    includeLayoutEngine: true
  };
}

export function exportToCSV(items: UserAgentItem[]): string {
  const headers = ['ID', 'User-Agent String', 'Browser Profile', 'Operating System', 'Device Model', 'Generated At'];
  const rows = items.map(item => [
    item.id,
    `"${item.userAgent.replace(/"/g, '""')}"`,
    `"${item.browserVersion}"`,
    `"${item.osVersion}"`,
    item.device ? `"${item.device}"` : 'N/A',
    new Date(item.timestamp).toISOString()
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
