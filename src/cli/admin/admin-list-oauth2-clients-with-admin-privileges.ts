import { FrodoCommand } from '../FrodoCommand';
import { frodo, state } from '@rockcarver/frodo-lib';
import { printMessage } from '../../utils/Console.js';

const program = new FrodoCommand(
  'frodo admin list-oauth2-clients-with-admin-privileges'
);

program.description('List oauth2 clients with admin privileges.').action(
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
      printMessage(
        `Listing oauth2 clients with admin privileges in realm "${state.getRealm()}"...`
      );
      const adminClients = await frodo.admin.listOAuth2AdminClients();
      adminClients.sort((a, b) => a.localeCompare(b));
      adminClients.forEach((item) => {
        printMessage(`${item}`);
      });
    } else {
      process.exitCode = 1;
    }
  }
  // end command logic inside action handler
);

program.parse();
