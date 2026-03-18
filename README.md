# Simple Code Editor

A barebones but pretty Svelte code editor with LSP-based syntax highlighting.

## Features

- ✨ **Clean & Modern UI** - Minimal design with smooth shadows and rounded corners
- 📝 **Editable Plain Text** - Copy, paste, and edit code as plain text
- 🎨 **LSP-Based Syntax Highlighting** - Dynamically highlight code using external LSP JSON payloads
- 🔄 **Perfect Overlay Alignment** - Styled text perfectly overlays the plain text
- 🌓 **Dark Mode Support** - Automatically adapts to system color scheme
- 🎯 **Multiple Token Types** - Supports keywords, strings, numbers, functions, variables, comments, and more

## LSP Payload Format

The syntax highlighting is driven by an external LSP JSON payload with the following format:

```json
[
  { "start": 0, "end": 8, "type": "keyword" },
  { "start": 9, "end": 14, "type": "function" },
  { "start": 15, "end": 19, "type": "variable" }
]
```

Each token object contains:
- `start`: Starting position in the text (inclusive)
- `end`: Ending position in the text (exclusive)
- `type`: Token type that determines the color

## Supported Token Types

- `keyword` - Language keywords (e.g., function, const, let)
- `string` - String literals
- `integer` / `number` - Numeric values
- `function` - Function names
- `variable` - Variable names
- `comment` - Code comments
- `type` - Type annotations
- `operator` - Operators
- `property` - Object properties
- `class` - Class names
- `identifier` - Generic identifiers
- `punctuation` - Punctuation marks

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

The editor component accepts the following props:

```svelte
<CodeEditor 
  initialValue="your code here"
  lspPayload={[{ start: 0, end: 4, type: "keyword" }]}
  onValueChange={(newValue) => console.log(newValue)}
/>
```

## How It Works

The editor uses a clever overlay technique:
1. A transparent textarea handles text input and editing
2. A styled overlay renders the syntax-highlighted code
3. Both elements are perfectly aligned using identical fonts and spacing
4. Scroll events are synchronized between the textarea and overlay

This approach ensures you can copy/paste plain text while viewing beautifully highlighted code!