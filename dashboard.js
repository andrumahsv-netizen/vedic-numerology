import { NAVAGRAHA, CORE_DAY_DB, BEHAVIOR_TIPS } from './db.js';
import { calculateMasterProfile, calculateDayChain, analyzeMatrixData } from './engine.js';
import { getAdvancedRelationTip } from './relations.js';
import { generateBusinessCalendar } from './calendar.js';

let sessionState = {
    moolank: null,
    userDayCode: null
};

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e));
    });

    const mainNameInput = document.getElementById('mainName');
    const mainDateInput = document.getElementById('mainDate');
    if (mainNameInput) mainNameInput.addEventListener('input', saveUserProfile);
    if (mainDateInput) mainDateInput.addEventListener('change', saveUserProfile);

    const btnCalcRelations = document.getElementById('btnCalcRelations');
    if (btnCalcRelations) btnCalcRelations.addEventListener('click', runRelationsAnalysis);

    const buildCalBtn = document.getElementById('buildCalendarBtn');
    if (buildCalBtn) {
        buildCalBtn.addEventListener('click', runBusinessCalendarGeneration);
    }

    loadUserProfile();

    const burgerBtn = document.getElementById('burgerBtn');
    const navTabs = document.getElementById('navTabs');
    if (burgerBtn && navTabs) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('open');
            navTabs.classList.toggle('open');
        });
        navTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn') || e.target.classList.contains('menu-btn')) {
                burgerBtn.classList.remove('open');
                navTabs.classList.remove('open');
            }
        });
    }
});

function switchTab(event) {
    const spaceId = event.currentTarget.getAttribute('data-space');
    if (!spaceId) return;
    
    document.querySelectorAll('.app-space').forEach(space => space.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetSpace = document.getElementById(spaceId);
    if (targetSpace) {
        document.querySelectorAll('.app-space').forEach(space => space.style.display = 'none');
        targetSpace.style.display = 'block';
        targetSpace.classList.add('active');
    }
    event.currentTarget.classList.add('active');
}

function loadUserProfile() {
    const name = localStorage.getItem('u_name') || "";
    const date = localStorage.getItem('u_date') || "";
    const nameField = document.getElementById('mainName');
    const dateField = document.getElementById('mainDate');
    
    if (nameField) nameField.value = name;
    if (dateField) dateField.value = date;
    if (date) renderDashboard(name, date);
}

function saveUserProfile() {
    const name = document.getElementById('mainName').value;
    const date = document.getElementById('mainDate').value;
    localStorage.setItem('u_name', name);
    localStorage.setItem('u_date', date);
    if (date) renderDashboard(name, date);
}

function renderDashboard(name, date) {
    const profile = calculateMasterProfile(name, date);
    if (!profile) return;

    sessionState.moolank = profile.soulNum;

    const parts = date.split('-');
    const birthDay = parseInt(parts[2], 10);

    const currentTodayRealDay = new Date().getDate(); 

    const dayData = calculateDayChain(birthDay, currentTodayRealDay);
    sessionState.userDayCode = dayData.finalCode;

    const dashResults = document.getElementById('dashResults');
    if (dashResults) dashResults.style.display = 'block';

    document.getElementById('welcomeName').innerText = name ? `Пользователь, ${name}` : "Приветствуем, Искатель";
    document.getElementById('userAvatar').innerText = name ? name.charAt(0).toUpperCase() : "Н";
    document.getElementById('globalDayCode').innerText = dayData.finalCode;
    
    document.getElementById('cardM').innerText = profile.soulNum;
    document.getElementById('subM').innerText = NAVAGRAHA[profile.soulNum]?.planet || "";
    document.getElementById('cardB').innerText = profile.destinyNum;
    document.getElementById('subB').innerText = NAVAGRAHA[profile.destinyNum]?.planet || "";
    document.getElementById('cardN').innerText = profile.nameNum;
    document.getElementById('cardS').innerText = profile.vowelsNum;
    document.getElementById('cardP').innerText = profile.consonantsNum;
    document.getElementById('cardY').innerText = profile.personalYear;
    document.getElementById('subY').innerText = NAVAGRAHA[profile.personalYear]?.planet || "";

    document.querySelectorAll('#matrixGrid .cell').forEach(cell => {
        let n = cell.dataset.n;
        let count = profile.rawDigits.filter(x => String(x) === String(n)).length;
        const digitsDiv = cell.querySelector('.digits');
        if (digitsDiv) {
            if (count > 0) {
                digitsDiv.innerText = String(n).repeat(count);
                cell.classList.add('active');
            } else {
                digitsDiv.innerText = "";
                cell.classList.remove('active');
            }
        }
    });

    const matrixAnalysis = analyzeMatrixData(profile.rawDigits);
    let matrixHtml = `<h2>🧩 Анализ Матрицы</h2>`;
    
    if (matrixAnalysis.arrows && matrixAnalysis.arrows.length > 0) {
        matrixHtml += `<div style="margin-bottom: 20px; padding: 15px; background: rgba(223,177,91,0.08); border-radius: 8px; border: 1px dashed var(--gold);">`;
        matrixHtml += `<h4 style="color: var(--gold); margin-bottom: 8px;">🚀 Обнаружены Стрелы Силы (Конфигурации характера):</h4>`;
        matrixAnalysis.arrows.forEach(arrow => {
            matrixHtml += `<p style="font-size:0.95rem; margin-bottom:6px; line-height:1.4;">${arrow}</p>`;
        });
        matrixHtml += `</div>`;
    }

    matrixHtml += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">`;
    matrixAnalysis.cells.forEach(cell => {
        const isCellActive = cell.count > 0;
        matrixHtml += `
            <div style="background: #0d1117; padding: 15px; border-radius: 10px; border: 1px solid ${isCellActive ? 'rgba(223,177,91,0.2)' : 'var(--card-border)'}; border-left: 4px solid ${isCellActive ? 'var(--gold)' : 'var(--text-muted)'};">
                <strong style="color: ${isCellActive ? 'var(--gold)' : 'var(--text-muted)'}; font-size:0.95rem;">${cell.title}</strong>
                <span style="float: right; font-size: 0.75rem; background: ${isCellActive ? 'var(--gold-glow)' : '#21262d'}; color: ${isCellActive ? 'var(--gold)' : 'var(--text-muted)'}; padding: 2px 6px; border-radius: 4px;">Кол-во: ${cell.count}</span>
                <p style="margin-top: 8px; font-size: 0.85rem; line-height: 1.4; color: ${isCellActive ? 'var(--text-main)' : 'var(--text-muted)'}; font-weight: 300;">${cell.text}</p>
            </div>
        `;
    });
    matrixHtml += `</div>`;

    const matrixTextBlock = document.getElementById('matrixTextAnalysisBlock');
    if (matrixTextBlock) matrixTextBlock.innerHTML = matrixHtml;

    let reducedSoul = birthDay % 9 || 9;
    let displaySoul = birthDay > 9 ? `${birthDay} (сокращено до ${reducedSoul})` : birthDay;
    
    let chainHtml = `
        <h2>🔮 Энергии Суток: ${dayData.chain.join(' → ')}</h2>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:15px;">
            Формула: Число Души ${displaySoul} + День сетки (${dayData.currentCalDay}) = ${dayData.sum}
        </p>
    `;
    
    dayData.chain.forEach((code, idx) => {
        let title = idx === 0 ? "Входная вибрация" : (idx === dayData.chain.length - 1 ? "Итоговый Вектор Дня" : "Промежуточный Transit");
        let desc = CORE_DAY_DB[code] || `Проявление планетарного кода ${code}.`;
        chainHtml += `
            <div class="step-box" style="background: var(--card); border: 1px solid var(--card-border); padding: 12px; border-radius: 6px; margin-bottom: 10px;">
                <strong>${title} (Код ${code}):</strong>
                <p style="margin-top:4px; font-weight:300; font-size: 0.9rem; color: var(--text-main);">${desc}</p>
            </div>
        `;
    });
    
    const dayChainBlock = document.getElementById('dayChainBlock');
    if (dayChainBlock) dayChainBlock.innerHTML = chainHtml;
}

function runRelationsAnalysis() {
    const relDateInput = document.getElementById('relDate').value;
    const role = document.getElementById('relRole').value;

    if (!sessionState.moolank) {
        return alert("Сначала настройте вашу дату рождения на Главном Дашборде!");
    }
    if (!relDateInput) {
        return alert("Пожалуйста, укажите дату рождения близкого человека!");
    }

    const todayNum = new Date().getDate();
    const relData = getAdvancedRelationTip(relDateInput, sessionState.moolank, role, todayNum);

    if (!relData) {
        return alert("Не удалось рассчитать данные. Проверьте корректность введённой даты.");
    }

    const roleTitles = {
        child: "Ребёнок",
        friend: "Друг",
        partner: "Партнёр (Отношения)",
        colleague: "Коллега / Подчинённый"
    };

    let resonanceType = "Нейтральный энергетический фон";
    let resonanceColor = "var(--gold)";
    
    if (relData.targetDayCode === sessionState.userDayCode) {
        resonanceType = "Одинаковые энергии суток";
        resonanceColor = "#3fb950";
    } else if (Math.abs(relData.targetDayCode - sessionState.userDayCode) === 1) {
        resonanceType = "Энергии достраивают друг друга";
        resonanceColor = "#f0883e";
    }

    const outBlock = document.getElementById('relOutputBlock');
    if (outBlock) {
        outBlock.style.display = 'block';
        outBlock.innerHTML = `
            <h2>Навигатор Отношений</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
                <div style="background: #0d1117; padding: 14px; border-radius: 8px; border: 1px solid var(--card-border);">
                    <span style="font-size:0.8rem; color: var(--text-muted); text-transform: uppercase;">Число Души близкого:</span>
                    <div style="font-size:1.6rem; font-weight:700; color: var(--love); margin-top:4px;">${relData.targetSoulNum}</div>
                </div>
                <div style="background: #0d1117; padding: 14px; border-radius: 8px; border: 1px solid var(--card-border);">
                    <span style="font-size:0.8rem; color: var(--text-muted); text-transform: uppercase;">Его энергия дня сегодня:</span>
                    <div style="font-size:1.6rem; font-weight:700; color: var(--gold); margin-top:4px;">${relData.targetDayCode}</div>
                </div>
                <div style="background: #0d1117; padding: 14px; border-radius: 8px; border: 1px solid var(--card-border);">
                    <span style="font-size:0.8rem; color: var(--text-muted); text-transform: uppercase;">Ваш Вектор Энергии Дня:</span>
                    <div style="font-size:1.6rem; font-weight:700; color: var(--day-energy); margin-top:4px;">${sessionState.userDayCode}</div>
                </div>
            </div>
            
            <div style="margin-bottom: 25px; padding: 18px; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid var(--card-border);">
                <span style="font-size:0.85rem; color: var(--text-muted);">Текущее пересечение:</span>
                <div style="font-size:1.1rem; font-weight:600; color: ${resonanceColor}; margin-top:5px;">
                    ${resonanceType}
                </div>
            </div>
            
            <div style="background: #0d1117; padding: 25px; border-radius: 12px; border-left: 5px solid var(--love); box-shadow: inset 0 0 15px rgba(0,0,0,0.3);">
                <h4 class="tactic-card-title" style="color:white;">Тактическая стратегия [Роль: ${roleTitles[role]}]:</h4>
                <p class="tactic-card-text" style="margin-top:10px; line-height:1.5; color: #c9d1d9; font-weight: 300;">${relData.tip}</p>
            </div>
        `;
        outBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function runBusinessCalendarGeneration() {
    const birthDateStr = document.getElementById('mainDate').value;
    if (!birthDateStr) {
        alert("Пожалуйста, сначала заполните вашу дату рождения на Главном Дашборде!");
        return;
    }
    
    const monthSelect = document.getElementById('calMonth');
    const yearInput = document.getElementById('calYear');
    if (!monthSelect || !yearInput) return;

    const targetMonth = parseInt(monthSelect.value);
    const targetYear = parseInt(yearInput.value) || 2026;
    
    const calendarData = generateBusinessCalendar(birthDateStr, targetMonth, targetYear);
    if (!calendarData) return;

    const metaBlock = document.getElementById('calendarMeta');
    const moolankEl = document.getElementById('calUserMoolank');
    const pYearEl = document.getElementById('calUserPersonalYear');
    
    if (metaBlock && moolankEl && pYearEl) {
        metaBlock.style.display = 'flex';
        moolankEl.innerText = calendarData.core.moolank;
        pYearEl.innerText = calendarData.core.personalYear;
        
        document.getElementById('idxFinance').innerText = `${calendarData.metrics.financeIndex}%`;
        document.getElementById('barFinance').style.width = `${calendarData.metrics.financeIndex}%`;
        document.getElementById('idxRisk').innerText = `${calendarData.metrics.riskIndex}%`;
        document.getElementById('barRisk').style.width = `${calendarData.metrics.riskIndex}%`;
        document.getElementById('idxEff').innerText = `${calendarData.metrics.efficiencyIndex}%`;
        document.getElementById('barEff').style.width = `${calendarData.metrics.efficiencyIndex}%`;
    }

    const gridBlock = document.getElementById('calendarGridBlock');
    const mobileBlock = document.getElementById('calendarMobileBlock');
    if (!gridBlock) return;
    
    gridBlock.innerHTML = '';
    if (mobileBlock) mobileBlock.innerHTML = '';

    calendarData.rows.forEach(row => {
        const statusClass = row.statusText.toLowerCase();

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="biz-date-cell">${row.date}</td>
            <td style="font-size: 1.1rem; text-align: center; cursor: default;">${row.indicator}</td>
            <td style="font-weight: 500;">${row.vibration}</td>
            <td><span class="status-badge ${statusClass}">${row.statusText}</span></td>
            <td>
                <div style="font-size: 0.78rem; color: #8b949e; font-weight: bold; margin-bottom: 4px; opacity: 0.9;">${row.lunarInfo}</div>
                <div style="color: #c9d1d9; font-weight: 300; line-height: 1.45; font-size: 0.88rem; white-space: pre-wrap;">${row.focus}</div>
            </td>
            <td style="text-align: center; vertical-align: middle;">
                <button class="btn-premium-download pc-download-btn">📥 DOC</button>
            </td>
        `;
        const pcBtn = tr.querySelector('.pc-download-btn');
        if (pcBtn) pcBtn.addEventListener('click', () => triggerDownload(row, birthDateStr));
        gridBlock.appendChild(tr);

        if (mobileBlock) {
            const card = document.createElement('div');
            card.className = `mobile-biz-card border-${statusClass}`;
            card.innerHTML = `
                <div class="card-mobile-header">
                    <span class="m-date">${row.date}</span>
                    <span class="m-indicator" title="Биоритм">${row.indicator}</span>
                    <span class="status-badge ${statusClass}">${row.statusText}</span>
                </div>
                <div class="card-mobile-vibration">
                    <strong>Транзит:</strong> ${row.vibration}
                </div>
                <div class="card-mobile-lunar">${row.lunarInfo}</div>
                <div class="card-mobile-focus">${row.focus}</div>
                <div class="card-mobile-actions">
                    <button class="btn-premium-download mobile-download-btn">Скачать отчет (.doc)</button>
                </div>
            `;
            const mobileBtn = card.querySelector('.mobile-download-btn');
            if (mobileBtn) mobileBtn.addEventListener('click', () => triggerDownload(row, birthDateStr));
            mobileBlock.appendChild(card);
        }
    });

    const wrapper = document.getElementById('calendarWrapper');
    if (wrapper) {
        wrapper.style.display = 'block';
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Логика скачивания отчета
function triggerDownload(row, birthDateStr) {
    try {
        const clean = (t) => t.replace(/\*\*/g, '').replace(/\*/g, '');
        const reportTitle = "===================================================\n" +
                             "       PREMIUM BUSINESS INTELLIGENCE REPORT        \n" +
                             "===================================================\n";
        const metaInfo = `Профиль инвестора (B-Date): ${birthDateStr}\n` +
                         `Дата наблюдения: ${row.date}\n` +
                         `Архитип транзита: ${clean(row.vibration)}\n` +
                         `СТАТУС СУТОК: ${clean(row.statusText)} ${row.indicator}\n` +
                         "---------------------------------------------------\n\n";
        const mainContent = `АНАЛИТИЧЕСКИЙ МЕМОРАНДУМ:\n${clean(row.focus)}\n\n` +
                            "---------------------------------------------------\n" +
                            "Сгенерировано автоматической системой бизнес-моделирования.\n" +
                            "Конфиденциально. Для личного стратегического планирования.";
        
        const fullText = reportTitle + metaInfo + mainContent;
        const blob = new Blob([fullText], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Business_Report_${row.date}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        alert("Ошибка экспорта: " + err.message);
    }
}
