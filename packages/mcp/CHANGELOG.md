# @thewhileloop/whileui-mcp

## 0.1.0

### Minor Changes

- 4019cba: First release. An MCP server that answers from the catalog inside the installed
  `@thewhileloop/whileui`: `list_components`, `get_component_docs`, `get_theme_tokens` and
  `get_guide`. A name it does not know gets the closest components, including familiar
  names from other libraries (`TextField`, `Snackbar`, `BottomSheet`), and a copy-paste
  template comes with the link to copy it from. Run it from a project that has WhileUI installed:
  `claude mcp add whileui -- npx -y @thewhileloop/whileui-mcp`.
