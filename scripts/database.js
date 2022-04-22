const { Command } = require('commander')
const { connect, connection, disconnect } = require('mongoose')
const promptly = require('promptly')

const Rule = require('../shared/models/rule')
const IneligibilityRules = require('../db/rules/ineligibility')
const CalculationRules = require('../db/rules/calculation')

let database

async function connectDB(server) {
  await connect(server)
  database = connection

  database.once('open', async () => {
    console.info('Connected to database')
  })
  database.on('error', () => {
    console.info('Error connecting to database')
  })
}

async function disconnectDB() {
  if (!database) {
    return
  }
  disconnect()
}

async function countCollections() {
  const collections = await connection.db.listCollections()
  console.info('To be deleted:')

  for await (const collection of collections) {
    const count = await connection.db
      .collection(collection.name)
      .countDocuments()
    console.info(`${collection.name}: ${count}`)
  }
}

async function removeCollections() {
  const collections = await connection.db.listCollections()
  for await (const collection of collections) {
    await connection.db.collection(collection.name).deleteMany({})
  }
}

async function seedDatabase(options) {
  const { server, dryRun } = options
  await connectDB(server)

  try {
    const promises = []
    const rules = [...IneligibilityRules, ...CalculationRules]

    if (dryRun) {
      console.log(`${rules.length} Rules should be created`)
    } else {
      rules.forEach(rule => {
        promises.push(Rule.create(rule))
      })

      await Promise.all(promises)
      console.log(`${rules.length} Rules created`)
    }
  } catch (error) {
    console.error(`error wiping database: ${error}`)
  } finally {
    await disconnectDB()
  }
}

async function wipeDatabase(options) {
  const { server, dryRun } = options
  await connectDB(server)

  try {
    await countCollections()

    if (!dryRun) {
      const answer = await promptly.confirm(
        'Wiping the database is irreversible! Are you really sure?'
      )
      console.log(`Answer: ${answer}`)

      if (answer) {
        await removeCollections()
      }
    }
  } catch (error) {
    console.error(`error wiping database: ${error}`)
  } finally {
    await disconnectDB()
  }
}

function makeDBCommands() {
  const commands = new Command('db')

  commands
    .command('seed')
    .requiredOption('-s, --server <url>', 'url for mongo db')
    .option('--dryRun', 'run without applying', false)
    .action(seedDatabase)

  commands
    .command('wipe')
    .requiredOption('-s, --server <url>', 'url for mongo db')
    .option('--dryRun', 'run without applying', false)
    .action(wipeDatabase)

  return commands
}

module.exports = {
  makeDBCommands
}
