const fs = require('fs')

let extension = ''
if (process.platform === 'win32') {
  extension = '.exe'
}

async function main() {
  const host = Bun.spawn(["rustc", '-vV']);
  const stdoutStr = await new Response(host.stdout).text();
  const targetTriple = /host: (\S+)/g.exec(stdoutStr)[1]

  if (!targetTriple) {
    console.error('Failed to determine platform target triple')
  }

  fs.renameSync(
    `src-tauri/bins/depot${extension}`,
    `src-tauri/bins/depot-${targetTriple}${extension}`,
  )
}

main().catch((e) => {
  throw e
})