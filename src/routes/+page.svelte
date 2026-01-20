<script>
	import CodeEditor from '$lib/CodeEditor.svelte';

	// Example code to display
	let code = $state(`function greet(name) {
  return "Hello, " + name + "!";
}

let count = 42;
const message = greet("World");
console.log(message);`);

	// Example LSP payload
	// Format: { start: number, end: number, type: string }
	let lspTokens = $state([
		// "function" keyword
		{ start: 0, end: 8, type: 'keyword' },
		// "greet" function name
		{ start: 9, end: 14, type: 'function' },
		// "name" parameter
		{ start: 15, end: 19, type: 'variable' },
		// "return" keyword
		{ start: 27, end: 33, type: 'keyword' },
		// "Hello, " string
		{ start: 34, end: 43, type: 'string' },
		// "name" variable
		{ start: 46, end: 50, type: 'variable' },
		// "!" string
		{ start: 53, end: 56, type: 'string' },
		
		// "let" keyword
		{ start: 60, end: 63, type: 'keyword' },
		// "count" variable
		{ start: 64, end: 69, type: 'variable' },
		// 42 number
		{ start: 72, end: 74, type: 'integer' },
		
		// "const" keyword
		{ start: 76, end: 81, type: 'keyword' },
		// "message" variable
		{ start: 82, end: 89, type: 'variable' },
		// "greet" function call
		{ start: 92, end: 97, type: 'function' },
		// "World" string
		{ start: 98, end: 105, type: 'string' },
		
		// "console" object
		{ start: 108, end: 115, type: 'variable' },
		// "log" method
		{ start: 116, end: 119, type: 'function' },
		// "message" variable
		{ start: 120, end: 127, type: 'variable' }
	]);

	let customLspJson = $state('');
	
	$effect(() => {
		customLspJson = JSON.stringify(lspTokens, null, 2);
	});

	let errorMessage = $state('');

	function updateTokens() {
		try {
			const parsed = JSON.parse(customLspJson);
			lspTokens = parsed;
			errorMessage = '';
		} catch (e) {
			errorMessage = `Invalid JSON: ${e instanceof Error ? e.message : 'Unknown error'}`;
		}
	}

	function handleCodeChange(newValue) {
		code = newValue;
	}
</script>

<svelte:head>
	<title>Simple Code Editor</title>
</svelte:head>

<main>
	<div class="container">
		<header>
			<h1>Simple Code Editor</h1>
			<p>A barebones Svelte code editor with LSP-based syntax highlighting</p>
		</header>

		<div class="editor-section">
			<h2>Code Editor</h2>
			<p class="hint">Try copying and pasting code! The plain text is editable while syntax highlighting overlays perfectly.</p>
			<CodeEditor 
				initialValue={code} 
				lspPayload={lspTokens}
				onValueChange={handleCodeChange}
			/>
		</div>

		<div class="controls-section">
			<h2>LSP Token Configuration</h2>
			<p class="hint">Modify the JSON payload to change syntax highlighting. Format: <code>{"{ start, end, type }"}</code></p>
			<textarea 
				bind:value={customLspJson}
				class="json-input"
				placeholder="Enter LSP JSON payload..."
			></textarea>
			{#if errorMessage}
				<div class="error-message">{errorMessage}</div>
			{/if}
			<button onclick={updateTokens}>Update Highlighting</button>
		</div>

		<div class="info-section">
			<h3>Supported Token Types</h3>
			<div class="token-grid">
				<div class="token-example"><span class="token-keyword">keyword</span></div>
				<div class="token-example"><span class="token-string">string</span></div>
				<div class="token-example"><span class="token-integer">integer/number</span></div>
				<div class="token-example"><span class="token-function">function</span></div>
				<div class="token-example"><span class="token-variable">variable</span></div>
				<div class="token-example"><span class="token-comment">comment</span></div>
				<div class="token-example"><span class="token-type">type</span></div>
				<div class="token-example"><span class="token-operator">operator</span></div>
				<div class="token-example"><span class="token-property">property</span></div>
				<div class="token-example"><span class="token-class">class</span></div>
			</div>
		</div>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background: #f0f2f5;
		color: #1a1a1a;
	}

	main {
		padding: 20px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	header {
		text-align: center;
		padding: 20px 0;
	}

	h1 {
		margin: 0 0 10px 0;
		font-size: 2.5rem;
		color: #2d3748;
		font-weight: 700;
	}

	h2 {
		margin: 0 0 12px 0;
		font-size: 1.5rem;
		color: #2d3748;
		font-weight: 600;
	}

	h3 {
		margin: 0 0 16px 0;
		font-size: 1.2rem;
		color: #2d3748;
		font-weight: 600;
	}

	header p {
		margin: 0;
		font-size: 1.1rem;
		color: #718096;
	}

	.editor-section {
		background: white;
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.controls-section {
		background: white;
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.info-section {
		background: white;
		padding: 24px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.hint {
		margin: 0 0 16px 0;
		color: #718096;
		font-size: 0.95rem;
	}

	.hint code {
		background: #edf2f7;
		padding: 2px 6px;
		border-radius: 4px;
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 0.9em;
	}

	.error-message {
		color: #e53e3e;
		background: #fff5f5;
		border: 1px solid #fc8181;
		padding: 12px;
		border-radius: 6px;
		margin-bottom: 12px;
		font-size: 0.9rem;
	}

	.json-input {
		width: 100%;
		min-height: 200px;
		padding: 12px;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 13px;
		line-height: 1.5;
		resize: vertical;
		margin-bottom: 12px;
	}

	.json-input:focus {
		outline: none;
		border-color: #4299e1;
	}

	button {
		background: #4299e1;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #3182ce;
	}

	button:active {
		background: #2c5282;
	}

	.token-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 12px;
	}

	.token-example {
		padding: 12px;
		background: #f7fafc;
		border-radius: 6px;
		text-align: center;
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 14px;
		border: 1px solid #e2e8f0;
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			background: #1a202c;
			color: #e2e8f0;
		}

		h1, h2, h3 {
			color: #f7fafc;
		}

		header p, .hint {
			color: #a0aec0;
		}

		.editor-section,
		.controls-section,
		.info-section {
			background: #2d3748;
		}

		.json-input {
			background: #1a202c;
			border-color: #4a5568;
			color: #e2e8f0;
		}

		.json-input:focus {
			border-color: #4299e1;
		}

		.error-message {
			color: #fc8181;
			background: #2d3748;
			border-color: #e53e3e;
		}

		.hint code {
			background: #4a5568;
			color: #e2e8f0;
		}

		.token-example {
			background: #1a202c;
			border-color: #4a5568;
		}
	}
</style>
