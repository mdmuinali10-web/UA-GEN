import fs from 'fs';

let content = fs.readFileSync('src/utils/generator.ts', 'utf8');

// Replace the old function
const regex = /export function generateAndroidBuildId\([\s\S]*?return \`\\\${brandPrefix}\.\\\${dateStr}\.\\\${seq}\\\${suffix}\`;\n\}/;

const newFunction = `export function generateAndroidBuildId(osVer: string, brand: string, randomize: boolean, model: string): string {
  const ver = parseInt(osVer.split('.')[0] || '14', 10);
  
  // Base prefixes per Android version
  const prefixes: Record<number, string[]> = {
    10: ['QP1A'],
    11: ['RQ1A', 'RQ2A', 'RQ3A'],
    12: ['SP1A', 'SP2A', 'SD1A'],
    13: ['TP1A', 'TQ1A', 'TQ2A', 'TQ3A'],
    14: ['UP1A', 'UQ1A', 'UKQ1'],
    15: ['AP1A', 'AP2A', 'AP3A', 'AP4A'],
    16: ['BP1A', 'BP2A']
  };
  
  const prefixList = prefixes[ver] || ['UP1A'];
  let prefix = randomize ? pickRandom(prefixList) : prefixList[0];
  
  // generated_at is now
  const generatedAt = Date.now();
  
  // Determine launch year based on the OS
  const osYearMap: Record<number, number> = {
    10: 2019, 11: 2020, 12: 2021, 13: 2022, 14: 2023, 15: 2024, 16: 2025
  };
  
  // We need to look up DEVICE_OS_MAPPINGS manually or just use the current ver
  const osReleaseYear = osYearMap[ver] || 2023;
  const osReleaseDate = new Date(\`\${osReleaseYear}-08-01T00:00:00Z\`).getTime();
  
  // A rough estimate of device launch date based on its original OS
  let deviceLaunchDate = osReleaseDate;
  // If we can parse the range from DEVICE_OS_MAPPINGS
  const mappingMatch = content.match(new RegExp(\`'\${model}': \\{ launch: (\\d+)\`));
  if (mappingMatch && mappingMatch[1]) {
    const launchOs = parseInt(mappingMatch[1], 10);
    deviceLaunchDate = new Date(\`\${osYearMap[launchOs] || 2019}-08-01T00:00:00Z\`).getTime();
  }
  
  // Rule 4: Build date usually 7 days to 24 months older than generated_at
  const minAgeMs = 7 * 24 * 60 * 60 * 1000;
  const maxAgeMs = 24 * 30 * 24 * 60 * 60 * 1000;
  
  let maxBuildTime = generatedAt - minAgeMs;
  let minBuildTime = generatedAt - maxAgeMs;
  
  // Rule 3: build_date >= device_launch_date
  if (minBuildTime < deviceLaunchDate) {
    minBuildTime = deviceLaunchDate;
  }
  
  if (minBuildTime < osReleaseDate) {
    minBuildTime = osReleaseDate;
  }
  
  if (maxBuildTime < minBuildTime) {
    maxBuildTime = minBuildTime + (30 * 24 * 60 * 60 * 1000);
  }
  
  // To strictly respect Rule 2: build_date <= generated_at
  if (maxBuildTime > generatedAt) {
    maxBuildTime = generatedAt;
  }
  if (minBuildTime > maxBuildTime) {
    minBuildTime = maxBuildTime - minAgeMs;
  }
  
  const buildTime = randomize 
    ? minBuildTime + Math.random() * (maxBuildTime - minBuildTime)
    : maxBuildTime - (30 * 24 * 60 * 60 * 1000);
    
  const buildDate = new Date(buildTime);
  const year = buildDate.getUTCFullYear().toString().slice(2);
  const month = (buildDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = buildDate.getUTCDate().toString().padStart(2, '0');
  
  const dateStr = \`\${year}\${month}\${day}\`;
  
  // Sequence number
  const seq = randomize ? getRandomInt(1, 999).toString().padStart(3, '0') : '001';
  
  // Suffix (security patch/variant)
  const hasSuffix = randomize ? Math.random() > 0.5 : false;
  const suffixChar = randomize ? pickRandom(['A', 'B', 'C', 'V']) : 'A';
  const suffixNum = randomize ? getRandomInt(1, 9) : 1;
  const suffix = hasSuffix || brand.toLowerCase() === 'google' ? \`.\${suffixChar}\${suffixNum}\` : '';
  
  let brandPrefix = prefix;
  if (brand.toLowerCase() === 'xiaomi' && ver >= 13) {
    brandPrefix = ver === 14 ? 'UKQ1' : (ver === 13 ? 'TKQ1' : prefix);
  }
  
  return \`\${brandPrefix}.\${dateStr}.\${seq}\${suffix}\`;
}`;

content = content.replace(regex, newFunction);

// Update calls
content = content.replace(/generateAndroidBuildId\(osVer, getDeviceHardwareProfile\(model\)\.brand, randomize\)/g, 
  "generateAndroidBuildId(osVer, getDeviceHardwareProfile(model).brand, randomize, model)");

fs.writeFileSync('src/utils/generator.ts', content);
