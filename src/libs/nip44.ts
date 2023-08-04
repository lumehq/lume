// source: https://github.com/nbd-wtf/nostr-tools/blob/b1fc8ab401b8074f53e6a05a1a6a13422fb01b2d/nip44.ts
import { xchacha20 } from '@noble/ciphers/chacha';
import { secp256k1 } from '@noble/curves/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { randomBytes } from '@noble/hashes/utils';
import { base64 } from '@scure/base';

export function getConversationKey(privkeyA: string, pubkeyB: string) {
  const key = secp256k1.getSharedSecret(privkeyA, '02' + pubkeyB);
  return sha256(key.slice(1, 33));
}

export function nip44Encrypt(
  privkey: string,
  pubkey: string,
  text: string,
  ver = 1
): string {
  if (ver !== 1) throw new Error('NIP44: unknown encryption version');

  const key = getConversationKey(privkey, pubkey);
  const nonce = randomBytes(24);
  const plaintext = new TextEncoder().encode(text);
  const ciphertext = xchacha20(key, nonce, plaintext, plaintext);
  const ctb64 = base64.encode(ciphertext);
  const nonceb64 = base64.encode(nonce);

  return JSON.stringify({ ciphertext: ctb64, nonce: nonceb64, v: 1 });
}

export function nip44Decrypt(privkey: string, pubkey: string, data: string): string {
  const dt = JSON.parse(data);
  if (dt.v !== 1) throw new Error('NIP44: unknown encryption version');

  let { ciphertext, nonce } = dt;
  ciphertext = base64.decode(ciphertext);
  nonce = base64.decode(nonce);

  const key = getConversationKey(privkey, pubkey);
  const plaintext = xchacha20(key, nonce, ciphertext, ciphertext);
  const text = new TextDecoder('utf-8').decode(plaintext);

  return text;
}
