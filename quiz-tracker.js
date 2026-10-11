function showQuizTrackingPanel() {
    const trackingContainer = document.getElementById('adminMainPanel');
    if (!trackingContainer) return;

    let globalQuizzes = JSON.parse(localStorage.getItem('globalQuizzes') || '[]');
    let scouts = typeof scoutsData !== 'undefined' ? scoutsData : JSON.parse(localStorage.getItem('scoutsData') || '[]');

    let html = `
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: right;">
            <h3 style="color: #0288d1; margin-top: 0;">📊 تقرير متابعة حل المسابقات</h3>
    `;

    if (globalQuizzes.length === 0) {
        html += `<p>لا توجد مسابقات عامة حالياً للمتابعة.</p>
            <button onclick="hideQuizTrackingPanel()" class="btn-primary btn-grey" style="margin-top: 10px;">🔙 الرجوع للقائمة الرئيسية</button>
        </div>`;
        trackingContainer.innerHTML = html;
        return;
    }

    globalQuizzes.forEach((quiz, index) => {
        let targetScouts = scouts.filter(s => quiz.stage === "الكل" || s.stage === quiz.stage);
        
        let solvedList = targetScouts.filter(s => s.solvedQuizzes && s.solvedQuizzes.includes(quiz.id));
        let unsolvedList = targetScouts.filter(s => !s.solvedQuizzes || !s.solvedQuizzes.includes(quiz.id));

        html += `
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 6px; margin-bottom: 15px; background: #fafafa;">
                <h4 style="color: #673ab7; margin-top: 0;">📌 ${quiz.title || ('مسابقة ' + (index + 1))} (${quiz.stage})</h4>
                <p><b>✅ من حلوا المسابقة (${solvedList.length}):</b></p>
                <ul style="margin: 5px 0 15px 20px; color: #2e7d32;">
                    ${solvedList.length > 0 ? solvedList.map(s => `<li>${s.name} (${s.stage})</li>`).join('') : '<li>لا أحد بعد</li>'}
                </ul>
                <p><b>❌ من لم يحلوا المسابقة بعد (${unsolvedList.length}):</b></p>
                <ul style="margin: 5px 0 0 20px; color: #c62828;">
                    ${unsolvedList.length > 0 ? unsolvedList.map(s => `<li>${s.name} (${s.stage})</li>`).join('') : 'الجميع قاموا بالحل! 🎉'}
                </ul>
            </div>
        `;
    });

    html += `
        <button onclick="hideQuizTrackingPanel()" class="btn-primary btn-grey" style="margin-top: 10px;">🔙 الرجوع للقائمة الرئيسية</button>
        </div>
    `;

    trackingContainer.innerHTML = html;
}

// دالة لإعادة إظهار محتوى لوحة القائد العام الرئيسية بدلاً من استخدام location.reload أو دالة خاطئة
function hideQuizTrackingPanel() {
    const trackingContainer = document.getElementById('adminMainPanel');
    if (!trackingContainer) return;

    trackingContainer.innerHTML = `
        <h2>👑 لوحة القائد العام (الليدر)</h2>
        
        <button onclick="toggleGlobalQuizForm()" class="btn-primary btn-purple btn-full" style="margin-bottom: 10px;">➕ إضافة مسابقة عامة</button>
        
        <button onclick="showQuizTrackingPanel()" class="btn-primary btn-full" style="background-color: #0288d1; margin-bottom: 15px;">📊 متابعة حلول المسابقات</button>

        <p>اختر لوحة التحكم الخاصة بالقطاع:</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="openStageControl('ابتدائي')" class="btn-primary btn-blue">قطاع الابتدائي 🎒</button>
            <button onclick="openStageControl('إعدادي')" class="btn-primary btn-blue">قطاع الإعدادي 📘</button>
            <button onclick="openStageControl('ثانوي')" class="btn-primary btn-blue">قطاع الثانوي 🎓</button>
            <button onclick="openStageControl('جامعي')" class="btn-primary btn-blue">قطاع الجامعي 🏛️</button>
        </div>
    `;
}