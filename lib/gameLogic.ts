import { Question, GameMode, PlayerStats } from '../types/game';

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function generateQuestion(level: number): Question {
  let expression = '';
  let answer = 0;

  if (level === 1) {
    // Intermediate Dasar: (a + b) * c, a * b - c, a + b * c
    const a = getRandomInt(10, 50);
    const b = getRandomInt(10, 50);
    const c = getRandomInt(2, 9);
    const pattern = getRandomInt(0, 2);

    if (pattern === 0) {
      expression = `(${a} + ${b}) × ${c}`;
      answer = (a + b) * c;
    } else if (pattern === 1) {
      expression = `${a} × ${c} − ${b}`;
      answer = a * c - b;
    } else {
      expression = `${a} + ${b} × ${c}`;
      answer = a + b * c;
    }
  } else if (level === 2) {
    // Bilangan Negatif & Pembagian: a / b + (-c)
    const b = getRandomInt(2, 10);
    const a = b * getRandomInt(5, 20);
    const c = getRandomInt(3, 15);
    const pattern = getRandomInt(0, 2);

    if (pattern === 0) {
      expression = `${a} ÷ ${b} + (−${c})`;
      answer = (a / b) - c;
    } else if (pattern === 1) {
      const d = getRandomInt(2, 5);
      expression = `${a} − ${d} × (−${c})`;
      answer = a - d * (-c);
    } else {
      expression = `(−${a}) + ${b} × ${c}`;
      answer = -a + b * c;
    }
  } else if (level === 3) {
    // Persentase & Desimal
    const percentages = [10, 20, 25, 50, 75];
    const p = percentages[getRandomInt(0, percentages.length - 1)];
    const pattern = getRandomInt(0, 1);

    if (pattern === 0) {
      // p% of a + b
      const a = getRandomInt(1, 10) * 20; // 20, 40, 60... 200
      const b = getRandomInt(5, 50);
      expression = `${p}% dari ${a} + ${b}`;
      answer = (p / 100 * a) + b;
    } else {
      // a * 0.x - b
      const x = getRandomInt(1, 9);
      const a = getRandomInt(1, 10) * 10;
      const b = getRandomInt(1, 20);
      expression = `${a} × 0.${x} − ${b}`;
      answer = parseFloat(((a * (x / 10)) - b).toFixed(1));
    }
  } else if (level === 4) {
    // Kuadrat & Akar
    const pattern = getRandomInt(0, 2);
    if (pattern === 0) {
      const a = getRandomInt(2, 12);
      const b = getRandomInt(2, 10);
      const c = getRandomInt(1, 50);
      expression = `√${a * a} × ${b} − ${c}`;
      answer = a * b - c;
    } else if (pattern === 1) {
      const a = getRandomInt(2, 12);
      const b = getRandomInt(2, 12);
      const c = getRandomInt(1, 50);
      expression = `${a}² + ${b}² − ${c}`;
      answer = a * a + b * b - c;
    } else {
      const a = getRandomInt(5, 15);
      const b = getRandomInt(1, 10);
      const c = getRandomInt(2, 5);
      // Ensure (a^2 - b) divisible by c
      let aSq = a * a;
      let bVal = b;
      while ((aSq - bVal) % c !== 0) {
        bVal++;
      }
      expression = `(${a}² − ${bVal}) ÷ ${c}`;
      answer = (aSq - bVal) / c;
    }
  } else {
    // Level 5+ Ekspresi Kompleks
    const a = getRandomInt(5, 12);
    const b = getRandomInt(2, 10);
    const c = getRandomInt(2, 10);
    const d = getRandomInt(1, 5);
    const pattern = getRandomInt(0, 1);

    if (pattern === 0) {
      // (a^2 - b * c) / d
      let aSq = a * a;
      let bc = b * c;
      let dVal = d;
      while ((aSq - bc) % dVal !== 0 || aSq - bc < 0) {
        bc = getRandomInt(2, 10) * getRandomInt(2, 10);
      }
      expression = `(${a}² − ${b} × ${c}) ÷ ${dVal}`;
      answer = (aSq - bc) / dVal;
    } else {
      // √a * (b - c^2) + d
      const rootBase = getRandomInt(2, 12);
      const cSq = getRandomInt(2, 5);
      const bVal = getRandomInt(25, 50);
      expression = `√${rootBase * rootBase} × (${bVal} − ${cSq}²) + ${d}`;
      answer = rootBase * (bVal - cSq * cSq) + d;
    }
  }

  return { expression, answer, level };
}

export function validateAnswer(input: string, correctAnswer: number): boolean {
  const numInput = parseFloat(input);
  return Math.abs(numInput - correctAnswer) < 0.01;
}

export function calculateScore(stats: PlayerStats, isCorrect: boolean, timeUsed?: number): number {
  if (!isCorrect) return stats.score;
  
  let basePoints = 100 * stats.level;
  
  if (stats.mode === 'speed-rush' && timeUsed !== undefined) {
    // Bonus speed: max 100 bonus, decreases as timeUsed increases
    const speedBonus = Math.max(0, 100 - (timeUsed * 10));
    return stats.score + basePoints + Math.floor(speedBonus);
  }
  
  return stats.score + basePoints;
}
