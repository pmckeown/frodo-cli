import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { v4 as uuidv4 } from 'uuid';
import Table from 'cli-table3';
import { Authenticate, Admin, state } from '@rockcarver/frodo-lib';
import { printMessage } from '../../utils/Console.js';

const { getTokens } = Authenticate;
const { createLongLivedToken, createOAuth2ClientWithAdminPrivileges } = Admin;

const program = new FrodoCommand(
  'frodo admin create-oauth2-client-with-admin-privileges'
);

program
  .description('Create an oauth2 client with admin privileges.')
  .addOption(new Option('--client-id [id]', 'Client id.'))
  .addOption(new Option('--client-secret [secret]', 'Client secret.'))
  .addOption(
    new Option(
      '--llt',
      'Create a long-lived token and store it in a secret. The default secret name is esv-admin-token and the default token lifetime is 315,360,000 seconds (10 years). Both can be overwritten with the --llt-esv and --llt-ttl options.'
    )
  )
  .addOption(
    new Option(
      '--llt-scope [scope]',
      'Request the following scope(s). This option only applies if used with the --llt option.'
    ).default('fr:idm:*', 'fr:idm:*')
  )
  .addOption(
    new Option(
      '--llt-esv [esv]',
      'Name of the secret to store the token in. This option only applies if used with the --llt option.'
    ).default('esv-admin-token', 'esv-admin-token')
  )
  .addOption(
    new Option(
      '--llt-ttl [ttl]',
      'Token lifetime (seconds). This option only applies if used with the --llt option.'
    ).default(315360000, '315,360,000 seconds (10 years)')
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
        printMessage(
          `Creating oauth2 client with admin privileges in realm "${state.getRealm()}"...`
        );
        let clientId = uuidv4();
        let clientSecret = uuidv4();
        if (options.clientId) {
          clientId = options.clientId;
        }
        if (options.clientSecret) {
          clientSecret = options.clientSecret;
        }
        try {
          await createOAuth2ClientWithAdminPrivileges(clientId, clientSecret);
        } catch (error) {
          printMessage(error, 'error');
        }
        const table = new Table({
          chars: {
            top: '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            bottom: '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            left: '',
            'left-mid': '',
            mid: '',
            'mid-mid': '',
            right: '',
            'right-mid': '',
          },
          style: { 'padding-left': 0, 'padding-right': 0 },
          wordWrap: true,
        });
        if (options.llt) {
          try {
            const response = await createLongLivedToken(
              clientId,
              clientSecret,
              options.scope,
              options.lltEsv,
              options.lltTtl
            );
            table.push(['Secret Name'['brightCyan'], response.secret]);
            table.push(['Scope'['brightCyan'], response.scope]);
            // table.push(['Token Lifetime'.brightCyan, response.expires_in]);
            table.push(['Expires'['brightCyan'], response.expires_on]);
          } catch (error) {
            printMessage(error, 'error');
          }
        }
        table.push(['Client ID'['brightCyan'], clientId]);
        table.push(['Client Secret'['brightCyan'], clientSecret]);
        printMessage(table.toString());
      } else {
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
