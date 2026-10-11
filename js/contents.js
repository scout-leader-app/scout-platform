// ================= نظام نشر وتنزيل المحتويات والملفات =================

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

    let contentsModal = document.getElementById('contentsModal');
    if (contentsModal) contentsModal.style.display = 'flex';
}

function closeContentsModal() {
    let modal = document.getElementById('contentsModal');
    if (modal) modal.style.display = 'none';
}
