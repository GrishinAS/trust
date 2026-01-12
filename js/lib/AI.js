// Request Queue Manager for batching API calls
var AIRequestQueue = (function() {
    var queue = [];
    var processing = false;
    var BATCH_SIZE = 3; // Process 3 requests at a time
    var DELAY_BETWEEN_BATCHES = 200; // 500ms delay between batches
    var DELAY_BETWEEN_REQUESTS = 50; // 100ms delay between individual requests in a batch

    function addToQueue(request) {
        return new Promise(function(resolve, reject) {
            queue.push({
                request: request,
                resolve: resolve,
                reject: reject
            });
            processQueue();
        });
    }

    async function processQueue() {
        if (processing || queue.length === 0) return;

        processing = true;

        while (queue.length > 0) {
            // Take a batch from the queue
            var batch = queue.splice(0, BATCH_SIZE);

            // Process batch sequentially with small delays
            for (var i = 0; i < batch.length; i++) {
                var item = batch[i];
                try {
                    var result = await item.request();
                    item.resolve(result);
                } catch (error) {
                    item.reject(error);
                }

                // Small delay between requests in the same batch
                if (i < batch.length - 1) {
                    await sleep(DELAY_BETWEEN_REQUESTS);
                }
            }

            // Delay between batches if there are more items
            if (queue.length > 0) {
                await sleep(DELAY_BETWEEN_BATCHES);
            }
        }

        processing = false;
    }

    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    return {
        add: addToQueue
    };
})();

async function callClaude(userMessage) {
    return AIRequestQueue.add(async function() {
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
    });
}

async function callLlama(userMessage) {
    return AIRequestQueue.add(async function() {
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
    });
}