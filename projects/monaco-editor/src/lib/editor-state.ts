import { InjectionToken } from '@angular/core';

export interface MonacoEditorState {
  loadedMonaco?: Promise<any>;
  monaco?: any;
}

export const MONACO_EDITOR_STATE = new InjectionToken('MONACO_EDITOR_STATE');

export function editorStateProviderFactory(config: any) {
  const editorState: MonacoEditorState = {};
  editorState.loadedMonaco = new Promise<void>(function(resolve: any) {
    const baseUrl = config.baseUrl || './assets';
    const onGotAmdLoader = function() {
      (window as any).require.config({ paths: {vs: `${baseUrl}/monaco/vs`} });
      (window as any).require(['vs/editor/editor.main'], function() {
        if (typeof config.onMonacoLoad === 'function') {
          config.onMonacoLoad((window as any).monaco);
        }
        editorState.monaco = (window as any).monaco;
        resolve();
      });
    };
    if (!(window as any).require) {
      const loaderScript: HTMLScriptElement = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = `${baseUrl}/monaco/vs/loader.js`;
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    }
  });
  return editorState;
}
