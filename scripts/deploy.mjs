/* Build and publish to eq-trainer.com. Run with: npm run deploy */
import { execFileSync } from 'node:child_process'

const HOST = 'root@169.58.92.31'
const ROOT = '/var/www/eq-trainer.com'
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' })

run(npm, ['run', 'build'])
// Replace assets/ rather than merging: content-hashed bundles never overwrite
// each other, so a merge would pile up every past build forever.
run('ssh', [HOST, `rm -rf ${ROOT}/assets`])
run('scp', ['-r', 'dist/index.html', 'dist/assets', `${HOST}:${ROOT}/`])

console.log('\nDeployed → https://eq-trainer.com')
