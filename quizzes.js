// فتح وإغلاق نافذة المسابقات المنبثقة
function openQuizMenu() {
    const modal = document.getElementById('quizMenuModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeQuizMenu() {
    const modal = document.getElementById('quizMenuModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// التنقل بين الأقسام داخل لوحة الكشاف (مثل معرفة النقاط)
function showScoutSection(section) {
    const pointsSection = document.getElementById('scoutPointsSection');
    const quizzesSection = document.getElementById('scoutQuizzesSection');
    const mainMenu = document.getElementById('scoutMainMenu');

    // إخفاء القائمة الرئيسية مؤقتاً
    if (mainMenu) mainMenu.style.display = 'none';

    if (section === 'points') {
        if (pointsSection) pointsSection.style.display = 'block';
        if (quizzesSection) quizzesSection.style.display = 'none';
        
        // تحديث عرض النقاط إن وجد
        const displayPointsEl = document.getElementById('displayPoints');
        if (displayPointsEl && typeof loggedInScout !== 'undefined') {
            displayPointsEl.innerText = loggedInScout.points || 0;
        }
    }
}

// زر الرجوع للقائمة الرئيسية للكشاف
function backToScoutMenu() {
    const pointsSection = document.getElementById('scoutPointsSection');
    const quizzesSection = document.getElementById('scoutQuizzesSection');
    const mainMenu = document.getElementById('scoutMainMenu');

    if (pointsSection) pointsSection.style.display = 'none';
    if (quizzesSection) quizzesSection.style.display = 'none';
    if (mainMenu) mainMenu.style.display = 'flex';
}

// دالة عرض المسابقات المتاحة (الجديد في الأعلى + عرض تاريخ النشر)
function selectSolveQuiz() {
    closeQuizMenu();
    
    const quizzesSection = document.getElementById('scoutQuizzesSection');
    const mainMenu = document.getElementById('scoutMainMenu');
    const quizzesList = document.getElementById('quizzesList');

    if (mainMenu) mainMenu.style.display = 'none';
    if (quizzesSection) quizzesSection.style.display = 'block';
    if (!quizzesList) return;
    
    quizzesList.innerHTML = '';

    let regularQuizzes = typeof quizzesData !== 'undefined' ? quizzesData : JSON.parse(localStorage.getItem('quizzesData') || '[]');
    let globalQuizzes = JSON.parse(localStorage.getItem('globalQuizzes') || '[]');
    let allQuizzes = [...regularQuizzes, ...globalQuizzes];

    // استثناء المسابقات التي تم حلها مسبقاً من قِبل الكشاف
    let solvedIds = loggedInScout.solvedQuizzes || [];
    let availableQuizzes = allQuizzes.filter(q => !solvedIds.includes(q.id));

    if (availableQuizzes.length === 0) {
        quizzesList.innerHTML = `<p style="text-align: center; color: #666; padding: 15px;">لا توجد مسابقات جديدة متاحة حالياً.</p>`;
        return;
    }

    // عكس الترتيب ليظهر الجديد من الأعلى
    availableQuizzes.reverse().forEach((quiz, index) => {
        let quizFileBox = document.createElement('div');
        quizFileBox.style.cssText = "background: #ffffff; border: 2px solid #0288d1; padding: 12px 15px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer;";
        
        let quizDate = quiz.date || "حديثاً";

        quizFileBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">📁</span>
                <div>
                    <h4 style="margin: 0; color: #0288d1;">${quiz.title || ('مسابقة رقم ' + (index + 1))}</h4>
                    <small style="color: #e65100; font-weight: bold;">📅 تاريخ النشر: ${quizDate}</small>
                </div>
            </div>
            <button class="btn-primary" style="padding: 5px 15px; font-size: 14px;">فتح الملف 📂</button>
        `;

        quizFileBox.onclick = function() {
            openQuizFileContent(quiz);
        };

        quizzesList.appendChild(quizFileBox);
    });
}

// دالة لفتح محتوى الملف وعرض أسئلة المسابقة للإجابة عليها (مع دعم مرن للاختيارات)
function openQuizFileContent(quiz) {
    const containerList = document.getElementById('quizzesList');
    if (!containerList) return;

    let html = `
        <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ccc;">
            <h3 style="color: #1565c0; text-align: center; margin-top: 0;">📂 ${quiz.title || 'المسابقة'}</h3>
            <form id="activeQuizForm">
    `;

    if (quiz.questions && Array.isArray(quiz.questions)) {
        quiz.questions.forEach((q, qIndex) => {
            html += `
                <div style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                    <p style="font-weight: bold; color: #333;">السؤال ${qIndex + 1}: ${q.question || q.text || ''}</p>
            `;

            let optionsList = [];
            if (q.options) {
                if (Array.isArray(q.options)) {
                    optionsList = q.options;
                } else if (typeof q.options === 'string') {
                    optionsList = q.options.split(',').map(opt => opt.trim());
                }
            }

            if (optionsList.length > 0) {
                optionsList.forEach((opt) => {
                    html += `
                        <label style="display: block; margin: 5px 0; cursor: pointer;">
                            <input type="radio" name="question_${qIndex}" value="${opt}" data-subindex="${qIndex}"> ${opt}
                        </label>
                    `;
                });
            } else {
                html += `
                    <input type="text" class="input-field quiz-text-input" data-subindex="${qIndex}" placeholder="اكتب إجابتك هنا..." style="width: 100%; margin-top: 5px;">
                `;
            }

            html += `</div>`;
        });
    }

    html += `
                <div style="text-align: center; margin-top: 20px; display: flex; gap: 10px;">
                    <button type="button" onclick="submitQuizAnswers('${quiz.id || ''}')" class="btn-primary" style="background: #4CAF50; flex: 1;">إرسال الإجابات النهائية ✅</button>
                    <button type="button" onclick="selectSolveQuiz()" class="btn-primary btn-grey" style="flex: 1;">إغلاق الملف 🔙</button>
                </div>
            </form>
        </div>
    `;

    containerList.innerHTML = html;
}

// دالة تسليم الإجابات وحفظ تفاصيل الإجابات لكل سؤال ومقارنتها بدقة
function submitQuizAnswers(quizId) {
    let regularQuizzes = typeof quizzesData !== 'undefined' ? quizzesData : JSON.parse(localStorage.getItem('quizzesData') || '[]');
    let globalQuizzes = JSON.parse(localStorage.getItem('globalQuizzes') || '[]');
    let allQuizzes = [...regularQuizzes, ...globalQuizzes];
    
    let quiz = allQuizzes.find(q => q && q.id === quizId);
    if (!quiz) return;

    let correctCount = 0;
    let wrongCount = 0;
    let detailedAnswers = [];

    if (quiz.questions && Array.isArray(quiz.questions)) {
        quiz.questions.forEach((item, subIndex) => {
            let userAnsRaw = "";
            let selectedRadio = document.querySelector(`input[type="radio"][data-subindex="${subIndex}"]:checked`);
            let inputField = document.querySelector(`input[type="text"][data-subindex="${subIndex}"]`);

            if (selectedRadio) {
                userAnsRaw = selectedRadio.value;
            } else if (inputField) {
                userAnsRaw = inputField.value;
            }

            let userAns = (userAnsRaw || "").trim();
            let correctAns = (item.answer || "").trim();
            let isCorrect = userAns.toLowerCase() === correctAns.toLowerCase();

            if (isCorrect) {
                correctCount++;
            } else {
                wrongCount++;
            }

            detailedAnswers.push({
                question: item.question || item.text || '',
                userAnswer: userAns || "لم يتم الإجابة",
                correctAnswer: correctAns,
                isCorrect: isCorrect
            });
        });
    }

    let totalQuestions = quiz.questions ? quiz.questions.length : 0;
    let percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    let allCorrect = (correctCount === totalQuestions && totalQuestions > 0);

    if (!loggedInScout.solvedQuizzes) loggedInScout.solvedQuizzes = [];
    if (!loggedInScout.solvedQuizzes.includes(quiz.id)) {
        loggedInScout.solvedQuizzes.push(quiz.id);
    }

    // جلب التاريخ والوقت الحالي لحفظ تاريخ الحل
    let currentDate = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' });

    if (!loggedInScout.quizResultsDetails) loggedInScout.quizResultsDetails = [];
    
    // إزالة النتيجة القديمة إن وجدت لنفس المسابقة وتحديثها بالأحدث
    loggedInScout.quizResultsDetails = loggedInScout.quizResultsDetails.filter(r => r.quizId !== quiz.id);

    loggedInScout.quizResultsDetails.push({
        quizId: quiz.id,
        title: quiz.title,
        date: currentDate,
        totalQuestions: totalQuestions,
        correctCount: correctCount,
        wrongCount: wrongCount,
        percentage: percentage,
        detailedAnswers: detailedAnswers,
        status: allCorrect ? "ناجح (اجتاز المسابقة)" : "مكتمل (مرفق التفاصيل)"
    });

    if (allCorrect) {
        loggedInScout.points = (loggedInScout.points || 0) + 20;
        alert("🎉 إجابات صحيحة تماماً! نسبة النجاح 100% وتمت إضافة 20 نقطة.");
    } else {
        alert(`❌ تم تسليم المسابقة. نسبة النجاح: ${percentage}% (صح: ${correctCount} | خطأ: ${wrongCount})`);
    }

    if (typeof scoutsData !== 'undefined' && Array.isArray(scoutsData)) {
        let mainIndex = scoutsData.findIndex(s => s.code === loggedInScout.code);
        if (mainIndex !== -1) scoutsData[mainIndex] = loggedInScout;
    }

    if (typeof saveData === 'function') {
        saveData();
    } else {
        localStorage.setItem('loggedInScout', JSON.stringify(loggedInScout));
        localStorage.setItem('scoutsData', JSON.stringify(scoutsData));
    }

    selectQuizResults();
}

// دالة نتائج حل المسابقات (عرض ملفات المسابقات المحلولة مع زر فتح لعرض النسبة التفصيلية)
function selectQuizResults() {
    closeQuizMenu();
    
    const quizzesSection = document.getElementById('scoutQuizzesSection');
    const mainMenu = document.getElementById('scoutMainMenu');
    const quizzesList = document.getElementById('quizzesList');

    if (mainMenu) mainMenu.style.display = 'none';
    if (quizzesSection) quizzesSection.style.display = 'block';
    if (!quizzesList) return;
    
    quizzesList.innerHTML = `<h3 style="color: #2e7d32; text-align: center;">📊 سجل نتائج المسابقات المحلولة</h3>`;

    let results = loggedInScout.quizResultsDetails || [];

    if (results.length === 0) {
        quizzesList.innerHTML += `<p style="text-align: center; color: #666; padding: 15px;">لم تقم بحل أي مسابقة حتى الآن.</p>`;
        return;
    }

    [...results].reverse().forEach((res) => {
        let resultBox = document.createElement('div');
        resultBox.style.cssText = "background: #f1f8e9; border: 2px solid #4CAF50; padding: 12px 15px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer;";
        
        resultBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">📁</span>
                <div>
                    <h4 style="margin: 0; color: #2e7d32;">${res.title || 'مسابقة'}</h4>
                    <small style="color: #555; display: block;">📅 تاريخ الحل: ${res.date || 'حديثاً'}</small>
                    <small style="color: #2e7d32; font-weight: bold;">النسبة: ${res.percentage || 0}% (صح: ${res.correctCount || 0} | خطأ: ${res.wrongCount || 0})</small>
                </div>
            </div>
            <button class="btn-primary" style="background: #2e7d32; padding: 5px 15px; font-size: 14px;">عرض النتيجة 📂</button>
        `;

        resultBox.onclick = function() {
            openQuizResultDetailsView(res);
        };

        quizzesList.appendChild(resultBox);
    });

    let backBtnContainer = document.createElement('div');
    backBtnContainer.style.cssText = "text-align: center; margin-top: 15px;";
    backBtnContainer.innerHTML = `<button type="button" onclick="backToScoutMenu()" class="btn-primary btn-grey" style="padding: 8px 20px;">الرجوع للقائمة 🔙</button>`;
    quizzesList.appendChild(backBtnContainer);
}

// دالة لفتح ملف النتيجة واستعراض تفاصيل الإجابات وعدد الصح والخطأ والنسبة المئوية
function openQuizResultDetailsView(res) {
    const quizzesList = document.getElementById('quizzesList');
    if (!quizzesList) return;

    let html = `
        <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #4CAF50;">
            <h3 style="color: #2e7d32; text-align: center; margin-top: 0;">📊 نتيجة ملف: ${res.title}</h3>
            <div style="background: #e8f5e9; padding: 10px; border-radius: 6px; text-align: center; margin-bottom: 15px;">
                <p style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #2e7d32;">النسبة المئوية: ${res.percentage}%</p>
                <p style="margin: 5px 0; color: #388e3c;">✅ الأسئلة الصحيحة: ${res.correctCount} | ❌ الأسئلة الخاطئة: ${res.wrongCount} (من إجمالي ${res.totalQuestions})</p>
                <small style="color: #666;">📅 تاريخ الحل: ${res.date}</small>
            </div>
    `;

    if (res.detailedAnswers && Array.isArray(res.detailedAnswers)) {
        res.detailedAnswers.forEach((ans, idx) => {
            let boxColor = ans.isCorrect ? "#e8f5e9" : "#ffebee";
            let borderColor = ans.isCorrect ? "#4CAF50" : "#f44336";
            let icon = ans.isCorrect ? "✅" : "❌";

            html += `
                <div style="margin-bottom: 12px; padding: 10px; background: ${boxColor}; border: 1px solid ${borderColor}; border-radius: 6px;">
                    <p style="font-weight: bold; color: #333; margin: 0 0 5px 0;">السؤال ${idx + 1}: ${ans.question}</p>
                    <p style="margin: 3px 0; color: #555;">إجابتك: <b>${ans.userAnswer}</b> ${icon}</p>
                    ${!ans.isCorrect ? `<p style="margin: 3px 0; color: #d32f2f;">الإجابة الصحيحة: <b>${ans.correctAnswer}</b></p>` : ''}
                </div>
            `;
        });
    }

    html += `
            <div style="text-align: center; margin-top: 20px;">
                <button type="button" onclick="selectQuizResults()" class="btn-primary" style="background: #2e7d32; padding: 8px 25px;">الرجوع لسجل النتائج 🔙</button>
            </div>
        </div>
    `;

    quizzesList.innerHTML = html;
}