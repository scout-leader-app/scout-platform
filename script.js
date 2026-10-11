const SUPER_ADMIN_CODE = "ADMIN123";
const STAGE_CODES = {
    "PRIMARY123": "ابتدائي",
    "PREP123": "إعدادي",
    "SEC123": "ثانوي",
    "UNI123": "جامعي"
};

let currentActiveStage = "";
let isSuperAdmin = false;
let loggedInScout = null;

const defaultScouts = [
    { name: "أحمد علي محمد", phone: "01012345678", confessor: "أبونا بولس", code: "S101", stage: "ابتدائي", points: 150 },
    { name: "مينا يوسف ميخائيل", phone: "01123456789", confessor: "أبونا أنطونيوس", code: "S102", stage: "إعدادي", points: 200 },
    { name: "عمر خالد محمود", phone: "01234567890", confessor: "أبونا يوحنا", code: "S103", stage: "ثانوي", points: 120 },
    { name: "يوسف حسن مصطفى", phone: "01555555555", confessor: "أبونا بيشوي", code: "S104", stage: "جامعي", points: 180 }
];

let scoutsData = JSON.parse(localStorage.getItem('scoutsData')) || defaultScouts;
let quizzesData = JSON.parse(localStorage.getItem('quizzesData')) || [];

function saveData() {
    localStorage.setItem('scoutsData', JSON.stringify(scoutsData));
    localStorage.setItem('quizzesData', JSON.stringify(quizzesData));
}

function login() {
    let inputName = document.getElementById('scoutName').value.trim();
    let inputStage = document.getElementById('scoutStage').value;
    let inputCode = document.getElementById('scoutCode').value.trim().toUpperCase();
    let errorMsg = document.getElementById('errorMsg');

    if (inputCode === "") {
        errorMsg.innerHTML = "⚠️ يرجى كتابة الكود!";
        return;
    }

    if (inputCode === SUPER_ADMIN_CODE) {
        isSuperAdmin = true;
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('adminMainPanel').style.display = 'block';
        document.getElementById('topLogoutBtn').style.display = 'block';
        errorMsg.innerHTML = "";
        return;
    }

    if (STAGE_CODES[inputCode]) {
        isSuperAdmin = false;
        let targetStage = STAGE_CODES[inputCode];
        document.getElementById('loginBox').style.display = 'none';
        openStageControl(targetStage);
        document.getElementById('topLogoutBtn').style.display = 'block';
        errorMsg.innerHTML = "";
        return;
    }

    if (inputName === "" || inputStage === "") {
        errorMsg.innerHTML = "⚠️ يرجى إدخال الاسم الثلاثي واختيار المرحلة!";
        return;
    }

    let foundScout = scoutsData.find(scout => 
        scout.name === inputName && 
        scout.stage === inputStage && 
        scout.code === inputCode
    );

    if (foundScout) {
        loggedInScout = foundScout;
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('displayName').innerText = foundScout.name;
        document.getElementById('displayStage').innerText = foundScout.stage;
        document.getElementById('displayPoints').innerText = foundScout.points;
        document.getElementById('profileDashboard').style.display = 'block';
        document.getElementById('topLogoutBtn').style.display = 'block';
        backToScoutMenu();
        errorMsg.innerHTML = "";
    } else {
        errorMsg.innerHTML = "❌ البيانات غير صحيحة!";
    }
}

function showScoutSection(section) {
    document.getElementById('scoutMainMenu').style.display = 'none';
    document.getElementById('topLogoutBtn').style.display = 'none';

    if (section === 'points') {
        document.getElementById('scoutPointsSection').style.display = 'block';
        document.getElementById('scoutQuizzesSection').style.display = 'none';
    } else if (section === 'quizzes') {
        document.getElementById('scoutPointsSection').style.display = 'none';
        document.getElementById('scoutQuizzesSection').style.display = 'block';
        renderScoutQuizzes();
    }
}

function backToScoutMenu() {
    document.getElementById('scoutMainMenu').style.display = 'flex';
    document.getElementById('scoutPointsSection').style.display = 'none';
    document.getElementById('scoutQuizzesSection').style.display = 'none';
    document.getElementById('topLogoutBtn').style.display = 'block';
}

function renderScoutQuizzes() {
    const list = document.getElementById('quizzesList');
    if (!list) return;
    list.innerHTML = "";

    let availableQuizzes = quizzesData.filter(quiz => quiz && (quiz.stage === "الكل" || quiz.stage === loggedInScout.stage));

    if (availableQuizzes.length === 0) {
        list.innerHTML = "<p style='text-align:center;'>لا توجد مسابقات متاحة حالياً.</p>";
        return;
    }

    if (!loggedInScout.solvedQuizzes) {
        loggedInScout.solvedQuizzes = [];
    }

    availableQuizzes.forEach((quiz, displayIndex) => {
        if (!quiz.id) {
            quiz.id = 'legacy_quiz_' + displayIndex;
        }

        let isSolved = loggedInScout.solvedQuizzes.includes(quiz.id);
        let div = document.createElement('div');
        div.style.cssText = "background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-right: 4px solid #0288d1;";

        let questionsHtml = "";
        if (quiz.questions && Array.isArray(quiz.questions)) {
            quiz.questions.forEach((subItem, subIndex) => {
                let fieldHtml = "";
                if (subItem.type === 'mcq' && subItem.options) {
                    let opts = subItem.options.split(',');
                    fieldHtml = `<div style="margin: 5px 0; display: flex; flex-direction: column; gap: 5px;">`;
                    opts.forEach((opt) => {
                        let cleanOpt = opt.trim();
                        let radioName = `ans_${quiz.id}_${subIndex}`;
                        fieldHtml += `
                            <label style="font-weight: normal; cursor: pointer;">
                                <input type="radio" name="${radioName}" value="${cleanOpt}" ${isSolved ? 'disabled' : ''}> ${cleanOpt}
                            </label>
                        `;
                    });
                    fieldHtml += `</div>`;
                } else {
                    let inputId = `ans_${quiz.id}_${subIndex}`;
                    fieldHtml = `<input type="text" id="${inputId}" class="input-field" placeholder="اكتب إجابتك المقالية هنا..." style="width: 80%;" ${isSolved ? 'disabled' : ''}>`;
                }

                questionsHtml += `
                    <div style="margin-bottom: 15px; border-bottom: 1px dashed #eee; padding-bottom: 10px;">
                        <p><b>س ${subIndex + 1}:</b> ${subItem.text || ''}</p>
                        ${fieldHtml}
                    </div>
                `;
            });
        }

        let buttonHtml = isSolved 
            ? `<p style="color: green; font-weight: bold; text-align: center;">✅ تم تسليم هذه المسابقة مسبقاً ولا يمكن تعديل الإجابات.</p>`
            : `<button onclick="confirmAndSubmitQuiz('${quiz.id}')" class="btn-primary" style="margin-top: 10px;">تسليم الإجابات نهائياً</button>`;

        div.innerHTML = `
            <h4 style="color: #0288d1; margin-top: 0;">مسابقة رقم (${displayIndex + 1})</h4>
            ${questionsHtml}
            ${buttonHtml}
        `;
        list.appendChild(div);
    });
}

let pendingQuizId = null;

function playAlarmSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let playTone = (freq, startTime, duration) => {
            let osc = audioCtx.createOscillator();
            let gain = audioCtx.createGain();
            
            osc.type = 'square';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime + startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(audioCtx.currentTime + startTime);
            osc.stop(audioCtx.currentTime + startTime + duration);
        };

        playTone(440, 0, 0.15);
        playTone(880, 0.2, 0.25);
    } catch (e) {
        console.log("AudioContext not supported or blocked.");
    }
}

function confirmAndSubmitQuiz(quizId) {
    pendingQuizId = quizId;
    playAlarmSound();
    document.getElementById('quizConfirmModal').style.display = 'flex';
    
    document.getElementById('confirmYesBtn').onclick = function() {
        closeQuizConfirmModal();
        submitQuizAnswers(pendingQuizId);
    };
}

function closeQuizConfirmModal() {
    document.getElementById('quizConfirmModal').style.display = 'none';
    pendingQuizId = null;
}

function submitQuizAnswers(quizId) {
    let quiz = quizzesData.find(q => q.id === quizId);
    
    if (!quiz) {
        renderScoutQuizzes();
        return;
    }

    let allCorrect = true;

    if (quiz.questions && Array.isArray(quiz.questions)) {
        quiz.questions.forEach((item, subIndex) => {
            let userAns = "";
            if (item.type === 'mcq') {
                let selectedRadio = document.querySelector(`input[name="ans_${quiz.id}_${subIndex}"]:checked`);
                if (selectedRadio) {
                    userAns = selectedRadio.value.trim();
                }
            } else {
                let inputField = document.getElementById(`ans_${quiz.id}_${subIndex}`);
                if (inputField) {
                    userAns = inputField.value.trim();
                }
            }

            let correctAns = item.answer ? item.answer.trim() : "";
            if (userAns.toLowerCase() !== correctAns.toLowerCase()) {
                allCorrect = false;
            }
        });
    }

    if (!loggedInScout.solvedQuizzes) {
        loggedInScout.solvedQuizzes = [];
    }
    
    if (!loggedInScout.solvedQuizzes.includes(quiz.id)) {
        loggedInScout.solvedQuizzes.push(quiz.id);
    }

    if (allCorrect) {
        loggedInScout.points += 20; 
        alert("🎉 إجابات صحيحة تماماً! تمت إضافة 20 نقطة إلى رصيدك.");
    } else {
        alert("❌ انتهت محاولتك. بعض الإجابات غير صحيحة!");
    }

    let mainIndex = scoutsData.findIndex(s => s.code === loggedInScout.code);
    if (mainIndex !== -1) {
        scoutsData[mainIndex] = loggedInScout;
    }

    saveData();
    document.getElementById('displayPoints').innerText = loggedInScout.points;
    renderScoutQuizzes();
}

function openStageControl(stageName) {
    currentActiveStage = stageName;
    document.getElementById('adminMainPanel').style.display = 'none';
    document.getElementById('stageControlBox').style.display = 'block';
    document.getElementById('stageTitle').innerText = "لوحة تحكم قطاع: " + stageName;
    
    hideAllAdminSections();
    document.getElementById('leaderboardSection').style.display = 'none';

    let backBtn = document.getElementById('backBtn');
    let topLogoutBtn = document.getElementById('topLogoutBtn');

    if (isSuperAdmin) {
        backBtn.style.display = 'inline-block';
        if (topLogoutBtn) topLogoutBtn.style.display = 'block';
    } else {
        backBtn.style.display = 'none';
        if (topLogoutBtn) topLogoutBtn.style.display = 'block';
    }

    populateScoutSelectByStage(stageName);
    renderMembersList(stageName);
}

function showAdminSection(secName) {
    const stageControlBox = document.getElementById('stageControlBox');
    if (!stageControlBox) return;

    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'none';

    const footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'none';

    const leaderboard = document.getElementById('leaderboardSection');
    if (leaderboard) leaderboard.style.display = 'none';

    const topLogout = document.getElementById('topLogoutBtn');
    if (topLogout) topLogout.style.display = 'block';

    ['addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    if (secName === 'membersList') {
        stageControlBox.classList.add('large-box');
        renderMembersList(currentActiveStage);
        let memSec = document.getElementById('membersListSec');
        if (memSec) memSec.style.display = 'block';
    } else {
        stageControlBox.classList.remove('large-box');
        if (secName === 'addMember') {
            let el = document.getElementById('addMemberSec');
            if (el) el.style.display = 'block';
        }
        if (secName === 'addPoints') {
            let el = document.getElementById('addPointsSec');
            if (el) el.style.display = 'block';
        }
    }
}

function hideAllAdminSections() {
    const stageControlBox = document.getElementById('stageControlBox');
    if (stageControlBox) {
        stageControlBox.classList.remove('large-box');
    }

    ['addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    let mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'flex';

    let footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'block';

    let leaderboard = document.getElementById('leaderboardSection');
    if (leaderboard) leaderboard.style.display = 'none';

    let topLogout = document.getElementById('topLogoutBtn');
    if (topLogout) topLogout.style.display = 'block';
}

function toggleLeaderboard() {
    const leaderboardSection = document.getElementById('leaderboardSection');
    if (leaderboardSection.style.display === 'none') {
        showStageLeaderboard();
    } else {
        hideLeaderboard();
    }
}

function showStageLeaderboard() {
    const leaderboardSection = document.getElementById('leaderboardSection');
    const tbody = document.getElementById('leaderboardBody');
    
    document.getElementById('stageMainButtons').style.display = 'none';
    document.getElementById('stageFooterButtons').style.display = 'none';

    tbody.innerHTML = "";

    let stageScouts = scoutsData.filter(s => s.stage === currentActiveStage);
    let sortedScouts = [...stageScouts].sort((a, b) => b.points - a.points);

    if (sortedScouts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">لا يوجد كشافة في هذا القطاع حالياً</td></tr>`;
    } else {
        sortedScouts.forEach((scout, index) => {
            let row = `<tr>
                <td><b>${index + 1}</b></td>
                <td>${scout.name}</td>
                <td>⭐ ${scout.points}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
    leaderboardSection.style.display = 'block';
}

function hideLeaderboard() {
    document.getElementById('leaderboardSection').style.display = 'none';
    document.getElementById('stageMainButtons').style.display = 'flex';
    document.getElementById('stageFooterButtons').style.display = 'block';
}

function addNewScout() {
    let name = document.getElementById('newScoutName').value.trim();
    let phone = document.getElementById('newScoutPhone').value.trim();
    let confessor = document.getElementById('newScoutConfessor').value.trim();
    let code = document.getElementById('newScoutCode').value.trim().toUpperCase();

    if (name === "" || phone === "" || confessor === "" || code === "") {
        alert("⚠️ يرجى إدخال جميع البيانات (الاسم، الهاتف، أب الاعتراف، والكود)!");
        return;
    }

    let exists = scoutsData.some(s => s.code === code);
    if (exists) {
        alert("⚠️ هذا الكود مستخدم بالفعل!");
        return;
    }

    scoutsData.push({ 
        name: name, 
        phone: phone, 
        confessor: confessor, 
        code: code, 
        stage: currentActiveStage, 
        points: 0 
    });
    
    saveData();
    alert(`✅ تم إضافة الكشاف "${name}" بنجاح!`);
    
    document.getElementById('newScoutName').value = "";
    document.getElementById('newScoutPhone').value = "";
    document.getElementById('newScoutConfessor').value = "";
    document.getElementById('newScoutCode').value = "";
    
    populateScoutSelectByStage(currentActiveStage);
    renderMembersList(currentActiveStage);
}

function deleteScout(indexInMainArray) {
    let scout = scoutsData[indexInMainArray];
    if (confirm(`هل أنت متأكد من حذف الكشاف "${scout.name}"؟`)) {
        scoutsData.splice(indexInMainArray, 1);
        saveData();
        populateScoutSelectByStage(currentActiveStage);
        renderMembersList(currentActiveStage);
        alert("🗑️ تم الحذف بنجاح!");
    }
}

function renderMembersList(stageName) {
    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    let count = 0;
    scoutsData.forEach((scout, index) => {
        if (scout.stage === stageName) {
            count++;
            let row = `<tr>
                <td><b>${count}</b></td>
                <td>${scout.name}</td>
                <td>${scout.phone || 'غير مسجل'}</td>
                <td>${scout.confessor || 'غير مسجل'}</td>
                <td><code>${scout.code}</code></td>
            </tr>`;
            tbody.innerHTML += row;
        }
    });

    if (count === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center;">لا يوجد أعضاء مسجلين في هذا القطاع حالياً.</td></tr>`;
    }
}

function populateScoutSelectByStage(stageName) {
    const select = document.getElementById('scoutSelect');
    if (!select) return;
    select.innerHTML = "";

    let stageScouts = scoutsData.filter(s => s.stage === stageName);

    if (stageScouts.length === 0) {
        select.innerHTML = "<option>لا يوجد كشافة في هذا القطاع</option>";
        return;
    }

    scoutsData.forEach((scout, index) => {
        if (scout.stage === stageName) {
            let option = document.createElement('option');
            option.value = index;
            option.text = `${scout.name} (${scout.code})`;
            select.appendChild(option);
        }
    });
}

function modifyPoints(type) {
    let selectedIndex = document.getElementById('scoutSelect').value;
    let pointsInput = parseInt(document.getElementById('addPointsInput').value);

    if (selectedIndex === "" || isNaN(selectedIndex)) {
        alert("لا يوجد كشاف محدد!");
        return;
    }

    if (isNaN(pointsInput) || pointsInput <= 0) {
        alert("يرجى إدخال عدد نقاط صحيح!");
        return;
    }

    if (type === 'add') {
        scoutsData[selectedIndex].points += pointsInput;
        alert(`تمت إضافة ${pointsInput} نقطة إلى ${scoutsData[selectedIndex].name} بنجاح!`);
    } else if (type === 'deduct') {
        scoutsData[selectedIndex].points -= pointsInput;
        if (scoutsData[selectedIndex].points < 0) scoutsData[selectedIndex].points = 0;
        alert(`تم خصم ${pointsInput} نقطة من ${scoutsData[selectedIndex].name} بنجاح!`);
    }

    saveData();
    document.getElementById('addPointsInput').value = "";
}

function backToAdminMain() {
    document.getElementById('stageControlBox').style.display = 'none';
    document.getElementById('adminMainPanel').style.display = 'block';
    
    let topLogoutBtn = document.getElementById('topLogoutBtn');
    if (topLogoutBtn) topLogoutBtn.style.display = 'block';
}

function showLogoutModal() {
    document.getElementById('logoutModal').style.display = 'flex';
}

function closeLogoutModal() {
    document.getElementById('logoutModal').style.display = 'none';
}

function confirmLogout() {
    closeLogoutModal();
    loggedInScout = null;
    isSuperAdmin = false;
    document.getElementById('profileDashboard').style.display = 'none';
    document.getElementById('adminMainPanel').style.display = 'none';
    document.getElementById('stageControlBox').style.display = 'none';
    document.getElementById('topLogoutBtn').style.display = 'none';
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('scoutName').value = "";
    document.getElementById('scoutStage').value = "";
    document.getElementById('scoutCode').value = "";
}

function openAddQuizSection() {
    const stageControlBox = document.getElementById('stageControlBox');
    if (stageControlBox) {
        stageControlBox.classList.remove('large-box');
    }
    
    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'none';

    const footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'none';

    const leaderboard = document.getElementById('leaderboardSection');
    if (leaderboard) leaderboard.style.display = 'none';

    const topLogout = document.getElementById('topLogoutBtn');
    if (topLogout) topLogout.style.display = 'block';

    ['addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    let addQuizSec = document.getElementById('addQuizSec');
    if (addQuizSec) {
        addQuizSec.style.display = 'block';
    }

    let container = document.getElementById('questionsContainer');
    if (container) {
        container.innerHTML = "";
        addQuestionField();
    }

    renderAdminExistingQuizzes();
}

function renderAdminExistingQuizzes() {
    let listContainer = document.getElementById('adminExistingQuizzesList');
    if (!listContainer) return;

    let stageQuizzes = quizzesData.map((q, idx) => ({ q, idx })).filter(item => item.q.stage === currentActiveStage || item.q.stage === "الكل");

    if (stageQuizzes.length === 0) {
        listContainer.innerHTML = `<p style="text-align: center; color: #666;">لا توجد مسابقات منشورة حالياً في هذا القطاع.</p>`;
        return;
    }

    let html = "";
    stageQuizzes.forEach(item => {
        let firstQText = item.q.questions && item.q.questions.length > 0 ? item.q.questions[0].text : "مسابقة عامة";
        html += `
            <div style="background: white; padding: 10px; margin-bottom: 8px; border-radius: 6px; border: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px;"><b>مسابقة (${item.idx + 1}):</b> ${firstQText.substring(0, 35)}...</span>
                <button onclick="deleteQuizAndRefresh(${item.idx})" class="btn-primary btn-danger" style="padding: 4px 10px; font-size: 12px;">حذف ❌</button>
            </div>
        `;
    });
    listContainer.innerHTML = html;
}

function deleteQuiz(qIndex) {
    let confirmDelete = confirm(`⚠️ هل أنت متأكد من رغبتك في حذف هذه المسابقة نهائياً؟`);
    
    if (confirmDelete) {
        quizzesData.splice(qIndex, 1);

        scoutsData.forEach(scout => {
            if (scout.solvedQuizzes && Array.isArray(scout.solvedQuizzes)) {
                scout.solvedQuizzes = scout.solvedQuizzes
                    .filter(solvedIdx => solvedIdx !== qIndex)
                    .map(solvedIdx => solvedIdx > qIndex ? solvedIdx - 1 : solvedIdx);
            }
        });

        if (loggedInScout) {
            let updatedCurrentScout = scoutsData.find(s => s.code === loggedInScout.code);
            if (updatedCurrentScout) {
                loggedInScout = updatedCurrentScout;
            }
        }

        saveData();
        alert("🗑️ تم حذف المسابقة بنجاح وتم تحديث سجلات الكشافة!");
        
        if (typeof renderAdminExistingQuizzes === 'function') {
            renderAdminExistingQuizzes();
        }
    }
}

function deleteQuizAndRefresh(qIndex) {
    deleteQuiz(qIndex);
    renderAdminExistingQuizzes();
}

function addQuestionField() {
    let container = document.getElementById('questionsContainer');
    if (!container) return;
    let qIndex = container.children.length + 1;

    let div = document.createElement('div');
    div.className = "question-block";
    div.style.cssText = "background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ddd;";
    
    div.innerHTML = `
        <label><b>السؤال رقم ${qIndex}:</b></label><br>
        <input type="text" class="input-field q-text" placeholder="اكتب نص السؤال هنا..."><br>
        
        <label>نوع السؤال:</label>
        <select class="input-field q-type" onchange="toggleQuestionType(this)">
            <option value="mcq">اختيار من متعدد (4 خيارات)</option>
            <option value="essay">مقالي (إجابة نصية حرة)</option>
        </select><br>

        <div class="mcq-options-container">
            <label>الخيارات الأربعة:</label><br>
            <input type="text" class="input-field q-opt-1" placeholder="الخيار الأول"><br>
            <input type="text" class="input-field q-opt-2" placeholder="الخيار الثاني"><br>
            <input type="text" class="input-field q-opt-3" placeholder="الخيار الثالث"><br>
            <input type="text" class="input-field q-opt-4" placeholder="الخيار الرابع"><br>
        </div>

        <label>الإجابة الصحيحة (اكتبها كما هي مطابقة لأحد الخيارات أو الإجابة المقالية):</label>
        <input type="text" class="input-field q-answer" placeholder="الإجابة الصحيحة...">
    `;
    container.appendChild(div);
}

function toggleQuestionType(selectElem) {
    let parent = selectElem.parentElement;
    let optionsContainer = parent.querySelector('.mcq-options-container');
    if (selectElem.value === 'essay') {
        optionsContainer.style.display = 'none';
    } else {
        optionsContainer.style.display = 'block';
    }
}

function saveStageQuiz() {
    let questionBlocks = document.querySelectorAll('.question-block');
    let questionsList = [];

    if (questionBlocks.length === 0) {
        alert("⚠️ يرجى إضافة سؤال واحد على الأقل!");
        return;
    }

    for (let block of questionBlocks) {
        let text = block.querySelector('.q-text').value.trim();
        let type = block.querySelector('.q-type').value;
        let answer = block.querySelector('.q-answer').value.trim();
        
        let options = "";
        if (type === 'mcq') {
            let opt1 = block.querySelector('.q-opt-1').value.trim();
            let opt2 = block.querySelector('.q-opt-2').value.trim();
            let opt3 = block.querySelector('.q-opt-3').value.trim();
            let opt4 = block.querySelector('.q-opt-4').value.trim();

            if (opt1 === "" || opt2 === "" || opt3 === "" || opt4 === "") {
                alert("⚠️ يرجى ملء الخيارات الأربعة كاملة للسؤال الاختياري!");
                return;
            }
            options = `${opt1}, ${opt2}, ${opt3}, ${opt4}`;
        }

        if (text === "" || answer === "") {
            alert("⚠️ يرجى التأكد من كتابة نص السؤال والإجابة الصحيحة!");
            return;
        }

        questionsList.push({ text, type, options, answer });
    }

    quizzesData.push({
        id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        stage: currentActiveStage,
        questions: questionsList
    });

    saveData();
    alert("✅ تم نشر المسابقة بنجاح!");
    hideAllAdminSections();
}

function toggleGlobalQuizForm() {
    let box = document.getElementById('globalQuizBox');
    if (box.style.display === 'none') {
        box.style.display = 'block';
    } else {
        box.style.display = 'none';
    }
}

function saveQuiz(type) {
    let targetStage = document.getElementById('globalTargetStage').value;
    let questionText = document.getElementById('globalQuizQuestion').value.trim();
    let answerText = document.getElementById('globalQuizAnswer').value.trim();

    if (questionText === "" || answerText === "") {
        alert("⚠️ يرجى ملء السؤال والإجابة الصحيحة!");
        return;
    }

    quizzesData.push({
        id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        stage: targetStage,
        questions: [
            { text: questionText, type: 'essay', options: '', answer: answerText }
        ]
    });

    saveData();
    alert("✅ تم نشر المسابقة العامة بنجاح!");
    document.getElementById('globalQuizQuestion').value = "";
    document.getElementById('globalQuizAnswer').value = "";
    toggleGlobalQuizForm();
}

function openEditScoutModal(index) {
    let scout = scoutsData[index];
    if (!scout) return;

    document.getElementById('editScoutIndex').value = index;
    document.getElementById('editScoutName').value = scout.name;
    document.getElementById('editScoutPhone').value = scout.phone || "";
    document.getElementById('editScoutConfessor').value = scout.confessor || "";
    document.getElementById('editScoutCode').value = scout.code;

    document.getElementById('editScoutModal').style.display = 'flex';
}

function closeEditScoutModal() {
    document.getElementById('editScoutModal').style.display = 'none';
}

function saveEditedScout() {
    let index = document.getElementById('editScoutIndex').value;
    let name = document.getElementById('editScoutName').value.trim();
    let phone = document.getElementById('editScoutPhone').value.trim();
    let confessor = document.getElementById('editScoutConfessor').value.trim();
    let code = document.getElementById('editScoutCode').value.trim().toUpperCase();

    if (name === "" || code === "") {
        alert("⚠️ اسم الكشاف والكود حقول إجبارية!");
        return;
    }

    scoutsData[index].name = name;
    scoutsData[index].phone = phone;
    scoutsData[index].confessor = confessor;
    scoutsData[index].code = code;

    saveData();
    closeEditScoutModal();
    renderMembersList(currentActiveStage);
    populateScoutSelectByStage(currentActiveStage);
    alert("✅ تم تعديل بيانات الكشاف بنجاح!");
}

function enableBottomEditMode() {
    let select = document.getElementById('scoutSelect');
    if (select && select.value !== "") {
        openEditScoutModal(select.value);
    } else {
        alert("⚠️ يرجى اختيار كشاف أولاً من القائمة لتعديله!");
    }
}

function enableBottomDeleteMode() {
    let select = document.getElementById('scoutSelect');
    if (select && select.value !== "") {
        let scoutIndex = select.value;
        let scout = scoutsData[scoutIndex];
        if (confirm(`⚠️ تنبيه: هل أنت متأكد من رغبتك في حذف الكشاف "${scout.name}" نهائياً؟`)) {
            deleteScout(scoutIndex);
        }
    } else {
        alert("⚠️ يرجى اختيار كشاف أولاً من القائمة لحذفه!");
    }
}
