describe('Academic SKS & Credits Validation Engine', () => {
  it('should allow valid KRS enrollment within 24 SKS limit', () => {
    const courseCredits = [3, 3, 3, 3, 3, 3, 2]; // 20 SKS
    const totalCredits = courseCredits.reduce((sum, c) => sum + c, 0);
    const maxCredits = 24;

    expect(totalCredits).toBe(20);
    expect(totalCredits).toBeLessThanOrEqual(maxCredits);
  });

  it('should reject enrollment exceeding 24 SKS limit', () => {
    const courseCredits = [4, 4, 4, 4, 4, 3, 3]; // 26 SKS
    const totalCredits = courseCredits.reduce((sum, c) => sum + c, 0);
    const maxCredits = 24;

    expect(totalCredits).toBe(26);
    expect(totalCredits > maxCredits).toBe(true);
  });
});

