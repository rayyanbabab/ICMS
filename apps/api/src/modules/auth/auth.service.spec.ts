import * as argon2 from 'argon2';

describe('Auth & Password Security Engine (Argon2id)', () => {
  it('should generate secure Argon2id hash for password', async () => {
    const rawPassword = 'SecurePassword123!';
    const hash = await argon2.hash(rawPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
    });

    expect(hash).toBeDefined();
    expect(hash.startsWith('$argon2id$')).toBe(true);

    const isMatch = await argon2.verify(hash, rawPassword);
    expect(isMatch).toBe(true);

    const isWrongMatch = await argon2.verify(hash, 'WrongPassword!');
    expect(isWrongMatch).toBe(false);
  });
});

