async function callClaude(userMessage) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "",
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: userMessage
            }]
        })
    });

    const data = await response.json();
    if (data.status !== 200) throw new Error(data.error);
    return data.content[0].text;
}

async function callLlama(userMessage) {
    const response = await fetch("http://192.168.1.1:11434/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "qwen2.5:14b",
            max_tokens: 1024,
            messages: [{
                role: "user",
                content: userMessage
            }],
            stream: false
        })
    });
    const data = await response.json();
    if (response.status !== 200)
        throw new Error(data.error);
    return data.message.content;
}