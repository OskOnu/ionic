import { join } from 'path';

import { task } from 'gulp';

import { ES_2015, PROJECT_ROOT } from '../constants';
import { createTempTsConfig, getFolderInfo, runAppScriptsServe } from '../util';

task('e2e.watch', ['e2e.prepare'], (done: Function) => {
  const folderInfo = getFolderInfo();
  if (!folderInfo || !folderInfo.componentName || !folderInfo.componentTest) {
    done(new Error(`Usage: gulp e2e.watch --folder nav/basic`));
  }

  serveTest(folderInfo).then(() => {
    done();
  }).catch((err: Error) => {
    done(err);
  });
});

function serveTest(folderInfo: any) {

  const ionicAngularDir = join(PROJECT_ROOT, 'src');
  const srcTestRoot = join(PROJECT_ROOT, 'src', 'components', folderInfo.componentName, 'test', folderInfo.componentTest);
  const distTestRoot = join(PROJECT_ROOT, 'dist', 'e2e', 'components', folderInfo.componentName, 'test', folderInfo.componentTest);
  const includeGlob = [ join(ionicAngularDir, '**', '*.ts')];
  const pathToWriteFile = join(distTestRoot, 'tsconfig.json');
  const pathToReadFile = join(PROJECT_ROOT, 'tsconfig.json');

  createTempTsConfig(includeGlob, ES_2015, ES_2015, pathToReadFile, pathToWriteFile, { removeComments: true});

  const sassConfigPath = join('scripts', 'e2e', 'sass.config.js');
  const copyConfigPath = join('scripts', 'e2e', 'copy.config.js');

  const appEntryPoint = join(srcTestRoot, 'main.ts');
  const appNgModulePath = join(srcTestRoot, 'app.module.ts');
  const distDir = join(distTestRoot, 'www');

  return runAppScriptsServe(folderInfo.componentName + '/' + folderInfo.componentTest, appEntryPoint, appNgModulePath, ionicAngularDir, distDir, pathToWriteFile, ionicAngularDir, sassConfigPath, copyConfigPath, null);
}
