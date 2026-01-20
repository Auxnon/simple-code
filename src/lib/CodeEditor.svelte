<script>
	/**
	 * @typedef {Object} Token
	 * @property {number} start - Start position in the text
	 * @property {number} end - End position in the text
	 * @property {string} type - Token type (keyword, integer, string, etc.)
	 */

	/** @type {string} */
	let value = $state('');

	/** @type {Token[]} */
	let tokens = $state([]);

	// Expose value and tokens as props
	let { 
		initialValue = '', 
		lspPayload = [],
		onValueChange = (/** @type {string} */ newValue) => {}
	} = $props();

	$effect(() => {
		value = initialValue;
		tokens = lspPayload;
	});

	/**
	 * Renders the code with syntax highlighting based on LSP tokens
	 * @param {string} text
	 * @param {Token[]} tokenList
	 * @returns {string} HTML string with highlighted syntax
	 */
	function renderHighlightedCode(text, tokenList) {
		if (!tokenList || tokenList.length === 0) {
			return escapeHtml(text);
		}

		// Sort tokens by start position
		const sortedTokens = [...tokenList].sort((a, b) => a.start - b.start);
		
		let result = '';
		let currentPos = 0;

		for (const token of sortedTokens) {
			// Skip tokens that overlap with already processed text
			if (token.start < currentPos) {
				continue;
			}

			// Add any text before this token
			if (token.start > currentPos) {
				result += escapeHtml(text.slice(currentPos, token.start));
			}

			// Add the highlighted token
			const tokenText = text.slice(token.start, token.end);
			result += `<span class="token-${token.type}">${escapeHtml(tokenText)}</span>`;
			
			currentPos = token.end;
		}

		// Add any remaining text
		if (currentPos < text.length) {
			result += escapeHtml(text.slice(currentPos));
		}

		return result;
	}

	/**
	 * Escape HTML special characters
	 * @param {string} text
	 * @returns {string}
	 */
	function escapeHtml(text) {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	/**
	 * Handle input changes
	 * @param {Event} e
	 */
	function handleInput(e) {
		const target = /** @type {HTMLTextAreaElement} */ (e.target);
		value = target.value;
		onValueChange(value);
	}

	/** @type {HTMLDivElement | null} */
	let highlightOverlay = $state(null);

	/**
	 * Synchronize scroll between textarea and highlight overlay
	 * @param {Event} e
	 */
	function handleScroll(e) {
		const target = /** @type {HTMLTextAreaElement} */ (e.target);
		if (highlightOverlay) {
			highlightOverlay.scrollTop = target.scrollTop;
			highlightOverlay.scrollLeft = target.scrollLeft;
		}
	}
</script>

<div class="code-editor">
	<div class="highlight-overlay" aria-hidden="true" bind:this={highlightOverlay}>
		<pre><code>{@html renderHighlightedCode(value, tokens)}</code></pre>
	</div>
	<textarea
		value={value}
		oninput={handleInput}
		onscroll={handleScroll}
		spellcheck="false"
		placeholder="Type or paste your code here..."
	></textarea>
</div>

<style>
	.code-editor {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 400px;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	textarea,
	.highlight-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 16px;
		border: none;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		font-size: 14px;
		line-height: 1.6;
		white-space: pre;
		word-wrap: normal;
		overflow-wrap: normal;
		overflow: auto;
		tab-size: 4;
		-moz-tab-size: 4;
	}

	textarea {
		color: transparent;
		caret-color: #333;
		background: transparent;
		resize: none;
		outline: none;
		z-index: 2;
	}

	.highlight-overlay {
		background: #f8f9fa;
		color: #333;
		pointer-events: none;
		z-index: 1;
	}

	.highlight-overlay pre {
		margin: 0;
		padding: 0;
	}

	.highlight-overlay code {
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
	}

	/* Syntax highlighting colors */
	:global(.token-keyword) {
		color: #d73a49;
		font-weight: 600;
	}

	:global(.token-string) {
		color: #22863a;
	}

	:global(.token-integer),
	:global(.token-number) {
		color: #005cc5;
	}

	:global(.token-comment) {
		color: #6a737d;
		font-style: italic;
	}

	:global(.token-function) {
		color: #6f42c1;
		font-weight: 500;
	}

	:global(.token-variable) {
		color: #e36209;
	}

	:global(.token-type) {
		color: #005cc5;
		font-weight: 500;
	}

	:global(.token-operator) {
		color: #d73a49;
	}

	:global(.token-punctuation) {
		color: #24292e;
	}

	:global(.token-property) {
		color: #005cc5;
	}

	:global(.token-class) {
		color: #6f42c1;
		font-weight: 600;
	}

	:global(.token-identifier) {
		color: #24292e;
	}

	/* Dark mode friendly colors */
	@media (prefers-color-scheme: dark) {
		textarea {
			caret-color: #f0f0f0;
		}

		.highlight-overlay {
			background: #1e1e1e;
			color: #d4d4d4;
		}

		:global(.token-keyword) {
			color: #c586c0;
		}

		:global(.token-string) {
			color: #ce9178;
		}

		:global(.token-integer),
		:global(.token-number) {
			color: #b5cea8;
		}

		:global(.token-comment) {
			color: #6a9955;
		}

		:global(.token-function) {
			color: #dcdcaa;
		}

		:global(.token-variable) {
			color: #9cdcfe;
		}

		:global(.token-type) {
			color: #4ec9b0;
		}

		:global(.token-operator) {
			color: #c586c0;
		}

		:global(.token-punctuation) {
			color: #d4d4d4;
		}

		:global(.token-property) {
			color: #9cdcfe;
		}

		:global(.token-class) {
			color: #4ec9b0;
		}

		:global(.token-identifier) {
			color: #d4d4d4;
		}
	}
</style>
