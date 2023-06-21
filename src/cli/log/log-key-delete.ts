import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo } from '@rockcarver/frodo-lib';
import { printMessage, verboseMessage } from '../../utils/Console';
import { deleteLogApiKey, deleteLogApiKeys } from '../../ops/LogOps';

const program = new FrodoCommand('frodo log key delete');

program
  .description('Delete log API keys.')
  .addOption(
    new Option('-i, --key-id <key-id>', 'Key id. Regex if specified with -a.')
  )
  .addOption(
    new Option(
      '-a, --all',
      'Delete all keys. Optionally specify regex filter -i.'
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
      // delete by id
      if (options.keyId && (await frodo.login.getTokens(true))) {
        verboseMessage(`Deleting key ${options.keyId}`);
        deleteLogApiKey(options.keyId);
      }
      // --all -a
      else if (options.all && (await frodo.login.getTokens(true))) {
        verboseMessage('Deleting keys...');
        deleteLogApiKeys();
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
