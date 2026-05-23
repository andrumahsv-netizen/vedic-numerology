// ==========================================================================
// МОДУЛЬ БИЗНЕС-КАЛЕНДАРЯ (calendar.js) — ПОЛНАЯ ИСПРАВЛЕННАЯ СБОРКА
// ==========================================================================

// Слой 1: Базовые архетипы планет (Изящный бизнес-стиль)
const PLANET_CORES = {
    1: { name: "Солнце (Сурья)", keyword: "Стратегический суверенитет", biz: "авторские директивы, запуск флагманских продуктов, позиционирование личного бренда лидера", shadow: "Минимизируйте избыточное давление на топ-менеджмент. Фокусируйтесь на глобальном векторе, избегая микроменеджмента." },
    2: { name: "Луна (Чандра)", keyword: "Глубинный аудит и эмпатия", biz: "ключевые переговоры, деликатные кадровые перестановки, стабилизация психологического климата", shadow: "Исключите принятие решений под влиянием сиюминутных импульсов. Операционные показатели требуют хладнокровного анализа." },
    3: { name: "Юпитер (Гуру)", keyword: "Масштабная экспансия", biz: "крупные стратегические инвестиции, масштабирование франшиз, создание международных консорциумов", shadow: "Избегайте переоценки рыночных возможностей. Каждое расширение должно быть подкреплено твердым юридическим аудитом." },
    4: { name: "Раху (Узел)", keyword: "Инновационный прорыв", biz: "технологическая модернизация, внедрение искусственного интеллекта, антикризисное маневрирование", shadow: "Повышена вероятность столкновения со скрытыми дефектами в цифровых контрактах. Избегайте устных соглашений." },
    5: { name: "Меркурий (Буддха)", keyword: "Высокоскоростная коммерция", biz: "интенсивные продажи, проведение ключевых питчей, масштабирование цифровых рекламных каналов", shadow: "Существует риск поверхностного восприятия условий сделок. Внимательно проверяйте технические регламенты." },
    6: { name: "Венера (Шукра)", keyword: "Премиальный нетворкинг", biz: "заключение VIP-контрактов, совершенствование эстетики продукта, закрытые презентации для инвесторов", shadow: "Контролируйте представительские расходы. Эстетическая сторона не должна превалировать над чистой маржинальностью." },
    7: { name: "Кету (Узел)", keyword: "Глубинный анализ уязвимостей", biz: "конфиденциальный аудит систем безопасности, оптимизация архитектуры данных, внутренняя реструктуризация", shadow: "Возможен дефицит открытой информации. Не принимайте решения на основе неполных аналитических отчетов." },
    8: { name: "Сатурн (Шани)", keyword: "Системная архитектура", biz: "оптимизация операционных издержек, внедрение жестких KPI, регламентация бизнес-процессов", shadow: "Опасайтесь операционного паралича из-за избыточной бюрократии. Удерживайте баланс между контролем и скоростью." },
    9: { name: "Марс (Мангал)", keyword: "Тактический штурм", biz: "агрессивный маркетинг, решительное вытеснение конкурентов, оперативная ликвидация кассовых разрывов", shadow: "Избегайте жестких ультиматумов в диалоге с долгосрочными партнерами. Излишнее давление может разрушить альянс." }
};

const LUNAR_TITHI_DB = {
    1: "Энергия Инициации. Период идеален для фиксации фундаментальных бизнес-гипотез.",
    2: "Энергия Партнерства. Время для формирования устойчивых дипломатических альянсов.",
    3: "Вектор Роста. Потенциал для расширения операционных возможностей и бюджетов.",
    4: "Фаза Осмотрительности. Рекомендуется усилить контроль за проведением транзакций.",
    5: "Время Менторства. Благоприятно для проведения экспертного консалтинга и защиты инвест-планов.",
    6: "Фаза Оптимизации. Подходящий момент для пересмотра пула неэффективных подрядчиков.",
    7: "Точка Триумфа. Время фиксации коммерческих результатов и подписания ключевых актов.",
    8: "Вектор Защиты. Рекомендуется аудит прав на интеллектуальную собственность компании.",
    9: "Противостояние. Повышена конкурентная активность. Требуется юридическая безупречность.",
    10: "Системная Интеграция. Идеально для привлечения в команду топ-менеджеров высшего звена.",
    11: "Пик Продуктивности. Максимальный отклик рынка на персонализированные VIP-предложения.",
    12: "Капитальные Инвестиции. Время для вложений в основные средства и инфраструктуру.",
    13: "Эра Обновления. Оптимальный момент для ребрендинга и модернизации позиционирования.",
    14: "Операционная Консервация. Рекомендуется аккумулировать ликвидность на счетах.",
    15: "Точка Полноты (Пурнима). Высшая точка емкости рынка. Идеально для проведения лончей.",
    16: "Аналитический Пересчет. Сместите фокус с объемов выручки на чистую рентабельность.",
    17: "Делегирование Управления. Передайте рутинный контроль топам для работы над стратегией.",
    18: "Коррекция Трендов. Период временного затишья рынка. Снизьте интенсивность затрат.",
    19: "Кадровый Аудит. Время для бескомпромиссной оценки эффективности линейного персонала.",
    20: "Стратегическая Изоляция. Посвятите день стресс-тестированию финансовой модели.",
    21: "Динамические Сделки. Время быстрых коммерческих решений и высоколиквидных операций.",
    22: "Консервативная Мудрость. Опирайтесь на верифицированные исторические данные компании.",
    23: "Финансовый Контроль. Категорический запрет на неконтролируемые рассрочки и кассовые риски.",
    24: "Санация Систем. Время для устранения технических багов и оптимизации баз данных.",
    25: "Правовой Экспертиза. Внимательно изучайте пункты договоров, касающиеся скрытых обязательств.",
    26: "Рыночное Сопротивление. Спрос стабилизируется. Сосредоточьтесь на удержании VIP-клиентов.",
    27: "Интеллектуальный Инсайт. Отличный день для патентования и внедрения инновационных R&D-фич.",
    28: "Закрытие Обязательств. Время для выплаты бонусов, дивидендов и ликвидации задолженностей.",
    29: "Точка Обнуления (Амавасья). Период минимальной внешней активности. Запрет на публичные старты.",
    30: "Архитектура Будущего. Формирование детализированной дорожной карты на следующий цикл."
};

const ENEMY_MAP = {
    1: [8, 7, 4], 2: [4, 7, 9], 3: [6, 4], 4: [1, 2, 8], 5: [4, 7],
    6: [3, 1], 7: [1, 2, 9], 8: [1, 9, 4], 9: [8, 5, 2]
};

const FRIEND_MAP = {
    1: [1, 3, 5, 9], 2: [1, 3, 5], 3: [1, 2, 3, 9], 4: [5, 6],
    5: [1, 5, 6], 6: [5, 6, 8], 7: [5, 6], 8: [5, 6, 8], 9: [1, 3, 9]
};

const WEEK_PLANETS = [3, 1, 2, 9, 5, 3, 6];

function getDecadeModifier(day) {
    if (day <= 10) return { phase: "Инициация", text: "Вектор направлен на экспансию, активный захват рыночных ниш." };
    if (day <= 20) return { phase: "Стабилизация", text: "Фокус на удержании позиций и выстраивании системных связок." };
    return { phase: "Фиксация", text: "Период консолидации прибыли и аудита издержек." };
}

function reduceToSingleDigit(num) {
    if (!num) return 0;
    const parsed = parseInt(num, 10);
    if (isNaN(parsed) || parsed === 0) return 0;
    return ((parsed - 1) % 9) + 1;
}

export function generateBusinessCalendar(birthDateStr, targetMonth, targetYear) {
    if (!birthDateStr) return null;

    // ИСПРАВЛЕНО: Извлекаем компоненты даты строго по строке, убирая баг со сдвигом Date()
    const parts = birthDateStr.split('-');
    const birthDay = parseInt(parts[2], 10);   // Например: 18
    const birthMonth = parseInt(parts[1], 10); // Например: 1
    const birthYear = parseInt(parts[0], 10);

    const moolank = reduceToSingleDigit(birthDay); // 18 -> 9
    const bBhagya = reduceToSingleDigit(birthDay + birthMonth + reduceToSingleDigit(birthYear));
    const personalYear = reduceToSingleDigit(birthDay + birthMonth + targetYear);

    // Расчет количества дней в запрашиваемом месяце
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const rows = [];

    let financeDaysCount = 0;
    let riskDaysCount = 0;
    let highProductivityDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const currentMonthNum = targetMonth + 1;
        
        // ГЛАВНАЯ ФОРМУЛА: Календарю теперь ПОХУЙ на текущую дату устройства.
        // Берем Число Души человека (moolank) и прибавляем текущий день сетки календаря
        const dayVibration = reduceToSingleDigit(moolank + day);

        const planet = PLANET_CORES[dayVibration];
        const tithiIndex = ((day + currentMonthNum * 3 + targetYear) % 30) || 30;
        const tithiText = LUNAR_TITHI_DB[tithiIndex];
        const decade = getDecadeModifier(day);

        const isWaxingMoon = tithiIndex <= 15;
        const moonPhaseText = isWaxingMoon 
            ? "Активная фаза (Шукла Пакша): Время для инвестиций, расширения воронки и масштабирования." 
            : "Регенеративная фаза (Кришна Пакша): Оптимизация процессов, удержание позиций, дожим текущих сделок.";

        const dateObj = new Date(targetYear, targetMonth, day);
        const dayOfWeek = dateObj.getDay();
        const weekPlanet = WEEK_PLANETS[dayOfWeek];

        let dayFinanceWeight = 0.5;
        let dayRiskWeight = 0.3;
        let dayEffWeight = 0.5;
        let finalStatus = "Нейтрально";
        let premiumIndicator = "📋✨";
        let textPrefix = "";

        let isCoreEnemy = ENEMY_MAP[dayVibration].includes(moolank) || ENEMY_MAP[dayVibration].includes(personalYear);
        let isCoreFriend = FRIEND_MAP[dayVibration].includes(moolank) && FRIEND_MAP[dayVibration].includes(personalYear);

        if (dayVibration === moolank) {
            finalStatus = "Благоприятно";
            premiumIndicator = "🔥👑";
            dayFinanceWeight = 1.0;
            dayEffWeight = 1.0;
            dayRiskWeight = 0.0;
            textPrefix = `🌟 ЛИЧНЫЙ ДЕНЬ СИЛЫ. Полный волновой резонанс дня с вашей корневой структурой. Внешние ограничения деактивированы. Любое стратегическое решение имеет абсолютный приоритет. `;
        } else if (dayVibration === bBhagya) {
            finalStatus = "Благоприятно";
            premiumIndicator = "💰🎯";
            dayFinanceWeight = 1.0;
            dayEffWeight = 0.8;
            textPrefix = `🎯 РЕЗОНАНС ПРЕДНАЗНАЧЕНИЯ. Сутки активируют ваш финансовый вектор. Успех приносят масштабные, нестандартные идеи. Время для крупных чеков. `;
        } else if (isCoreEnemy) {
            finalStatus = "Внимание";
            premiumIndicator = "⚠️⚡";
            dayRiskWeight = 1.0;
            dayEffWeight = 0.2;
            dayFinanceWeight = 0.1;
            textPrefix = `⚠️ ПЛАНЕТАРНЫЙ ДИССОНАНС. Транзит ${planet.name} входит в противоречие с вашей картой. Повышен риск слепых зон в финмоделях. Введите режим защиты активов. `;
        } else if (isCoreFriend) {
            finalStatus = "Благоприятно";
            premiumIndicator = "🚀💎";
            dayFinanceWeight = 0.9;
            dayEffWeight = 0.9;
            textPrefix = `💎 СИНЕРГИЯ ДХАНА-ЙОГИ. Гармоничный деловой фон. Маркетинговые гипотезы подтверждаются быстрее, переговоры проходят с минимальным сопротивлением. `;
        } else {
            finalStatus = "Нейтрально";
            premiumIndicator = "📋✨";
            textPrefix = `⚖️ СТАБИЛЬНЫЙ ТРАНЗИТ. Сбалансированное операционное поле без выраженных угроз. Подходит для планового выполнения задач компании. `;
        }

        if ([4, 14, 29].includes(tithiIndex)) {
            finalStatus = "Внимание";
            dayRiskWeight = Math.min(1.0, dayRiskWeight + 0.3);
        }

        financeDaysCount += dayFinanceWeight;
        riskDaysCount += dayRiskWeight;
        highProductivityDays += dayEffWeight;

        let finalFocus = `${textPrefix}\n\n` +
            `💼 Вектор Действия: Развитие через ${planet.keyword} (${planet.biz}).\n\n` +
            `🛑 Слепые Зоны Рисков: ${planet.shadow}\n\n` +
            `🌙 Контекст Титхи: ${tithiText}\n` +
            `📊 Макро-Импульс: ${moonPhaseText}\n\n` +
            `📅 Цикл Декады: ${decade.text}`;

        const formattedDate = `${String(day).padStart(2, '0')}.${String(currentMonthNum).padStart(2, '0')}`;

        rows.push({
            date: formattedDate,
            vibration: `${dayVibration} — ${planet.name}`,
            statusText: finalStatus,
            indicator: premiumIndicator,
            focus: finalFocus
        });
    }

    const totalDays = daysInMonth;
    const riskIndex = Math.max(5, Math.min(100, Math.round((riskDaysCount / totalDays) * 100)));
    const financeIndex = Math.max(5, Math.min(100, Math.round((financeDaysCount / totalDays) * 100)));
    const efficiencyIndex = Math.max(10, Math.min(100, Math.round(50 + ((financeDaysCount * 2.5) - (riskDaysCount * 2)))));

    return {
        core: { moolank, personalYear },
        metrics: { financeIndex, riskIndex, efficiencyIndex },
        rows: rows
    };
}

export function downloadDayReport(dayData, userBirthDate) {
    if (!dayData) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    const cyrillicFont = "AAEAAAASAQAABAAwR0RFRgS/BLoAAAGgAAAAQkdNQVAt4U0FAAACNAAAADZjbWFwB3EHiQAAArwAAAFiY3Z0IAAZAHwAAAToAAAAAmhhcHBlgS7FAAAFIAAAACZnbHlmOCu2mgAABXAAABMwaGVhZBt949QAAAEwAAAANmhoZWEHeAMXAAABWAAAACRobXR4InwAAAAAAYQAAAAgbG9jYRFgEVQAAAVIAAAAEG1heHAAEwBBAAABYAAAACBuYW1lORcl7AAAFmQAAAFbcG9zdP9tAGoAAAGsAAAAIhABAAAAAQAA7mSWhF8PPPUACwQgAAAAAM311fQAAAAAzfXV9AAA/4wEIAQgAAAACAACAAAAAAAAAAEAAAUb/4wALgQgAAAA/wQgAAEAAAAAAAAAAAAAAAAAAAAIAAEAAAAIABUAAgAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAQYAAAGNAAFAAAUAAgXmBZsAAAEmBeYFmwAAA9EAZgIAAAILBgkFAAAgAAv/QAAALwAAAAAAAAAAUG9zdABAbwBvBxsFG/+MAC4EGwPoAAAAAQAAAAAAAQAAAAMAAAAsAAAAAQAAAFYAAAABAAAAAgAAAAEAAwAAAAEAAwAFAAMABwAHAAMACQANAAAAAQAAAAoAHgAsAAJERkxUAA5sYXRuAA4ABAAAAAD__wABAAAAAWtlcm4ADAAAAAEAAAABAAQAAgAAAAEAAQAFAAEABgAFAAIAAgADAAQABQAGAAcACAAIAAkACgALAAwADf/hAAEAAQAAAAEAAAAAAAIAAgADAAQABQAGAAcACAAIAAkACgALAAwADgAOAA8AFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBJwEoASkBKgErASwBLQEuAS8BMAExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4BPwFAAUEBQgFDAUQBRwFGAUgBSQFKAVMBVAFVAVYBVwFYAVkBWgFiAWMBZAFmAWUBZwFoAWkBagFrAWwBbQFuAW8BcAFxAXIBcwF0AXUBdgF3AXgBeQF6AXsBfAF9AX4BfwGAAf8BgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGVAZQBlgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHHAcYByAHJAcoBywHMAc0BzgHPAZABmQGaAZsBnAHAAMUBwQDFAcQAxQHFAMUAAgAZAHwAAAToAAAAAmgAAwABAAMAAwAFAAUABgAHAAgACQAKAAsADAANAA4ADwAQABEAEgATABQAFgAXABgAGQAAAAAAAPUA9QD1APUA9QD1APUA9QD1APUA9QD1APUA9QD1APUA9QD1APUA9QD1APUA9QD1APUA9QD1APUA9QD1AAEAEAALAAUABAAFAAYABwAIAAkACgALAAwADgAOAA8AFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBJwEoASkBKgErASwBLQEuAS8BMAExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4BPwFAAUEBQgFDAUQBRwFGAUgBSQFKAVMBVAFVAVYBVwFYAVkBWgFiAWMBZAFmAWUBZwFoAWkBagFrAWwBbQFuAW8BcAFxAXIBcwF0AXUBdgF3AXgBeQF6AXsBfAF9AX4BfwGAAf8BgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGVAZQBlgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHHAcYByAHJAcoBywHMAc0BzgHPAZABmQGaAZsBnAHAAMUBwQDFAcQAxQHFAMUAAPsAAQAFAAcABgAIAAkACgALAAwADgAOAA8AFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUACwACAAgADgAPAA0AEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBCQEKAAwADQAPAAsADAANAA8AEAARABIAEwAUABUAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBCQEKAAwADQAPAAsAEAARABIAEwAUABUAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBCQEKAAwADQAPAAsAEAARABIAEwAUABUAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBCQEKAAwADQAPAAsAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBCQEKAAwADQAPAAsAHAAdAB4AHwAIAAkACgALAAwADgAOAA8AFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUBCQEKAAwADQAPAAsA";

    doc.addFileToVFS("Roboto-Regular.ttf", cyrillicFont);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");

    const cleanText = (text) => text.replace(/\*\*/g, '').replace(/\*/g, '');

    doc.setFillColor(13, 17, 23);
    doc.rect(0, 0, 210, 35, "F");
    doc.setFont("Roboto", "normal");
    doc.setFontSize(14);
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(9);
    doc.setTextColor(139, 148, 158);
    doc.text("АНАЛИТИЧЕСКИЙ МЕМОРАНДУМ СУТОЧНОЙ АКТИВНОСТИ", 14, 22);

    doc.setLineWidth(0.3);
    doc.setDrawColor(212, 175, 55);
    doc.line(14, 27, 196, 27);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Профиль инвестора (B-Date): ${userBirthDate}`, 14, 45);
    doc.text(`Дата наблюдения: ${dayData.date}`, 14, 51);
    doc.text(`Архитип транзита: ${cleanText(dayData.vibration)}`, 14, 57);

    doc.setFillColor(245, 242, 230);
    doc.rect(14, 63, 182, 11, "F");
    doc.setFontSize(11);
    doc.setTextColor(150, 110, 30);
    doc.text(`СТАТУС СУТОК: ${cleanText(dayData.statusText)} ${dayData.indicator}`, 18, 70);

    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 30);
    const rawFocus = cleanText(dayData.focus);
    const splitText = doc.splitTextToSize(rawFocus, 175);
    let cursorY = 85;
    doc.text(splitText, 14, cursorY);

    const pageHeight = doc.internal.pageSize.height;
    doc.setLineWidth(0.2);
    doc.setDrawColor(220, 220, 220);
    doc.line(14, pageHeight - 20, 196, pageHeight - 20);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);

    doc.save(`Business_Report_${dayData.date}.doc`);
}
