import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo, state } from '@rockcarver/frodo-lib';
import { printMessage, verboseMessage } from '../../utils/Console';
import {
  importFirstThemeFromFile,
  importThemeById,
  importThemeByName,
  importThemesFromFile,
  importThemesFromFiles,
} from '../../ops/ThemeOps';

const program = new FrodoCommand('frodo theme import');

program
  .description('Import themes.')
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
      '-f, --file <file>',
      'Name of the file to import the theme(s) from.'
    )
  )
  .addOption(
    new Option(
      '-a, --all',
      'Import all the themes from single file. Ignored with -n or -i.'
    )
  )
  .addOption(
    new Option(
      '-A, --all-separate',
      'Import all the themes from separate files (*.json) in the current directory. Ignored with -n or -i or -a.'
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
      // import by name
      if (
        options.file &&
        options.themeName &&
        (await frodo.login.getTokens())
      ) {
        verboseMessage(
          `Importing theme with name "${
            options.themeName
          }" into realm "${state.getRealm()}"...`
        );
        importThemeByName(options.themeName, options.file);
      }
      // import by id
      else if (
        options.file &&
        options.themeId &&
        (await frodo.login.getTokens())
      ) {
        verboseMessage(
          `Importing theme with id "${
            options.themeId
          }" into realm "${state.getRealm()}"...`
        );
        importThemeById(options.themeId, options.file);
      }
      // --all -a
      else if (options.all && options.file && (await frodo.login.getTokens())) {
        verboseMessage(
          `Importing all themes from a single file (${options.file})...`
        );
        importThemesFromFile(options.file);
      }
      // --all-separate -A
      else if (
        options.allSeparate &&
        !options.file &&
        (await frodo.login.getTokens())
      ) {
        verboseMessage(
          'Importing all themes from separate files in current directory...'
        );
        importThemesFromFiles();
      }
      // import single theme from file
      else if (options.file && (await frodo.login.getTokens())) {
        verboseMessage(
          `Importing first theme from file "${
            options.file
          }" into realm "${state.getRealm()}"...`
        );
        importFirstThemeFromFile(options.file);
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
