# Risk Insurance

A project to calculate different risk insurances using Serverless

## Structure

```
.
├── modules (modules folder)
│   └── mutation (module / context)
│       └── endpoints (API endpoints)
│           └── insurance.js
├── package.json
├── serverless.yml (serverless config)
├── handlers (functions config)
│   └── insurance-endpoints.yml (endpoints config)
├── shared (shared components)
│   ├── insurance.js **(algorithm to insurance)**
│   └── api.js (API Gateway response helper)
└── test (tests folder)
```

## Development environment 

This boilerplate uses `serverless-local` plugin and some containers and plugins to emulate the AWS Resources

```bash
yarn run dev
```
The applications will start on `http://localhost:3000`

### Dev Plugins

This boilerplate contains following plugins for local development: 

* [serverless-offline](https://github.com/dherault/serverless-offline/issues) - For run API Gateway local and manage plugins 
* [serverless-plugin-split-stacks](https://github.com/dougmoscrop/serverless-plugin-split-stacks) - Split Cloudformation Templates

## Production environment

### Deploy full services

```bash
serverless deploy -v
```

### Deploy a function 

```bash
serverless deploy function -f insurance
```

### Get function logs

```bash
serverless insurance -f test -t
```

### Clean All

```bash
serverless remove
```

## Testing

### All Tests

```bash
yarn run test
```

### Unit Tests

```bash
yarn run test:unit
```

### Integration Tests

```bash
yarn run test:integration
```

## DB

### Seed db with

```bash
yarn run cli db seed --dryRun --server "mongodb://localhost:27017/insurance-risk?retryWrites=true&w=majority"
```