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

function addNewScout() {
    let name = document.getElementById('newScoutName').value.trim();
    let phone = document.getElementById('newScoutPhone').value.trim();
    let confessor = document.getElementById('newScoutConfessor').value.trim();
    let code = document.getElementById('newScoutCode').value.trim().toUpperCase();

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
    } else if (type === 'deduct') {
        scoutsData[selectedIndex].points -= pointsInput;
        if (scoutsData[selectedIndex].points < 0) scoutsData[selectedIndex].points = 0;
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

function viewScoutActivity(scoutCode) {
    let scout = scoutsData.find(s => s.code === scoutCode);
    if (scout && scout.lastActive) {
        alert(`الكشاف: ${scout.name}\nآخر فترة عمل / نشاط: ${scout.lastActive}`);
    } else {
        alert(`لم يتم تسجيل أي نشاط سابق لهذا الكشاف حتى الآن.`);
    }
}

// ================= دوال النشر والتنزيل المستقلة =================

function openPublishModal() {
    let modal = document.getElementById('publishModal');
    if (modal) modal.style.display = 'flex';
}

function closePublishModal() {
    let modal = document.getElementById('publishModal');
    if (modal) modal.style.display = 'none';
}

function publishNewContent() {
    let titleElement = document.getElementById('contentTitle');
    let urlElement = document.getElementById('contentUrl');
    let targetElement = document.getElementById('contentTarget');

    if (!titleElement || !urlElement || !targetElement) return;

    let title = titleElement.value.trim();
    let url = urlElement.value.trim();
    let target = targetElement.value;

    if (!title || !url) {
        alert("⚠️ يرجى إدخال عنوان المحتوى ورابط الملف/الصورة!");
        return;
    }

    let mediaContents = JSON.parse(localStorage.getItem('mediaContents')) || [];
    mediaContents.push({
        id: Date.now(),
        title: title,
        url: url,
        targetStage: target
    });

    localStorage.setItem('mediaContents', JSON.stringify(mediaContents));
    alert("✅ تم نشر المحتوى بنجاح!");
    titleElement.value = "";
    urlElement.value = "";
    closePublishModal();
}

function openContentsModal() {
    const listContainer = document.getElementById('contentsList');
    if (!listContainer) return;
    listContainer.innerHTML = "";

    let mediaContents = JSON.parse(localStorage.getItem('mediaContents')) || [];
    let userStage = loggedInScout ? loggedInScout.stage : "";
    let availableFiles = mediaContents.filter(item => item.targetStage === "ALL" || item.targetStage === userStage);

    if (availableFiles.length === 0) {
        listContainer.innerHTML = "<p style='text-align:center;'>لا توجد ملفات أو صور متاحة للتنزيل حالياً.</p>";
    } else {
        availableFiles.forEach(file => {
            let itemHtml = `
                <div style="background:#222; padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span>📄 ${file.title}</span>
                    <a href="${file.url}" download target="_blank" style="background:#2196F3; color:white; padding:8px 15px; text-decoration:none; border-radius:5px; font-weight:bold;">
                        ⬇️ تنزيل
                    </a>
                </div>
            `;
            listContainer.innerHTML += itemHtml;
        });
    }

    document.getElementById('contentsModal').style.display = 'flex';
}

function closeContentsModal() {
    let modal = document.getElementById('contentsModal');
    if (modal) modal.style.display = 'none';
}
