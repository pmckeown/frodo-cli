/**
 * Follow this process to write e2e tests for the CLI project:
 *
 * 1. Test if all the necessary mocks for your tests already exist.
 *    In mock mode, run the command you want to test with the same arguments
 *    and parameters exactly as you want to test it, for example:
 *
 *    $ FRODO_MOCK=1 frodo conn save https://openam-frodo-dev.forgeblocks.com/am volker.scheuber@forgerock.com Sup3rS3cr3t!
 *
 *    If your command completes without errors and with the expected results,
 *    all the required mocks already exist and you are good to write your
 *    test and skip to step #4.
 *
 *    If, however, your command fails and you see errors like the one below,
 *    you know you need to record the mock responses first:
 *
 *    [Polly] [adapter:node-http] Recording for the following request is not found and `recordIfMissing` is `false`.
 *
 * 2. Record mock responses for your exact command.
 *    In mock record mode, run the command you want to test with the same arguments
 *    and parameters exactly as you want to test it, for example:
 *
 *    $ FRODO_MOCK=record frodo conn save https://openam-frodo-dev.forgeblocks.com/am volker.scheuber@forgerock.com Sup3rS3cr3t!
 *
 *    Wait until you see all the Polly instances (mock recording adapters) have
 *    shutdown before you try to run step #1 again.
 *    Messages like these indicate mock recording adapters shutting down:
 *
 *    Polly instance 'conn/4' stopping in 3s...
 *    Polly instance 'conn/4' stopping in 2s...
 *    Polly instance 'conn/save/3' stopping in 3s...
 *    Polly instance 'conn/4' stopping in 1s...
 *    Polly instance 'conn/save/3' stopping in 2s...
 *    Polly instance 'conn/4' stopped.
 *    Polly instance 'conn/save/3' stopping in 1s...
 *    Polly instance 'conn/save/3' stopped.
 *
 * 3. Validate your freshly recorded mock responses are complete and working.
 *    Re-run the exact command you want to test in mock mode (see step #1).
 *
 * 4. Write your test.
 *    Make sure to use the exact command including number of arguments and params.
 *
 * 5. Commit both your test and your new recordings to the repository.
 *    Your tests are likely going to reside outside the frodo-lib project but
 *    the recordings must be committed to the frodo-lib project.
 */

/*
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import -i frodo-test-web-agent -f test/e2e/exports/all/allAlphaAgents.web.agent.json
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import --agent-id frodo-test-web-agent --file test/e2e/exports/all/allAlphaAgents.web.agent.json
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import -f test/e2e/exports/all/allAlphaAgents.web.agent.json
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import --file test/e2e/exports/all/allAlphaAgents.web.agent.json
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import -af test/e2e/exports/all/allAlphaAgents.web.agent.json
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import --all --file test/e2e/exports/all/allAlphaAgents.web.agent.json
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import -A
FRODO_MOCK=record FRODO_HOST=https://openam-frodo-dev.forgeblocks.com/am frodo agent web import --all-separate
*/
import cp from 'child_process';
import { promisify } from 'util';
import { removeAnsiEscapeCodes, testImportAllSeparate } from './utils/TestUtils';
import { connection as c } from './utils/TestConfig';

const exec = promisify(cp.exec);

process.env['FRODO_MOCK'] = '1';
const env = {
    env: process.env,
};
env.env.FRODO_HOST = c.host;
env.env.FRODO_SA_ID = c.saId;
env.env.FRODO_SA_JWK = c.saJwk;

const allAlphaWebAgentsExport = "test/e2e/exports/all/allAlphaAgents.web.agent.json";

describe('frodo agent web import', () => {
    test(`"frodo agent web import -i frodo-test-web-agent -f ${allAlphaWebAgentsExport}": should import the agent with the id "frodo-test-web-agent" from the file "${allAlphaWebAgentsExport}"`, async () => {
        const CMD = `frodo agent web import -i frodo-test-web-agent -f ${allAlphaWebAgentsExport}`;
        const { stdout } = await exec(CMD, env);
        expect(removeAnsiEscapeCodes(stdout)).toMatchSnapshot();
    });

    test(`"frodo agent web import --agent-id frodo-test-web-agent --file ${allAlphaWebAgentsExport}": should import the agent with the id "frodo-test-web-agent" from the file "${allAlphaWebAgentsExport}"`, async () => {
        const CMD = `frodo agent web import --agent-id frodo-test-web-agent --file ${allAlphaWebAgentsExport}`;
        const { stdout } = await exec(CMD, env);
        expect(removeAnsiEscapeCodes(stdout)).toMatchSnapshot();
    });

    test(`"frodo agent web import -f ${allAlphaWebAgentsExport}": should import the first agent from the file "${allAlphaWebAgentsExport}"`, async () => {
        const CMD = `frodo agent web import -f ${allAlphaWebAgentsExport}`;
        const { stdout } = await exec(CMD, env);
        expect(removeAnsiEscapeCodes(stdout)).toMatchSnapshot();
    });

    test(`"frodo agent web import --file ${allAlphaWebAgentsExport}": should import the first agent from the file "${allAlphaWebAgentsExport}"`, async () => {
        const CMD = `frodo agent web import --file ${allAlphaWebAgentsExport}`;
        const { stdout } = await exec(CMD, env);
        expect(removeAnsiEscapeCodes(stdout)).toMatchSnapshot();
    });

    test(`"frodo agent web import -af ${allAlphaWebAgentsExport}": should import all agents from the file "${allAlphaWebAgentsExport}"`, async () => {
        const CMD = `frodo agent web import -af ${allAlphaWebAgentsExport}`;
        const { stdout } = await exec(CMD, env);
        expect(removeAnsiEscapeCodes(stdout)).toMatchSnapshot();
    });

    test(`"frodo agent web import --all --file ${allAlphaWebAgentsExport}": should import all agents from the file "${allAlphaWebAgentsExport}"`, async () => {
        const CMD = `frodo agent web import --all --file ${allAlphaWebAgentsExport}`;
        const { stdout } = await exec(CMD, env);
        expect(removeAnsiEscapeCodes(stdout)).toMatchSnapshot();
    });

    test.skip(`"frodo agent web import -A": should import all agents from the current directory"`, async () => {
        const CMD = `frodo agent web import -A`;
        await testImportAllSeparate(CMD, env, 'agent/web');
    });

    test.skip(`"frodo agent web import --all-separate": should import all agents from the current directory"`, async () => {
        const CMD = `frodo agent web import --all-separate`;
        await testImportAllSeparate(CMD, env, 'agent/web');
    });

});
