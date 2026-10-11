// دالة إظهار وإخفاء نافذة المسابقة العامة
function toggleGlobalQuizForm() {
    const globalBox = document.getElementById('globalQuizBox');
    const adminMain = document.getElementById('adminMainPanel');

    if (!globalBox || !adminMain) return;

    if (globalBox.style.display === 'block') {
        globalBox.style.display = 'none';
        adminMain.style.display = 'block'; // العودة للقائمة الرئيسية
    } else {
        adminMain.style.display = 'none'; // إخفاء القائمة الرئيسية
        globalBox.style.display = 'block'; // إظهار صندوق المسابقة العامة
        renderGlobalQuizFormContainer(); // رسم محتوى النموذج بداخله
    }
}

// دالة عرض نموذج المسابقة العامة مع دعم إضافة أسئلة متعددة
function renderGlobalQuizFormContainer() {
    const box = document.getElementById('globalQuizBox');
    if (!box) return;

    box.innerHTML = `
        <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; text-align: right;">
            <h4 style="color: #673ab7; margin-top: 0; text-align: center; margin-bottom: 15px;">📋 دفتر إعداد المسابقات العامة</h4>
            
            <div style="margin-bottom: 15px;">
                <label style="font-weight: bold; color: #1565c0;">عنوان المسابقة العامة:</label><br>
                <input type="text" id="globalQuizTitle" class="input-field" placeholder="أدخل اسم المسابقة..." style="width: 100%; margin-top: 5px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="font-weight: bold;">القطاع المستهدف:</label>
                <select id="globalTargetStage" class="input-field" style="width: 100%; margin-top: 5px;">
                    <option value="الكل">كل القطاعات</option>
                    <option value="ابتدائي">ابتدائي</option>
                    <option value="إعدادي">إعدادي</option>
                    <option value="ثانوي">ثانوي</option>
                    <option value="جامعي">جامعي</option>
                </select>
            </div>

            <div id="globalQuestionsContainer"></div>
            
            <button onclick="addGlobalQuestionField()" class="btn-primary btn-teal" style="width: 100%; margin-bottom: 15px;">➕ إضافة سؤال آخر</button>

            <div style="display: flex; gap: 10px;">
                <button onclick="saveAdvancedGlobalQuiz()" class="btn-primary btn-purple" style="flex: 1;">نشر المسابقة كاملة</button>
                <button onclick="toggleGlobalQuizForm()" class="btn-primary btn-grey" style="flex: 1;">رجوع</button>
            </div>
        </div>
    `;
    
    // إضافة أول حقل سؤال تلقائياً عند فتح النموذج
    addGlobalQuestionField();
}

// دالة إضافة حقل سؤال جديد مع خياراته
function addGlobalQuestionField() {
    const container = document.getElementById('globalQuestionsContainer');
    if (!container) return;

    const questionDiv = document.createElement('div');
    questionDiv.className = 'global-question-block';
    questionDiv.style.cssText = 'border: 1px solid #ccc; padding: 10px; border-radius: 6px; margin-bottom: 15px; background: #fafafa;';
    
    questionDiv.innerHTML = `
        <label style="font-weight: bold; color: #333;">نص السؤال:</label>
        <input type="text" class="input-field g-q-text" placeholder="اكتب السؤال هنا..." style="width: 100%; margin-bottom: 8px;">
        
        <label style="font-size: 13px;">الاختيارات:</label>
        <input type="text" class="input-field g-opt-1" placeholder="الخيار الأول" style="width: 100%; margin-bottom: 5px;">
        <input type="text" class="input-field g-opt-2" placeholder="الخيار الثاني" style="width: 100%; margin-bottom: 5px;">
        <input type="text" class="input-field g-opt-3" placeholder="الخيار الثالث" style="width: 100%; margin-bottom: 5px;">
        <input type="text" class="input-field g-opt-4" placeholder="الخيار الرابع" style="width: 100%; margin-bottom: 8px;">
        
        <label style="font-weight: bold; color: #2e7d32; font-size: 13px;">الإجابة الصحيحة (نفس النص تماماً):</label>
        <input type="text" class="input-field g-q-answer" placeholder="مطابقة لأحد الاختيارات..." style="width: 100%;">
    `;
    
    container.appendChild(questionDiv);
}

function saveAdvancedGlobalQuiz() {
    const titleInput = document.getElementById('globalQuizTitle');
    const quizTitle = titleInput ? titleInput.value.trim() : '';
    const targetStage = document.getElementById('globalTargetStage').value;
    const questionBlocks = document.querySelectorAll('.global-question-block');
    
    if (!quizTitle) {
        alert('يرجى كتابة عنوان المسابقة العامة!');
        return;
    }

    if (questionBlocks.length === 0) {
        alert('يرجى إضافة سؤال واحد على الأقل!');
        return;
    }

    let questionsList = [];
    let isValid = true;

    questionBlocks.forEach(block => {
        const text = block.querySelector('.g-q-text').value.trim();
        const o1 = block.querySelector('.g-opt-1').value.trim();
        const o2 = block.querySelector('.g-opt-2').value.trim();
        const o3 = block.querySelector('.g-opt-3').value.trim();
        const o4 = block.querySelector('.g-opt-4').value.trim();
        const ans = block.querySelector('.g-q-answer').value.trim();

        if (!text || !o1 || !o2 || !o3 || !o4 || !ans) {
            isValid = false;
        }

        questionsList.push({
            question: text,
            options: [o1, o2, o3, o4],
            answer: ans
        });
    });

    if (!isValid) {
        alert('يرجى ملء جميع حقول الأسئلة والاختيارات والإجابات الصحيحة!');
        return;
    }

    // توليد معرف فريد وثابت للمسابقة بناءً على الوقت الحالي لضمان عدم تكراره
    const uniqueQuizId = 'global_quiz_' + Date.now();

    const newQuiz = {
        id: uniqueQuizId, // تعيين المعرف الفريد هنا
        title: quizTitle,
        stage: targetStage,
        questions: questionsList,
        date: new Date().toISOString()
    };

    let globalQuizzes = JSON.parse(localStorage.getItem('globalQuizzes') || '[]');
    globalQuizzes.push(newQuiz);
    localStorage.setItem('globalQuizzes', JSON.stringify(globalQuizzes));

    alert('تم نشر المسابقة العامة وعنوانها بنجاح!');
    toggleGlobalQuizForm();
}