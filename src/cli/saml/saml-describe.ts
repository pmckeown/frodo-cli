import { FrodoCommand } from '../FrodoCommand';
import { Option } from 'commander';
import { frodo, state } from '@rockcarver/frodo-lib';
import { verboseMessage } from '../../utils/Console';
import { describeSaml2Provider } from '../../ops/Saml2Ops';

const program = new FrodoCommand('frodo saml describe');

program
  .description('Describe the configuration of an entity provider.')
  .addOption(new Option('-i, --entity-id <entity-id>', 'Entity id.'))
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
        verboseMessage(
          `Describing SAML entity provider ${
            options.entityId
          } in realm "${state.getRealm()}"...`
        );
        describeSaml2Provider(options.entityId);
      } else {
        process.exitCode = 1;
      }
    }
    // end command logic inside action handler
  );

program.parse();
