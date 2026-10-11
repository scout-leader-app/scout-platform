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
    { name: "أحمد علي محمد", phone: "01012345678", confessor: "أبونا بولس", code: "S101", stage: "ابتدائي", points: 150, lastActive: "لم يسجل دخول" },
    { name: "مينا يوسف ميخائيل", phone: "01123456789", confessor: "أبونا أنطونيوس", code: "S102", stage: "إعدادي", points: 200, lastActive: "لم يسجل دخول" },
    { name: "عمر خالد محمود", phone: "01234567890", confessor: "أبونا يوحنا", code: "S103", stage: "ثانوي", points: 120, lastActive: "لم يسجل دخول" },
    { name: "يوسف حسن مصطفى", phone: "01555555555", confessor: "أبونا بيشوي", code: "S104", stage: "جامعي", points: 180, lastActive: "لم يسجل دخول" }
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
        let loginBox = document.getElementById('loginBox');
        let adminPanel = document.getElementById('adminMainPanel');
        let topLogout = document.getElementById('topLogoutBtn');
        if (loginBox) loginBox.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        if (topLogout) topLogout.style.display = 'block';
        errorMsg.innerHTML = "";
        return;
    }

    if (STAGE_CODES[inputCode]) {
        isSuperAdmin = false;
        let targetStage = STAGE_CODES[inputCode];
        let loginBox = document.getElementById('loginBox');
        let topLogout = document.getElementById('topLogoutBtn');
        if (loginBox) loginBox.style.display = 'none';
        openStageControl(targetStage);
        if (topLogout) topLogout.style.display = 'block';
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
        let now = new Date();
        foundScout.lastActive = now.toLocaleDateString('ar-EG') + ' - ' + now.toLocaleTimeString('ar-EG');
        saveData();

        loggedInScout = foundScout;
        let loginBox = document.getElementById('loginBox');
        let displayName = document.getElementById('displayName');
        let displayStage = document.getElementById('displayStage');
        let displayPoints = document.getElementById('displayPoints');
        let profileDashboard = document.getElementById('profileDashboard');
        let topLogout = document.getElementById('topLogoutBtn');

        if (loginBox) loginBox.style.display = 'none';
        if (displayName) displayName.innerText = foundScout.name;
        if (displayStage) displayStage.innerText = foundScout.stage;
        if (displayPoints) displayPoints.innerText = foundScout.points;
        if (profileDashboard) profileDashboard.style.display = 'block';
        if (topLogout) topLogout.style.display = 'block';
        
        if (typeof backToScoutMenu === 'function') {
            backToScoutMenu();
        }
        errorMsg.innerHTML = "";
    } else {
        errorMsg.innerHTML = "❌ البيانات غير صحيحة!";
    }
}

function showLogoutModal() {
    let modal = document.getElementById('logoutModal');
    if (modal) modal.style.display = 'flex';
}

function closeLogoutModal() {
    let modal = document.getElementById('logoutModal');
    if (modal) modal.style.display = 'none';
}

function confirmLogout() {
    closeLogoutModal();
    loggedInScout = null;
    isSuperAdmin = false;

    let elementsToHide = [
        'profileDashboard', 
        'adminMainPanel', 
        'stageControlBox', 
        'topLogoutBtn',
        'publishModal',
        'contentsModal'
    ];

    elementsToHide.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    let loginBox = document.getElementById('loginBox');
    if (loginBox) loginBox.style.display = 'block';

    let scoutNameInput = document.getElementById('scoutName');
    if (scoutNameInput) scoutNameInput.value = "";

    let scoutStageSelect = document.getElementById('scoutStage');
    if (scoutStageSelect) scoutStageSelect.value = "";

    let scoutCodeInput = document.getElementById('scoutCode');
    if (scoutCodeInput) scoutCodeInput.value = "";
}

// دالة فتح نافذة النشر للمشرف (مضمونة هنا لمنع أي خطأ)
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

function backToScoutMenu() {
    let mainSubMenu = document.getElementById('scoutMainMenu');
    if (mainSubMenu) mainSubMenu.style.display = 'flex';

    let pointsSec = document.getElementById('scoutPointsSection');
    if (pointsSec) pointsSec.style.display = 'none';

    let quizzesSec = document.getElementById('scoutQuizzesSection');
    if (quizzesSec) quizzesSec.style.display = 'none';
}
