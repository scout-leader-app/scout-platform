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
        let now = new Date();
        foundScout.lastActive = now.toLocaleDateString('ar-EG') + ' - ' + now.toLocaleTimeString('ar-EG');
        saveData();

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
