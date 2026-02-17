// index.ts

import { resolveConfig } from './src/config.js';
import { HookManager } from './src/hooks.js';
import type { OpenClawPluginApi } from './src/types.js';

// The main entry point for the OpenClaw plugin.
// This function is called by the OpenClaw host during plugin loading.
export default (api: OpenClawPluginApi, context: { workspace: string }): void => {
  const { pluginConfig, logger } = api;
  const { workspace: openClawWorkspace } = context;

  // 1. Resolve and validate the configuration
  const config = resolveConfig(pluginConfig, logger, openClawWorkspace);

  if (!config) {
    logger.error('Failed to initialize Knowledge Engine: Invalid configuration. The plugin will be disabled.');
    return;
  }

  if (!config.enabled) {
    logger.info('Knowledge Engine is disabled in the configuration.');
    return;
  }

  // 2. Initialize the Hook Manager with the resolved config
  try {
    const hookManager = new HookManager(api, config);
    
    // 3. Register all the event hooks
    hookManager.registerHooks();

    logger.info('Knowledge Engine plugin initialized successfully.');
    
  } catch (err) {
    logger.error('An unexpected error occurred during Knowledge Engine initialization.', err as Error);
  }
};
