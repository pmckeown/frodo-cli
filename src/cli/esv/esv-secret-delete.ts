import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo } from '@rockcarver/frodo-lib';
import { printMessage, verboseMessage } from '../../utils/Console.js';
import { deleteSecret, deleteSecrets } from '../../ops/SecretsOps';

const { getTokens } = frodo.login;

const program = new FrodoCommand('frodo esv secret delete');

program
  .description('Delete secrets.')
  .addOption(
    new Option(
      '-i, --secret-id <secret-id>',
      'Secret id. If specified, -a is ignored.'
    )
  )
  .addOption(
    new Option('-a, --all', 'Delete all secrets in a realm. Ignored with -i.')
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
      if (options.secretId && (await getTokens())) {
        verboseMessage('Deleting secret...');
        deleteSecret(options.secretId);
      }
      // --all -a
      else if (options.all && (await getTokens())) {
        verboseMessage('Deleting all secrets...');
        deleteSecrets();
      }
      // unrecognized combination of options or no options
      else {
        printMessage('Unrecognized combination of options or no options...');
        program.help();
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
