import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo } from '@rockcarver/frodo-lib';
import { listLogApiKeys } from '../../ops/LogOps';
import { verboseMessage } from '../../utils/Console';

const { getTokens } = frodo.login;

const program = new FrodoCommand('frodo log key list');

program
  .description('List log API keys.')
  .addOption(
    new Option('-l, --long', 'Long with all fields.').default(false, 'false')
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
      if (await getTokens(true)) {
        verboseMessage(`Listing log API keys...`);
        const outcome = await listLogApiKeys(options.long);
        if (!outcome) process.exitCode = 1;
      } else {
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
