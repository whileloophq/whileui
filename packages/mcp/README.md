# @thewhileloop/whileui-mcp

An [MCP](https://modelcontextprotocol.io) server that gives AI coding agents the WhileUI
docs and theme tokens for the version installed in your project. It reads the catalog that
ships inside `@thewhileloop/whileui`, so it never describes a different version than the
one your code imports.

## Setup

Start it from the root of a project that has `@thewhileloop/whileui` installed. MCP
clients start servers in the project root by default.

```bash
# Claude Code
claude mcp add whileui -- npx -y @thewhileloop/whileui-mcp
```

Other clients take the same command in their MCP config:

```json
{
  "mcpServers": {
    "whileui": { "command": "npx", "args": ["-y", "@thewhileloop/whileui-mcp"] }
  }
}
```

That is the shape for Cursor (`.cursor/mcp.json`) and Claude Code (`.mcp.json`). VS Code
uses `"servers"` in `.vscode/mcp.json`; Codex uses `[mcp_servers.whileui]` with
`command` and `args` in `.codex/config.toml`.

## Tools

| Tool                 | Returns                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `list_components`    | Every component and block with a one-line summary; filter by category    |
| `get_component_docs` | Props, examples and usage notes for one or more components               |
| `get_theme_tokens`   | The colour token contract with light and dark defaults, or visual tokens |
| `get_guide`          | `composition`, `quick-reference`, `installation` or `theming`            |

Agents without MCP can read the same content as text from
`node_modules/@thewhileloop/whileui/dist/agent/llms.txt`.
