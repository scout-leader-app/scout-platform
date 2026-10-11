// فتح أو إغلاق قائمة خيارات النطاق مع التحقق من صلاحية المشرف العام
function toggleLeaderboardMenu() {
    const menu = document.getElementById('leaderboardMenuSelection');
    const globalBtn = document.getElementById('globalLeaderboardBtn');
    
    if (menu) {
        const isOpen = menu.style.display === 'block';
        menu.style.display = isOpen ? 'none' : 'block';
        
        // إذا كانت القائمة ستفتح، نتحقق هل المستخدم هو المشرف العام أم قائد قطاع عادي؟
        if (!isOpen && globalBtn) {
            // التحقق من اسم المرحلة النشطة الحالية أو صلاحية المشرف العام
            // (تأكد أن المشرف العام يكون currentActiveStage لديه هو "المشرف العام" أو ما يعادله في نظامك)
            const isGeneralAdmin = (typeof currentActiveStage !== 'undefined' && currentActiveStage === 'المشرف العام');

            if (isGeneralAdmin) {
                globalBtn.style.display = 'block'; // يظهر للمشرف العام فقط
            } else {
                globalBtn.style.display = 'none';  // يُخفى تماماً عن باقي قادة القطاعات
            }
        }
    }
    
    // إخفاء الجدول الرئيسي لو كان مفتوحاً
    const section = document.getElementById('leaderboardSection');
    if (section) section.style.display = 'none';
}

// عرض نقاط القطاع الحالي فقط
function showStageLeaderboard() {
    const menu = document.getElementById('leaderboardMenuSelection');
    if (menu) menu.style.display = 'none';

    // إخفاء القائمة الرئيسية وإظهار جدول الترتيب كاملاً مكانه
    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'none';

    const footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'none';

    const section = document.getElementById('leaderboardSection');
    if (section) section.style.display = 'block';

    const title = document.getElementById('leaderboardTitle');
    if (title) title.innerText = "🏆 الترتيب الخاص بنقاط القطاع الحالي (" + (typeof currentActiveStage !== 'undefined' ? currentActiveStage : '') + ") 🏆";

    let tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    let filteredScouts = scoutsData
        .filter(s => s.stage === currentActiveStage)
        .sort((a, b) => (b.points || 0) - (a.points || 0));

    if (filteredScouts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #666;">لا توجد أعضاء مسجلة في هذا القطاع حالياً.</td></tr>`;
        return;
    }

    let html = "";
    filteredScouts.forEach((scout, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${scout.name}</td>
                <td>${scout.stage}</td>
                <td>⭐ ${scout.points || 0}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// عرض النقاط العامة لجميع القطاعات (للمشرف العام فقط)
function showGlobalLeaderboard() {
    const menu = document.getElementById('leaderboardMenuSelection');
    if (menu) menu.style.display = 'none';

    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'none';

    const footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'none';

    const section = document.getElementById('leaderboardSection');
    if (section) section.style.display = 'block';

    const title = document.getElementById('leaderboardTitle');
    if (title) title.innerText = "🏆 الترتيب العام لجميع قطاعات الكشافة 🏆";

    let tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    let sortedScouts = [...scoutsData].sort((a, b) => (b.points || 0) - (a.points || 0));

    if (sortedScouts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #666;">لا توجد أعضاء مسجلة في المنصة حالياً.</td></tr>`;
        return;
    }

    let html = "";
    sortedScouts.forEach((scout, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${scout.name}</td>
                <td>${scout.stage}</td>
                <td>⭐ ${scout.points || 0}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// زر إخفاء الترتيب وإعادة القائمة الرئيسية
function hideLeaderboard() {
    const section = document.getElementById('leaderboardSection');
    if (section) section.style.display = 'none';

    const menu = document.getElementById('leaderboardMenuSelection');
    if (menu) menu.style.display = 'none';

    const mainBtns = document.getElementById('stageMainButtons');
    if (mainBtns) mainBtns.style.display = 'flex';

    const footerBtns = document.getElementById('stageFooterButtons');
    if (footerBtns) footerBtns.style.display = 'block';
}