#!/usr/bin/env node

/**
 * Convex MCP Test Script
 * Tests if the official Convex MCP configuration is working
 */

console.log('🔧 Testing Official Convex MCP Configuration');
console.log('');

// Test MCP configuration file
console.log('� Configuration Files:');
const fs = await import('fs');
const path = await import('path');

const mcpConfigPath = '.vscode/mcp.json';
try {
  const mcpConfigExists = fs.existsSync(mcpConfigPath);
  console.log(`VS Code MCP config: ${mcpConfigExists ? '✅ EXISTS' : '❌ MISSING'}`);
  
  if (mcpConfigExists) {
    const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    console.log('✅ MCP Config content:', JSON.stringify(config, null, 2));
  }
} catch (error) {
  console.log('❌ Error reading MCP config:', error.message);
}

// Test Convex instructions file
const instructionsPath = '.github/instructions/convex.instructions.md';
try {
  const instructionsExist = fs.existsSync(instructionsPath);
  console.log(`Copilot instructions: ${instructionsExist ? '✅ EXISTS' : '❌ MISSING'}`);
} catch (error) {
  console.log('❌ Error checking instructions:', error.message);
}

console.log('');

// Test Convex CLI availability
console.log('� Testing Convex CLI:');
try {
  const { spawn } = await import('child_process');
  
  console.log('Testing: npx convex@latest mcp start --help');
  const child = spawn('npx', ['-y', 'convex@latest', 'mcp', 'start', '--help'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Convex MCP server is available');
      if (output.includes('Start the Model Context Protocol server')) {
        console.log('✅ Convex MCP help text confirms functionality');
      }
    } else {
      console.log('❌ Convex MCP server test failed with code:', code);
    }
    
    console.log('');
    console.log('🎯 How to verify MCP is working:');
    console.log('1. ✅ Restart VS Code completely');
    console.log('2. 🔍 Open a Convex file (like convex/schema.ts)');
    console.log('3. 💬 Open GitHub Copilot Chat');
    console.log('4. 🔧 Look for "Convex" in the available tools/models');
    console.log('5. 💡 Ask questions like:');
    console.log('   - "What tables are in my Convex schema?"');
    console.log('   - "Show me my Convex functions"');
    console.log('   - "Evaluate my Convex schema and suggest improvements"');
    console.log('');
    console.log('📋 If MCP is working, you should see much better Convex-specific suggestions!');
  });

} catch (error) {
  console.log('❌ Error testing Convex CLI:', error.message);
}
