import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo, state } from '@rockcarver/frodo-lib';
import { printMessage, verboseMessage } from '../../utils/Console';
import {
  importCircleOfTrustFromFile,
  importCirclesOfTrustFromFile,
  importCirclesOfTrustFromFiles,
  importFirstCircleOfTrustFromFile,
} from '../../ops/CirclesOfTrustOps';

const program = new FrodoCommand('frodo saml cot import');

program
  .description('Import SAML circles of trust.')
  .addOption(
    new Option(
      '-i, --cot-id <cot-id>',
      'Circle of trust id. If specified, only one circle of trust is imported and the options -a and -A are ignored.'
    )
  )
  .addOption(
    new Option(
      '-f, --file <file>',
      'Name of the file to import the circle(s) of trust from.'
    )
  )
  .addOption(
    new Option(
      '-a, --all',
      'Import all circles of trust from single file. Ignored with -i.'
    )
  )
  .addOption(
    new Option(
      '-A, --all-separate',
      'Import all circles of trust from separate files (*.cot.saml.json) in the current directory. Ignored with -i or -a.'
    )
  )
  .action(
    // implement program logic inside action handler
    async (host, realm, user, password, options, command) => {
      command.handleDefaultArgsAndOpts(
        host,
        realm,
        user,
        password,
        options,
        command
      );
      // import by id
      if (options.file && options.cotId && (await frodo.login.getTokens())) {
        verboseMessage(
          `Importing circle of trust "${
            options.cotId
          }" into realm "${state.getRealm()}"...`
        );
        const outcome = importCircleOfTrustFromFile(
          options.cotId,
          options.file
        );
        if (!outcome) process.exitCode = 1;
      }
      // --all -a
      else if (options.all && options.file && (await frodo.login.getTokens())) {
        verboseMessage(
          `Importing all circles of trust from a single file (${options.file})...`
        );
        const outcome = importCirclesOfTrustFromFile(options.file);
        if (!outcome) process.exitCode = 1;
      }
      // --all-separate -A
      else if (
        options.allSeparate &&
        !options.file &&
        (await frodo.login.getTokens())
      ) {
        verboseMessage(
          'Importing all circles of trust from separate files (*.saml.json) in current directory...'
        );
        const outcome = importCirclesOfTrustFromFiles();
        if (!outcome) process.exitCode = 1;
      }
      // import first from file
      else if (options.file && (await frodo.login.getTokens())) {
        verboseMessage(
          `Importing first circle of trust from file "${
            options.file
          }" into realm "${state.getRealm()}"...`
        );
        const outcome = importFirstCircleOfTrustFromFile(options.file);
        if (!outcome) process.exitCode = 1;
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
    // end program logic inside action handler
  );

program.parse();
