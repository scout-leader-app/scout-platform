// ==========================================
// وحدة إدارة مسابقات القطاع (القائمة المصغرة الذكية)
// ==========================================

// 1. الدالة الرئيسية التي تفتح القائمة المصغرة (الزرين)
function openQuizManagementMenu() {
    const stageControlBox = document.getElementById('stageControlBox');
    if (stageControlBox) {
        stageControlBox.classList.remove('large-box');
    }
    
    // إخفاء الأزرار الرئيسية والقوائم الأخرى في لوحة المشرف
    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'none';

    const footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'none';

    const leaderboard = document.getElementById('leaderboardSection');
    if (leaderboard) leaderboard.style.display = 'none';

    const topLogout = document.getElementById('topLogoutBtn');
    if (topLogout) topLogout.style.display = 'block';

    // إخفاء كافة الأقسام الفرعية تماماً لمنع أي تداخل
    ['addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec', 'deleteQuizSec', 'quizManagementMenuSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // إنشاء أو إظهار حاوية القائمة المصغرة الموحدة
    let parentContainer = document.getElementById('stageControlBox') || document.body;
    let menuSec = document.getElementById('quizManagementMenuSec');
    
    if (!menuSec) {
        menuSec = document.createElement('div');
        menuSec.id = 'quizManagementMenuSec';
        parentContainer.appendChild(menuSec);
    }

    menuSec.style.cssText = "text-align: center; padding: 20px; display: block; background: #fff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-top: 10px;";
    menuSec.innerHTML = `
        <h3 style="color: #0d47a1; margin-bottom: 20px;">⚙️ لوحة إدارة مسابقات القطاع</h3>
        <div style="display: flex; flex-direction: column; gap: 15px; max-width: 300px; margin: 0 auto;">
            <button type="button" onclick="openAddQuizSectionDirect()" class="btn-primary" style="padding: 12px; font-size: 16px; background: #2e7d32; color: #fff; border: none; border-radius: 6px; cursor: pointer;">➕ إضافة مسابقة جديدة</button>
            <button type="button" onclick="openDeleteQuizSectionDirect()" class="btn-primary btn-danger" style="padding: 12px; font-size: 16px; background: #c62828; color: #fff; border: none; border-radius: 6px; cursor: pointer;">❌ حذف المسابقات</button>
            <button type="button" onclick="backToStageMain()" class="btn-primary btn-grey" style="padding: 10px; font-size: 14px; background: #607d8b; color: #fff; border: none; border-radius: 6px; cursor: pointer;">🔙 الرجوع للقائمة الرئيسية</button>
        </div>
    `;
}

// 2. دالة العودة للقائمة الرئيسية للقطاع
function backToStageMain() {
    ['quizManagementMenuSec', 'addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec', 'deleteQuizSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'flex';

    const footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'flex';
}

// 3. الانتقال لشاشة إضافة المسابقة (عند الضغط على زر إضافة من القائمة المصغرة)
function openAddQuizSectionDirect() {
    let menuSec = document.getElementById('quizManagementMenuSec');
    if (menuSec) menuSec.style.display = 'none'; // إخفاء القائمة المصغرة

    let addQuizSec = document.getElementById('addQuizSec');
    if (addQuizSec) {
        addQuizSec.style.display = 'block';
    }

    // إعداد شريط اسم المسابقة وإجمالي النقاط والرجوع لقائمة الإدارة
    let quizSettingsContainer = document.getElementById('adminQuizSettingsContainer');
    if (!quizSettingsContainer && addQuizSec) {
        let settingsDiv = document.createElement('div');
        settingsDiv.id = 'adminQuizSettingsContainer';
        settingsDiv.style.cssText = "margin-bottom: 15px; background: #e3f2fd; padding: 12px; border-radius: 8px; border: 1px solid #90caf9;";
        settingsDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <button type="button" onclick="openQuizManagementMenu()" class="btn-primary btn-grey" style="padding: 4px 10px; font-size: 12px; background: #546e7a; color: #fff; border: none; border-radius: 4px; cursor: pointer;">⬅️ رجوع لقائمة الإدارة</button>
            </div>
            <label style="color: #0d47a1; font-weight: bold;">🏷️ اسم أو عنوان المسابقة:</label><br>
            <input type="text" id="adminQuizTitleInput" class="input-field" placeholder="مثال: مسابقة الأسبوع الأول..." style="width: 100%; margin-top: 5px; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"><br>
            
            <label style="color: #0d47a1; font-weight: bold;">⭐ إجمالي نقاط المسابقة الكلية:</label><br>
            <input type="number" id="adminQuizTotalPointsInput" class="input-field" value="20" placeholder="مثال: 20" style="width: 100%; margin-top: 5px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
        `;
        addQuizSec.insertBefore(settingsDiv, addQuizSec.firstChild);
    } else {
        let titleInput = document.getElementById('adminQuizTitleInput');
        let totalPointsInput = document.getElementById('adminQuizTotalPointsInput');
        if (titleInput) titleInput.value = "";
        if (totalPointsInput) totalPointsInput.value = "20";
    }

    let container = document.getElementById('questionsContainer');
    if (container) {
        container.innerHTML = "";
        addQuestionField();
    }
}

// 4. الانتقال لشاشة حذف المسابقات (عند الضغط على زر حذف من القائمة المصغرة)
function openDeleteQuizSectionDirect() {
    let menuSec = document.getElementById('quizManagementMenuSec');
    if (menuSec) menuSec.style.display = 'none'; // إخفاء القائمة المصغرة

    let deleteSec = document.getElementById('deleteQuizSec');
    const parentContainer = document.getElementById('stageControlBox') || document.body;

    if (!deleteSec) {
        deleteSec = document.createElement('div');
        deleteSec.id = 'deleteQuizSec';
        parentContainer.appendChild(deleteSec);
    }

    deleteSec.style.cssText = "padding: 15px; background: #fff; border-radius: 10px; display: block; margin-top: 10px;";
    
    let stageQuizzes = quizzesData.map((q, idx) => ({ q, idx })).filter(item => item.q.stage === currentActiveStage || item.q.stage === "الكل");

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <button type="button" onclick="openQuizManagementMenu()" class="btn-primary btn-grey" style="padding: 4px 10px; font-size: 12px; background: #546e7a; color: #fff; border: none; border-radius: 4px; cursor: pointer;">⬅️ رجوع لقائمة الإدارة</button>
            <h3 style="color: #c62828; margin: 0;">❌ حذف مسابقات القطاع</h3>
        </div>
    `;

    if (stageQuizzes.length === 0) {
        html += `<p style="text-align: center; color: #666; padding: 20px;">لا توجد مسابقات منشورة حالياً في هذا القطاع للحذف.</p>`;
    } else {
        html += `<div id="adminExistingQuizzesList">`;
        stageQuizzes.forEach(item => {
            let displayTitle = item.q.title || item.q.name || (item.q.questions && item.q.questions.length > 0 ? item.q.questions[0].text : "مسابقة عامة");
            let totalPts = item.q.totalPoints || 20;
            html += `
                <div style="background: #f9f9f9; padding: 10px; margin-bottom: 8px; border-radius: 6px; border: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px;"><b>مسابقة:</b> ${displayTitle.substring(0, 30)}... <small style="color: #e65100;">(${totalPts} نقطة)</small></span>
                    <button type="button" onclick="deleteQuizAndRefresh(${item.idx})" class="btn-primary btn-danger" style="padding: 4px 10px; font-size: 12px; background: #c62828; color: #fff; border: none; border-radius: 4px; cursor: pointer;">حذف ❌</button>
                </div>
            `;
        });
        html += `</div>`;
    }

    deleteSec.innerHTML = html;
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
        openDeleteQuizSectionDirect(); // تحديث القائمة فوراً
    }
}

function deleteQuizAndRefresh(qIndex) {
    deleteQuiz(qIndex);
}

// 5. إضافة حقل السؤال مع التحكم بالنقاط
function addQuestionField() {
    let container = document.getElementById('questionsContainer');
    if (!container) return;
    let qIndex = container.children.length + 1;

    let div = document.createElement('div');
    div.className = "question-block";
    div.style.cssText = "background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ddd;";
    
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <label><b>السؤال رقم ${qIndex}:</b></label>
            <div style="display: flex; align-items: center; gap: 5px;">
                <label style="font-size: 13px; color: #333;">نقاط السؤال:</label>
                <input type="number" class="input-field q-points" value="5" min="0" style="width: 60px; padding: 4px; text-align: center;">
            </div>
        </div>
        <input type="text" class="input-field q-text" placeholder="اكتب نص السؤال هنا..." style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;"><br>
        
        <label>نوع السؤال:</label>
        <select class="input-field q-type" onchange="toggleQuestionType(this)" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="mcq">اختيار من متعدد (4 خيارات)</option>
            <option value="essay">مقالي (إجابة نصية حرة)</option>
        </select><br>

        <div class="mcq-options-container">
            <label>الخيارات الأربعة:</label><br>
            <input type="text" class="input-field q-opt-1" placeholder="الخيار الأول" style="width: 100%; padding: 6px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;"><br>
            <input type="text" class="input-field q-opt-2" placeholder="الخيار الثاني" style="width: 100%; padding: 6px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;"><br>
            <input type="text" class="input-field q-opt-3" placeholder="الخيار الثالث" style="width: 100%; padding: 6px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px;"><br>
            <input type="text" class="input-field q-opt-4" placeholder="الخيار الرابع" style="width: 100%; padding: 6px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;"><br>
        </div>

        <label>الإجابة الصحيحة:</label>
        <input type="text" class="input-field q-answer" placeholder="الإجابة الصحيحة..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
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

// 6. حفظ المسابقة والرجوع للقائمة المصغرة
function saveStageQuiz() {
    let quizTitleInput = document.getElementById('adminQuizTitleInput');
    let quizTitle = quizTitleInput ? quizTitleInput.value.trim() : "مسابقة القطاع";

    let totalPointsInput = document.getElementById('adminQuizTotalPointsInput');
    let totalQuizPoints = totalPointsInput ? parseInt(totalPointsInput.value) || 20 : 20;

    if (quizTitle === "") {
        alert("⚠️ يرجى كتابة اسم المسابقة أولاً!");
        return;
    }

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
        let qPoints = parseInt(block.querySelector('.q-points').value) || 0;
        
        let options = [];
        if (type === 'mcq') {
            let opt1 = block.querySelector('.q-opt-1').value.trim();
            let opt2 = block.querySelector('.q-opt-2').value.trim();
            let opt3 = block.querySelector('.q-opt-3').value.trim();
            let opt4 = block.querySelector('.q-opt-4').value.trim();

            if (opt1 === "" || opt2 === "" || opt3 === "" || opt4 === "") {
                alert("⚠️ يرجى ملء الخيارات الأربعة كاملة للسؤال الاختياري!");
                return;
            }
            options = [opt1, opt2, opt3, opt4];
        }

        if (text === "" || answer === "") {
            alert("⚠️ يرجى التأكد من كتابة نص السؤال والإجابة الصحيحة!");
            return;
        }

        questionsList.push({ text, type, options, answer, points: qPoints });
    }

    let currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' });

    quizzesData.push({
        id: 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: quizTitle,
        stage: currentActiveStage,
        totalPoints: totalQuizPoints,
        date: currentDate,
        questions: questionsList
    });

    saveData();
    alert("✅ تم نشر المسابقة بنجاح مع تحديد نقاط الأسئلة وإجمالي النقاط!");
    
    // إخفاء شاشة الإضافة والرجوع لقائمة إدارة المسابقات المصغرة
    let addQuizSec = document.getElementById('addQuizSec');
    if (addQuizSec) addQuizSec.style.display = 'none';
    
    openQuizManagementMenu();
}