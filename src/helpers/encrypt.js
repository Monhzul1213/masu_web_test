import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

export function encrypt(text){
  let key = CryptoJS.enc.Utf8.parse('2022120404654321');
  let iv = CryptoJS.enc.Utf8.parse('2022120404654321');
  let opts = {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };

  let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, opts).toString();
  return encrypted;
}

export function decrypt(cipherText) {
  const key = CryptoJS.enc.Utf8.parse('2022120404654321');
  const iv = CryptoJS.enc.Utf8.parse('2022120404654321');

  const opts = {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };

  const decrypted = CryptoJS.AES.decrypt(cipherText, key, opts);
  return decrypted.toString(CryptoJS.enc.Utf8);
}