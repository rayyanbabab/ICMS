describe('KHS Grade Point & GPA (IPK) Calculation Engine', () => {
  function calculateGrade(scoreNumeric: number): { letter: string; point: number } {
    if (scoreNumeric >= 85) return { letter: 'A', point: 4.0 };
    if (scoreNumeric >= 75) return { letter: 'B+', point: 3.5 };
    if (scoreNumeric >= 70) return { letter: 'B', point: 3.0 };
    if (scoreNumeric >= 60) return { letter: 'C+', point: 2.5 };
    if (scoreNumeric >= 55) return { letter: 'C', point: 2.0 };
    if (scoreNumeric >= 40) return { letter: 'D', point: 1.0 };
    return { letter: 'E', point: 0.0 };
  }

  function calculateIpk(courses: Array<{ credits: number; point: number }>): number {
    const totalPoints = courses.reduce((sum, c) => sum + c.credits * c.point, 0);
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
  }

  it('should accurately convert numerical scores to Indonesian university grade letters and points', () => {
    expect(calculateGrade(92)).toEqual({ letter: 'A', point: 4.0 });
    expect(calculateGrade(80)).toEqual({ letter: 'B+', point: 3.5 });
    expect(calculateGrade(72)).toEqual({ letter: 'B', point: 3.0 });
    expect(calculateGrade(65)).toEqual({ letter: 'C+', point: 2.5 });
    expect(calculateGrade(30)).toEqual({ letter: 'E', point: 0.0 });
  });

  it('should accurately calculate semester IPS and cumulative IPK', () => {
    const studentSemester = [
      { credits: 3, point: 4.0 }, // 12
      { credits: 3, point: 4.0 }, // 12
      { credits: 3, point: 3.5 }, // 10.5
      { credits: 3, point: 4.0 }, // 12
      { credits: 3, point: 3.5 }, // 10.5
      { credits: 3, point: 4.0 }, // 12
      { credits: 2, point: 4.0 }, // 8
    ]; // Total credits: 20, Total points: 77 -> 77 / 20 = 3.85

    const ipk = calculateIpk(studentSemester);
    expect(ipk).toBe(3.85);
  });
});

