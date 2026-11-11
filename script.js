document.getElementById('generateBtn').addEventListener('click', async () => {

    const prompt = document.getElementById('userPrompt').value.trim();
    const tool = document.getElementById('toolSelect').value;
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const btn = document.getElementById('generateBtn');

    if (!prompt) {
        alert("اكتب فكرتك الأول يا ساموراي!");
        return;
    }

    btn.innerText = "جاري الإبداع... ⏳";
    btn.disabled = true;
    
    // إيقاف أي صوت شغال من محاولة سابقة
    window.speechSynthesis.cancel(); 

    resultBox.style.display = 'block';
    resultText.innerText = "الذكاء الاصطناعي بيفكر ويكتب...";

    // 💡 إضافة مكان للصورة
    let imgElement = document.getElementById('aiImage');
    if (!imgElement) {
        imgElement = document.createElement('img');
        imgElement.id = 'aiImage';
        imgElement.style.width = '100%';
        imgElement.style.borderRadius = '15px';
        imgElement.style.marginBottom = '15px';
        imgElement.style.border = '2px solid #FFD700';
        imgElement.style.display = 'none';
        resultBox.insertBefore(imgElement, resultText);
    }

    let systemPrompt = "";

    if (tool === 'song') {
        systemPrompt = "أنت ملحن وشاعر محترف في استوديو FM onor. اكتب كلمات أغنية كاملة مع مقطع وكورس بطريقة احترافية.";
        imgElement.style.display = 'none'; 
    }
    else if (tool === 'video') {
        systemPrompt = "أنت مخرج سينمائي محترف. اكتب سيناريو فيديو قصير من 3 مشاهد مع الوصف البصري والمؤثرات.";
        
        // 🎨 جلب الصورة من الوصف
        const imageUrl = `https://image.pollinations.ai/prompt/cinematic%20scene%20of%20${encodeURIComponent(prompt)}?width=800&height=450&nologo=true`;
        imgElement.src = imageUrl;
        imgElement.style.display = 'block';
        resultText.innerText = "تم توليد الصورة! جاري كتابة السيناريو...";
    }
    else {
        systemPrompt = "أنت شاعر عربي فصيح. اكتب قصيدة جميلة ومؤثرة بناء على طلب المستخدم.";
        imgElement.style.display = 'none'; 
    }

    try {
        const response = await fetch(
            "https://fm-onor-api.samanatalie3.workers.dev/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // 🔴 السيرفر هو اللي هيختار النموذج
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            resultText.innerText = "خطأ: " + (data.error?.message || data.error || "فشل الطلب");
            return;
        }

        if (data.error) {
            resultText.innerText = "خطأ: " + (data.error?.message || data.error);
            return;
        }

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            const finalResult = data.choices[0].message.content;
            
            // عرض النص
            resultText.innerText = finalResult;
            
            // 🎙️ تشغيل الصوت
            playAudio(finalResult); 

        } else {
            resultText.innerText = "لم يتم استلام رد من الذكاء الاصطناعي.";
        }

    } catch (error) {
        resultText.innerText = "خطأ حقيقي: " + error.message;
    }
    finally {
        btn.innerText = "✨ أنشئ الآن ✨";
        btn.disabled = false;
    }
});

// 🎙️ دالة قراءة النص بصوت
function playAudio(text) {
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; 
    utterance.rate = 0.9; 
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
            }
