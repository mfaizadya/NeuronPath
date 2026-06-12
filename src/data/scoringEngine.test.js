import { describe, it, expect } from 'vitest';
import { generateResult } from './scoringEngine';

describe('Scoring Engine', () => {
  it('calculates correct scores and dominant style/pattern', () => {
    const answers = {
      g1: 5, g4: 5, // Visual max
      g2: 3, g5: 3, // Auditori mid
      g3: 1, g6: 1, // Kinestetik low
      p1: 5, p5: 5, // Consistent max
      p2: 2, p6: 2, p9: 2, // Fast low
      p3: 3, p7: 3, // Reflective mid
      p4: 4, p8: 4, // Balanced mid-high
    };

    const result = generateResult(answers);

    // Visual score: ( (5+5)/2 ) / 5 * 100 = 100
    // Auditori score: ( (3+3)/2 ) / 5 * 100 = 60
    // Kinestetik score: ( (1+1)/2 ) / 5 * 100 = 20
    expect(result.gayaBelajar.scores.visual).toBe(100);
    expect(result.gayaBelajar.scores.auditori).toBe(60);
    expect(result.gayaBelajar.scores.kinestetik).toBe(20);
    expect(result.gayaBelajar.dominant).toBe('Visual');

    // Consistent score: ( (5+5)/2 ) / 5 * 100 = 100
    // Fast score: ( (2+2+2)/3 ) / 5 * 100 = 40
    // Reflective score: ( (3+3)/2 ) / 5 * 100 = 60
    // Balanced score: ( (4+4)/2 ) / 5 * 100 = 80
    expect(result.polaBelajar.scores.consistent).toBe(100);
    expect(result.polaBelajar.scores.fast).toBe(40);
    expect(result.polaBelajar.scores.reflective).toBe(60);
    expect(result.polaBelajar.scores.balanced).toBe(80);
    expect(result.polaBelajar.dominant).toBe('Consistent');

    expect(result.totalQuestions).toBe(15);
    expect(result.answeredQuestions).toBe(15);
  });

  it('handles empty answers gracefully', () => {
    const result = generateResult({});
    
    expect(result.gayaBelajar.scores.visual).toBe(0);
    expect(result.polaBelajar.scores.consistent).toBe(0);
    expect(result.answeredQuestions).toBe(0);
  });

  it('handles partial answers', () => {
    const answers = { g2: 4, p3: 5 }; // Auditori 80, Reflective 100
    const result = generateResult(answers);

    expect(result.gayaBelajar.scores.visual).toBe(0);
    expect(result.gayaBelajar.scores.auditori).toBe(80);
    expect(result.polaBelajar.scores.reflective).toBe(100);
    expect(result.gayaBelajar.dominant).toBe('Auditori');
    expect(result.polaBelajar.dominant).toBe('Reflective');
    expect(result.answeredQuestions).toBe(2);
  });
});
