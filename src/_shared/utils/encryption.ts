// Packages
import { createHash } from 'node:crypto';
import { webcrypto, randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';

function getKey() {
  const keyString = createHash('sha256')
  .update(Deno.env.get('APP_KEY')!)
  .digest()

  return keyString;
}

export async function encrypt(plainText: string) {
  const iv = randomBytes(16).toString('base64')
  const key = await webcrypto.subtle.importKey('raw', getKey(), 'AES-CBC', true, ["encrypt", "decrypt"]);

  const ciphertext = await webcrypto.subtle.encrypt(
    {name: "AES-CBC", iv: Buffer.from(iv, 'base64')},
    key,
    new TextEncoder().encode(plainText),
  );

  return `${Buffer.from(ciphertext).toString('base64')}.${iv}`;
}

export async function decrypt(ciphertext: string) {
  const [encText, iv] = ciphertext.split('.');

  const key = await webcrypto.subtle.importKey('raw', getKey(), 'AES-CBC', true, ["encrypt", "decrypt"]);

  const decyptedText = await webcrypto.subtle.decrypt(
    {name: "AES-CBC", iv: Buffer.from(iv, 'base64')},
    key,
    Buffer.from(encText, 'base64'),
  );

  return (new TextDecoder()).decode(decyptedText);
}