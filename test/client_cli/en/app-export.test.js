import cp from 'child_process';
import { promisify } from 'util';

const exec = promisify(cp.exec);
const CMD = 'frodo app export --help';
const { stdout } = await exec(CMD);

test("CLI help interface for 'app export' should be expected english", async () => {
  expect(stdout).toMatchSnapshot();
});
