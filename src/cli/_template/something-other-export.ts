import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo } from '@rockcarver/frodo-lib';

const program = new FrodoCommand('frodo something other export');

program
  .description('Export other.')
  .addOption(
    new Option(
      '-i, --other-id <other-id>',
      '[Other] id. If specified, -a and -A are ignored.'
    )
  )
  .addOption(new Option('-f, --file <file>', 'Name of the export file.'))
  .addOption(
    new Option(
      '-a, --all',
      'Export all [others] to a single file. Ignored with -i.'
    )
  )
  .addOption(
    new Option(
      '-A, --all-separate',
      'Export all [others] to separate files (*.[other].json) in the current directory. Ignored with -i or -a.'
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
      if (await frodo.login.getTokens()) {
        // code goes here
      } else {
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
