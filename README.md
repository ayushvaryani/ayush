# ayush

## MCP servers

This repo ships a project-scoped MCP configuration in [`.mcp.json`](.mcp.json).

### 21st.dev (Magic MCP)

- **Transport:** HTTP (streamable)
- **URL:** `https://21st.dev/api/mcp`
- **Auth:** `x-api-key` header, resolved from the `API_KEY_21ST` environment variable

Setup:

```bash
export API_KEY_21ST=<your 21st.dev API key>
```

Then start Claude Code in this repo and approve the project MCP server when
prompted. Verify with:

```bash
claude mcp list
```

The equivalent one-off registration (user scope) is:

```bash
claude mcp add --transport http 21st https://21st.dev/api/mcp --header "x-api-key: $API_KEY_21ST"
```
