/* Build and publish to eq-trainer.com. Run with: npm run deploy */
import { execFileSync } from 'node:child_process'

const HOST = 'root@169.58.92.31'
const ROOT = '/var/www/eq-trainer.com'
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' })
// Node refuses to execFile a .cmd shim directly on Windows (EINVAL since the
// 18.20/20.12 security change), so the build goes through a shell there.
const runNpm = (args) => process.platform === 'win32'
  ? execFileSync('npm', args, { stdio: 'inherit', shell: true })
  : run('npm', args)

runNpm(['run', 'build'])
// Replace assets/ rather than merging: content-hashed bundles never overwrite
// each other, so a merge would pile up every past build forever.
run('ssh', [HOST, `rm -rf ${ROOT}/assets`])
run('scp', ['-r', 'dist/index.html', 'dist/assets', `${HOST}:${ROOT}/`])

// scp -r recreates assets/ with the source's permissions, and a Windows source
// has none to carry over — it lands as 0700, which nginx (www-data) cannot
// traverse, and every asset 404s while index.html still loads. Always fix the
// modes after upload; a+rX sets dirs traversable and files readable, nothing
// executable that was not already.
run('ssh', [HOST, `chmod -R a+rX ${ROOT}`])

console.log('\nDeployed → https://eq-trainer.com')
