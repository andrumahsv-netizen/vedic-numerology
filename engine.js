// ==========================================================================
// АРХИТЕКТУРНЫЙ ДВИЖОК РАСЧЕТОВ (engine.js) — ПОЛНАЯ ИСПРАВЛЕННАЯ СБОРКА
// ==========================================================================

import { LETTERS_MAP, ALL_VOWELS, MATRIX_TEXTS, ARROWS_DB } from './db.js';

/**
 * Оптимизированное математическое сворачивание числа до однозначного (1-9)
 */
export function reduceToSingle(num) {
    if (!num) return 0;
    const parsed = parseInt(num, 10);
    if (isNaN(parsed) || parsed === 0) return 0;
    return ((parsed - 1) % 9) + 1;
}

/**
 * Безопасное извлечение компонентов даты (Day, Month, Year) из строки YYYY-MM-DD
 */
function parseSafeDateString(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    return {
        day: parseInt(parts[2], 10),
        month: parseInt(parts[1], 10),
        year: parseInt(parts[0], 10)
    };
}

/**
 * РАСЧЕТ МАСТЕР-ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
 */
export function calculateMasterProfile(name, dateString) {
    const dateComponents = parseSafeDateString(dateString);
    if (!dateComponents) return null;
    const { day, month, year } = dateComponents;

    // 1. Вычисление фундаментальных чисел
    const soulNum = reduceToSingle(day); // 18 -> 9

    // Сумма всех цифр года
    const yearDigitsSum = String(year).split('').reduce((a, b) => a + parseInt(b, 10), 0);
    const destinyRaw = day + month + yearDigitsSum;
    const destinyNum = reduceToSingle(destinyRaw);

    // 2. Парсинг и нумерологический анализ Имени
    const cleanName = name.toUpperCase().replace(/[^A-ZА-ЯЁ]/g, '');
    let nSum = 0, sSum = 0, pSum = 0;
    for (let char of cleanName) {
        const v = LETTERS_MAP[char];
        if (v) {
            nSum += v;
            if (ALL_VOWELS.includes(char)) sSum += v;
            else pSum += v;
        }
    }

    // 3. Расчет Личного Года (на основе текущего календарного года)
    const currentYear = new Date().getFullYear();
    const personalYear = reduceToSingle(day + month + currentYear);

    // 4. Сбор сырых цифр для построения Сакральной Матрицы
    const rawDigits = (day.toString() + month.toString() + year.toString()).split('');

    return {
        soulNum,
        destinyNum,
        nameNum: cleanName ? reduceToSingle(nSum) : "-",
        vowelsNum: cleanName ? reduceToSingle(sSum) : "-",
        consonantsNum: cleanName ? reduceToSingle(pSum) : "-",
        personalYear,
        rawDigits
    };
}

/**
 * ВЫЧИСЛЕНИЕ ЦЕПОЧКИ ЭНЕРГИИ ДНЯ
 * ТЕПЕРЬ ПОЛНОСТЬЮ АВТОНОМНО: Считает строго по компонентам даты, без привязки к "сегодня"
 */
export function calculateDayChain(birthDay, targetDay = 1) {
    const safeBirthDay = parseInt(birthDay, 10) || 1;
    const safeTargetDay = parseInt(targetDay, 10) || 1;

    // Считаем строго: Число Души (свернутый день рождения) + целевой день календаря
    const soulNum = reduceToSingle(safeBirthDay); // Если 18, то станет 9
    const dayEnergySum = soulNum + safeTargetDay; // 9 + 1 = 10
    
    const dayChain = [dayEnergySum];
    let cur = dayEnergySum;
    while (cur > 9) {
        cur = String(cur).split('').reduce((a, b) => a + parseInt(b, 10), 0);
        dayChain.push(cur);
    }

    return {
        sum: dayEnergySum,
        currentCalDay: safeTargetDay,
        chain: dayChain,
        finalCode: dayChain[dayChain.length - 1] // Для 18 и 01.01 вернет строго 1
    };
}

/**
 * НАВИГАТОР ОТНОШЕНИЙ: СВЯЗУЮЩИЙ АНАЛИЗАТОР
 */
export function calculateRelationTip(targetBirthDate, currentDayCode) {
    const dateComponents = parseSafeDateString(targetBirthDate);
    if (!dateComponents || !currentDayCode) return null;
    const targetSoulNum = reduceToSingle(dateComponents.day);
    return { targetSoulNum, currentDayCode };
}

/**
 * АНАЛИЗАТОР МАТРИЦЫ И ПОИСК САКРАЛЬНЫХ СТРЕЛ
 */
export function analyzeMatrixData(rawDigits) {
    const counts = {};
    const safeDigits = rawDigits.map(x => parseInt(x, 10)).filter(x => !isNaN(x));

    for (let i = 1; i <= 9; i++) {
        counts[i] = safeDigits.filter(x => x === i).length;
    }

    const cellAnalyses = [];
    for (let i = 1; i <= 9; i++) {
        const count = counts[i];
        const dbCell = MATRIX_TEXTS[i];
        const textKey = count > 3 && dbCell[4] ? 4 : count;
        const text = dbCell[textKey] || dbCell[count] || dbCell[1];
        cellAnalyses.push({ num: i, title: dbCell.title, count: count, text: text });
    }

    const activeArrows = [];
    const arrowLines = [
        { line: "3-5-7", check: [3, 5, 7] },
        { line: "1-5-9", check: [1, 5, 9] },
        { line: "4-5-6", check: [4, 5, 6] },
        { line: "2-5-8", check: [2, 5, 8] },
        { line: "7-8-9", check: [7, 8, 9] }
    ];

    for (let item of arrowLines) {
        if (item.check.every(num => counts[num] > 0)) {
            if (ARROWS_DB[item.line]) {
                activeArrows.push(ARROWS_DB[item.line]);
            }
        }
    }
    return { cells: cellAnalyses, arrows: activeArrows };
}