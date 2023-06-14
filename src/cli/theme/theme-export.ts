import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo, state } from '@rockcarver/frodo-lib';
import { printMessage, verboseMessage } from '../../utils/Console';
import {
  exportThemeById,
  exportThemeByName,
  exportThemesToFile,
  exportThemesToFiles,
} from '../../ops/ThemeOps';

const program = new FrodoCommand('frodo theme export');

program
  .description('Export themes.')
  .addOption(
    new Option(
      '-n, --theme-name <name>',
      'Name of the theme. If specified, -a and -A are ignored.'
    )
  )
  .addOption(
    new Option(
      '-i, --theme-id <uuid>',
      'Uuid of the theme. If specified, -a and -A are ignored.'
    )
  )
  .addOption(
    new Option(
      '-f, --file [file]',
      'Name of the file to write the exported theme(s) to. Ignored with -A.'
    )
  )
  .addOption(
    new Option(
      '-a, --all',
      'Export all the themes in a realm to a single file. Ignored with -n and -i.'
    )
  )
  .addOption(
    new Option(
      '-A, --all-separate',
      'Export all the themes in a realm as separate files <theme name>.theme.json. Ignored with -n, -i, and -a.'
    )
  )
  .action(
    // implement command logic inside action handler
    async (host, realm, user, password, options, command) => {
      command.handleDefaultArgsAndOpts(
        host,
        realm,
        user,
        password,
        options,
        command
      );
      // export by name
      if (options.themeName && (await frodo.login.getTokens())) {
        verboseMessage(
          `Exporting theme "${
            options.themeName
          }" from realm "${state.getRealm()}"...`
        );
        exportThemeByName(options.themeName, options.file);
      }
      // export by id
      else if (options.themeId && (await frodo.login.getTokens())) {
        verboseMessage(
          `Exporting theme "${
            options.themeId
          }" from realm "${state.getRealm()}"...`
        );
        exportThemeById(options.themeId, options.file);
      }
      // --all -a
      else if (options.all && (await frodo.login.getTokens())) {
        verboseMessage('Exporting all themes to a single file...');
        exportThemesToFile(options.file);
      }
      // --all-separate -A
      else if (options.allSeparate && (await frodo.login.getTokens())) {
        verboseMessage('Exporting all themes to separate files...');
        exportThemesToFiles();
      }
      // unrecognized combination of options or no options
      else {
        printMessage(
          'Unrecognized combination of options or no options...',
          'error'
        );
        program.help();
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
