export function getItem(label, key, icon, children, type, disabled) {
  return { key, icon, children, label, type, disabled };
}

export function validateEmail(mail) {
  let emailRegex = /(^[^@]+)@([^@.]+)\.{1}(\w{1,9}$)/;
  if(mail?.match(emailRegex))
    return true;
  else
    return false;
}

export const checkMimeType = (file, types1) => {
  let err = ''
  const types = types1 ?? ['image/png', 'image/jpeg', 'image/gif']
  if(types.every(type => file.type !== type)){
    err += file.type + ' формат буруу байна.';
  }

  if(err !== '') return err; 
  else return checkFileSize(file);
}

export const checkFileSize = file => {
  let size = 2000000;
  let err = ''; 
  if(file.size > size){
    err += 'Файлын хэмжээ хэт том байна.';
  }
  
  if(err !== '') return err;
  return false
}

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
}

export function formatNumber(num, dec){
  return new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: dec ?? 2 }).format(num ?? 0);
}

export const urlToFile = async (url, mimeType) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], 'imagefile', { type: mimeType });
};

const numbers = ["99","95","94","85","91","96","90","88","89","86","80","98","93","97","83"];

export function validateNumber(number){
  return number?.length === 8 && numbers?.includes(number?.substring(0, 2));
}

export function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}


const percentColors = [
  { pct: 0.0, color: { r: 0xE4, g: 0x10, b: 0x51 } },
  { pct: 0.5, color: { r: 0xFC, g: 0xD1, b: 0x2A } },
  { pct: 1.0, color: { r: 0x18, g: 0xCE, b: 0xC } } ];

export function getColor(pct) {
  for(var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct)
      break;
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
}  