# AI Configuration Guide

The AI players in "The Evolution of Trust" can be configured to use different AI backends. This guide explains how to set up API keys and endpoints.

## Quick Start

### Option 1: Using a Config File (Recommended)
   ```

1. Edit `js/config.js` and add your API keys:
   ```javascript
   window.AIConfig = {
       // Claude API Configuration
       CLAUDE_API_KEY: 'your-actual-api-key-here',
       CLAUDE_MODEL: 'claude-sonnet-4-20250514',

       // Ollama/Llama Configuration
       OLLAMA_ENDPOINT: 'http://localhost:11434/api/chat',
       OLLAMA_MODEL: 'qwen2.5:14b'
   };
   ```

3. The `js/config.js` file is already in `.gitignore`, so your API keys won't be committed to git.

### Option 2: Using Browser localStorage

You can also set configuration values in your browser's console or localStorage:

```javascript
// Set Claude API key
localStorage.setItem('CLAUDE_API_KEY', 'your-api-key-here');

// Set Ollama endpoint
localStorage.setItem('OLLAMA_ENDPOINT', 'http://localhost:11434/api/chat');
localStorage.setItem('OLLAMA_MODEL', 'qwen2.5:14b');

// Then reload the page
location.reload();
```

## Configuration Options

### Claude API

- **CLAUDE_API_KEY**: Your Anthropic API key (get one at https://console.anthropic.com/)
- **CLAUDE_MODEL**: The Claude model to use (default: `claude-sonnet-4-20250514`)

### Ollama/Llama

- **OLLAMA_ENDPOINT**: The URL of your Ollama API endpoint (default: `http://192.168.1.249:11434/api/chat`)
- **OLLAMA_MODEL**: The Ollama model to use (default: `qwen2.5:14b`)

## Setting Up Ollama

If you want to run the AI players locally using Ollama:

1. Install Ollama from https://ollama.ai/
2. Pull the model you want to use:
   ```bash
   ollama pull qwen2.5:14b
   ```
3. Start the Ollama server (it usually runs automatically)
4. Update the `OLLAMA_ENDPOINT` to point to your local server (usually `http://localhost:11434/api/chat`)

## Request Batching

To prevent overwhelming the AI API, requests are automatically batched and rate-limited:

- **Batch Size**: 3 requests processed at a time
- **Delay Between Batches**: 200ms
- **Delay Between Requests**: 50ms

These settings are configured in `js/lib/AI.js` and can be adjusted if needed.

## Troubleshooting

### "Claude API key not configured" error

Make sure you've set the `CLAUDE_API_KEY` either in `js/config.js` or in localStorage.

### Connection errors

- For Ollama: Make sure the Ollama server is running and the endpoint URL is correct
- For Claude: Check that your API key is valid and you have credits available

If you're running locally, make sure you're using an HTTP server (not just opening the HTML file directly).
