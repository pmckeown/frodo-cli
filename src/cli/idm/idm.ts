import { FrodoStubCommand } from '../FrodoCommand';
import CountCmd from './idm-count.js';
import ExportCmd from './idm-export.js';
import ImportCmd from './idm-import.js';
import ListCmd from './idm-list.js';

export default function setup() {
  const program = new FrodoStubCommand('idm').description(
    'Manage IDM configuration.'
  );

  program.addCommand(ListCmd().name('list'));

  program.addCommand(ExportCmd().name('export'));

  program.addCommand(ImportCmd().name('import'));

  program.addCommand(CountCmd().name('count'));

  return program;
}
