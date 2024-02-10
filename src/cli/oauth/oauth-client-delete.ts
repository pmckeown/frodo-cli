import { Option } from 'commander';

import { getTokens } from '../../ops/AuthenticateOps';
import { FrodoCommand } from '../FrodoCommand';

const program = new FrodoCommand('frodo oauth client delete');

program
  .description('Delete OAuth2 clients.')
  .addOption(
    new Option(
      '-i, --app-id <id>',
      'OAuth2 application id/name. If specified, -a and -A are ignored.'
    )
  )
  .addOption(
    new Option('-a, --all', 'Delete all cmds in a realm. Ignored with -i.')
  )
  .addOption(
    new Option(
      '--no-deep',
      'No deep delete. This leaves orphaned configuration artifacts behind.'
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
      if (await getTokens()) {
        // code goes here
      } else {
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
