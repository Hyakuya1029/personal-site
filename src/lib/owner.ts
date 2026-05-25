const OWNER_EMAIL_HASH = 'ff490a56a53b0ace81946843079a5ba1cde9e808c55bb99f51c4b89534d7ae45';

async function computeHash(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function isOwnerEmail(email: string): Promise<boolean> {
  if (!email) return false;
  return await computeHash(email) === OWNER_EMAIL_HASH;
}
