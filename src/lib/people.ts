/**
 * The name to show for a learner. Some accounts have no real name: a code
 * login only knows the email, so the "name" is the email or its first half.
 * Those are turned into something readable, and never shown as a long
 * unbreakable address.
 */
export function displayName(name: string | null | undefined, email = ''): string {
  const raw = (name || email || '').trim()
  if (!raw) return 'Learner'
  // "ada.obi_77@gmail.com" or "ada.obi_77" -> "ada obi"
  const fromEmail = raw.includes('@') || !/\s/.test(raw)
  if (!fromEmail) return raw
  const cleaned = raw
    .split('@')[0]
    .replace(/[._\-+]+/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned || raw.split('@')[0]
}
