function openStageControl(stageName) {
    currentActiveStage = stageName;
    
    // إخفاء لوحة الليدر الرئيسية
    let adminPanel = document.getElementById('adminMainPanel');
    if (adminPanel) adminPanel.style.display = 'none';

    // إظهار لوحة تحكم القطاع
    let stageBox = document.getElementById('stageControlBox');
    if (stageBox) stageBox.style.display = 'block';

    // تحديث عنوان القطاع
    let stageTitle = document.getElementById('stageTitle');
    if (stageTitle) stageTitle.innerText = "لوحة تحكم قطاع: " + stageName;
    
    // إظهار الأزرار الرئيسية للقطاع وإخفاء الأقسام الفرعية
    let mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'flex';

    ['addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // التحكم في زر الرجوع
    let backBtn = document.getElementById('backBtn');
    let topLogoutBtn = document.getElementById('topLogoutBtn');

    if (isSuperAdmin) {
        if (backBtn) backBtn.style.display = 'inline-block';
    } else {
        if (backBtn) backBtn.style.display = 'none';
    }
    if (topLogoutBtn) topLogoutBtn.style.display = 'block';

    populateScoutSelectByStage(stageName);
    renderMembersList(stageName);
}

function showAdminSection(secName) {
    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'none';

    ['addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    if (secName === 'membersList') {
        renderMembersList(currentActiveStage);
        let memSec = document.getElementById('membersListSec');
        if (memSec) memSec.style.display = 'block';
    } else if (secName === 'addMember') {
        let el = document.getElementById('addMemberSec');
        if (el) el.style.display = 'block';
    } else if (secName === 'addPoints') {
        let el = document.getElementById('addPointsSec');
        if (el) el.style.display = 'block';
    }
}

function hideAllAdminSections() {
    ['addMemberSec', 'addQuizSec', 'addPointsSec', 'membersListSec'].forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    let mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'flex';
}

function addNewScout() {
    let nameInput = document.getElementById('newScoutName');
    let phoneInput = document.getElementById('newScoutPhone');
    let confessorInput = document.getElementById('newScoutConfessor');
    let codeInput = document.getElementById('newScoutCode');

    let name = nameInput ? nameInput.value.trim() : "";
    let phone = phoneInput ? phoneInput.value.trim() : "";
    let confessor = confessorInput ? confessorInput.value.trim() : "";
    let code = codeInput ? codeInput.value.trim().toUpperCase() : "";

    if (name === "" || phone === "" || confessor === "" || code === "") {
        alert("⚠️ يرجى إدخال جميع البيانات!");
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
        points: 0,
        lastActive: 'لم يسجل دخول بعد'
    });
    
    saveData();
    alert(`✅ تم إضافة الكشاف "${name}" بنجاح!`);
    
    if (nameInput) nameInput.value = "";
    if (phoneInput) phoneInput.value = "";
    if (confessorInput) confessorInput.value = "";
    if (codeInput) codeInput.value = "";
    
    populateScoutSelectByStage(currentActiveStage);
    renderMembersList(currentActiveStage);
    hideAllAdminSections();
}

function renderMembersList(stageName) {
    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;
    tbody.innerHTML = "";

    let count = 0;
    scoutsData.forEach((scout) => {
        if (scout.stage === stageName) {
            count++;
            let row = `<tr>
                <td><b>${count}</b></td>
                <td>${scout.name}</td>
                <td>${scout.phone || 'غير مسجل'}</td>
                <td>${scout.confessor || 'غير مسجل'}</td>
                <td><code>${scout.code}</code></td>
                <td><button onclick="viewScoutActivity('${scout.code}')" class="btn-activity" style="padding: 5px 10px; cursor: pointer;">سجل النشاط</button></td>
            </tr>`;
            tbody.innerHTML += row;
        }
    });

    if (count === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">لا يوجد أعضاء مسجلين في هذا القطاع حالياً.</td></tr>`;
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
    let selectEl = document.getElementById('scoutSelect');
    let pointsEl = document.getElementById('addPointsInput');
    if (!selectEl || !pointsEl) return;

    let selectedIndex = selectEl.value;
    let pointsInput = parseInt(pointsEl.value);

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
    } else if (type === 'deduct') {
        scoutsData[selectedIndex].points -= pointsInput;
        if (scoutsData[selectedIndex].points < 0) scoutsData[selectedIndex].points = 0;
    }

    saveData();
    alert("✅ تم تعديل النقاط بنجاح!");
    pointsEl.value = "";
    hideAllAdminSections();
}

function backToAdminMain() {
    let stageBox = document.getElementById('stageControlBox');
    if (stageBox) stageBox.style.display = 'none';

    let adminPanel = document.getElementById('adminMainPanel');
    if (adminPanel) adminPanel.style.display = 'block';

    let topLogoutBtn = document.getElementById('topLogoutBtn');
    if (topLogoutBtn) topLogoutBtn.style.display = 'block';
}

function viewScoutActivity(scoutCode) {
    let scout = scoutsData.find(s => s.code === scoutCode);
    if (scout && scout.lastActive) {
        alert(`الكشاف: ${scout.name}\nآخر فترة عمل / نشاط: ${scout.lastActive}`);
    } else {
        alert(`لم يتم تسجيل أي نشاط سابق لهذا الكشاف حتى الآن.`);
    }
}
