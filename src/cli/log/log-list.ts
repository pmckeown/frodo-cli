import { frodo, state } from '@rockcarver/frodo-lib';

import { provisionCreds } from '../../ops/LogOps';
import { printMessage, verboseMessage } from '../../utils/Console';
import { FrodoCommand } from '../FrodoCommand';

const { getTokens } = frodo.login;
const { getConnectionProfile, saveConnectionProfile } = frodo.conn;
const { getLogSources } = frodo.cloud.log;

const program = new FrodoCommand('frodo log list', ['realm', 'type']);
program
  .description('List available ID Cloud log sources.')
  .action(async (host, user, password, options, command) => {
    command.handleDefaultArgsAndOpts(host, user, password, options, command);
    let saveCredentials = false;
    let foundCredentials = false;
    verboseMessage('Listing available ID Cloud log sources...');

    const conn = await getConnectionProfile();
    if (conn) state.setHost(conn.tenant);

    // log api creds have been supplied as username and password arguments
    if (state.getUsername() && state.getPassword()) {
      verboseMessage(`Using log api credentials from command line.`);
      state.setLogApiKey(state.getUsername());
      state.setLogApiSecret(state.getPassword());
      foundCredentials = true;
    }
    // log api creds from connection profile
    else if (conn && conn.logApiKey != null && conn.logApiSecret != null) {
      verboseMessage(`Using log api credentials from connection profile.`);
      state.setLogApiKey(conn.logApiKey);
      state.setLogApiSecret(conn.logApiSecret);
      foundCredentials = true;
    }
    // log api creds have been supplied via env variables
    else if (state.getLogApiKey() && state.getLogApiSecret()) {
      verboseMessage(`Using log api credentials from environment variables.`);
      foundCredentials = true;
    }
    // no log api creds but got username and password, so can try to create them
    else if (conn && conn.username && conn.password) {
      printMessage(
        `Found admin credentials in connection profile, attempting to create log api credentials...`
      );
      state.setUsername(conn.username);
      state.setPassword(conn.password);
      if (await getTokens(true)) {
        const creds = await provisionCreds();
        state.setLogApiKey(creds.api_key_id as string);
        state.setLogApiSecret(creds.api_key_secret as string);
        foundCredentials = true;
        saveCredentials = true;
      }
      // unable to create credentials
      else {
        printMessage(`Unable to create log api credentials.`);
      }
    }

    if (foundCredentials) {
      const sources = await getLogSources();
      if (sources.length === 0) {
        printMessage(
          "Can't get sources, possible cause - wrong API key or secret",
          'error'
        );
      } else {
        if (saveCredentials) await saveConnectionProfile(state.getHost()); // save new values if they were specified on CLI
        printMessage(`Log sources from ${state.getHost()}`);
        for (const source of sources) {
          printMessage(`${source}`, 'data');
        }
        printMessage(
          'Use any combination of comma separated sources, example:',
          'info'
        );
        printMessage(
          `$ frodo logs tail -c am-core,idm-core ${state.getHost()}`,
          'text'
        );
      }
    }
    // no log api credentials
    else {
      printMessage('No log api credentials found!');
      program.help();
      process.exitCode = 1;
    }
  });

program.parse();
