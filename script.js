/* محرك FM onor AI Studio */
document.getElementById('generateBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('userPrompt').value;
    const tool = document.getElementById('toolSelect').value;
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const btn = document.getElementById('generateBtn');

    if (!prompt) {
        alert("اكتب فكرتك الأول يا فارس!");
        return;
    }

    btn.innerText = "جاري الإبداع... ⏳";
    btn.disabled = true;
    resultBox.style.display = 'block';
    resultText.innerText = "الذكاء الاصطناعي بيفكر ويكتب...";

    let systemPrompt = "";
    if (tool === 'song') {
        systemPrompt = "أنت ملحن وشاعر محترف في استوديو FM onor. اكتب كلمات أغنية كاملة (مقطع، كورس) بناءً على طلب المستخدم. اجعل الكلمات رائعة وبسيطة.";
    } else if (tool === 'video') {
        systemPrompt = "أنت مخرج سينمائي في استوديو FM onor. اكتب سيناريو فيديو قصير (3 مشاهد) بناءً على طلب المستخدم. وضح الوصف البصري والمؤثرات الصوتية.";
    } else {
        systemPrompt = "أنت شاعر عربي فصيح في استوديو FM onor. اكتب قصيدة شعرية جميلة بناءً على طلب المستخدم.";
    }

    try {
        // الاتصال بـ OpenRouter
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer YOUR_API_KEY_HERE", // 🔴 هنا هيتحط المفتاح في Vercel لاحقاً
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-lite-001",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        
        if(data.error) {
            resultText.innerText = "خطأ: " + data.error.message;
        } else {
            resultText.innerText = data.choices[0].message.content;
        }

    } catch (error) {
        resultText.innerText = "عذراً، حدث خطأ. تأكد من المفتاح والإنترنت.";
    } finally {
        btn.innerText = "✨ أنشئ الآن ✨";
        btn.disabled = false;
    }
});
