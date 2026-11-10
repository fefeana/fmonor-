document.getElementById('generateBtn').addEventListener('click', async () => {

    const prompt = document.getElementById('userPrompt').value.trim();
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
        systemPrompt =
            "أنت ملحن وشاعر محترف في استوديو FM onor. اكتب كلمات أغنية كاملة مع مقطع وكورس بطريقة احترافية.";
    }
    else if (tool === 'video') {
        systemPrompt =
            "أنت مخرج سينمائي محترف. اكتب سيناريو فيديو قصير من 3 مشاهد مع الوصف البصري والمؤثرات.";
    }
    else {
        systemPrompt =
            "أنت شاعر عربي فصيح. اكتب قصيدة جميلة ومؤثرة بناء على طلب المستخدم.";
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
                    model: "google/gemini-2.0-flash-lite-001",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("API RESPONSE:", data);

        if (!response.ok) {
            resultText.innerText =
                "خطأ: " +
                (data.error?.message || data.error || "فشل الطلب");
            return;
        }

        if (data.error) {
            resultText.innerText =
                "خطأ: " +
                (data.error?.message || data.error);
            return;
        }

        if (
            data.choices &&
            data.choices.length > 0 &&
            data.choices[0].message
        ) {
            resultText.innerText =
                data.choices[0].message.content;
        } else {
            resultText.innerText =
                "لم يتم استلام رد من الذكاء الاصطناعي.";
        }

    } catch (error) {

        console.error("ERROR:", error);

        resultText.innerText =
            "خطأ حقيقي: " + error.message;
    }

    finally {
        btn.innerText = "✨ أنشئ الآن ✨";
        btn.disabled = false;
    }

});
        
