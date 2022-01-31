/**
 * Ref: https://stackoverflow.com/a/54026460
 */

const salt = '9Ptu3rgxnQ9vWgnT';

export const cipher = () => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n) => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text) => text.split('').reverse().map(textToChars).map(applySaltToChar).map(byteHex).join('');
};

export const decipher = () => {
  const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return (encoded) =>
    encoded
      .match(/.{1,2}/g)
      .reverse()
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join('');
};
