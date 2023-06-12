import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo, state } from '@rockcarver/frodo-lib';
import { verboseMessage } from '../../utils/Console';

const { getTokens } = frodo.login;
const { removeCustomDomain } = frodo.realm;

const program = new FrodoCommand('frodo realm remove-custom-domain');

program
  .description('Remove custom domain (realm DNS alias).')
  .addOption(
    new Option(
      '-d, --domain <name>',
      'Custom DNS domain name.'
    ).makeOptionMandatory()
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
        verboseMessage(
          `Removing custom DNS domain ${
            options.domain
          } from realm ${state.getRealm()}...`
        );
        await removeCustomDomain(state.getRealm(), options.domain);
      } else {
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
