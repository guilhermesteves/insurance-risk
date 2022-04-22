const { Command } = require('commander')
const { makeDBCommands } = require('./database')

async function main() {
  const program = new Command()
  program.addCommand(makeDBCommands())

  await program.parseAsync(process.argv)
}

main().catch((err) => {
  console.error('error: ' + err)
})
