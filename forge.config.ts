import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  // buildIdentifier: process.env.IS_BETA ? 'beta' : 'prod',
  packagerConfig: {
    asar: true,
    all: true,
    osxSign: {},
    // osxNotarize: {},
    windowsSign: {},
    appCategoryType: 'public.app-category.graphics-design', //public.app-category.utilities
    // appCopyright: '',
    // icon: '' // mac: .icns, windows: .ico, linux: needs to be set in BrowserWindow
    // out: 'out/dir',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      authors: 'Electron contributors'
    }, ['win32']),
    new MakerZIP({}, ['darwin']), 
    new MakerRpm({}, ['linux']), 
    new MakerDeb({}, ['linux'])
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  // publishers: [{
      // name: '@electron-forge/publisher-github',
      // config: {
      //   repository: {
      //     owner: 'electron',
      //     name: 'fiddle'
      //   },
      //   draft: true,
      //   prerelease: false,
      //   generateReleaseNotes: true
      // }
    //}],
  // hooks: { /* ... */ },
  // buildIdentifier: 'my-build',
  // outDir: 'desired/outpath'
};

export default config;
