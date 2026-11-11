#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadCatalog } from './catalog.js';
import { createServer } from './server.js';

// MCP clients start the server in the project root, which is where WhileUI is installed.
const server = createServer(loadCatalog(process.cwd()));
await server.connect(new StdioServerTransport());
