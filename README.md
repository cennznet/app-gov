# App Gov

- [Environment](#environments)
  - [Development](#development)

## Environments

### Development

##### Initial Setup

- Run `yarn install` to install the dependencies

##### Run `gov-website`

> **URL:** http://localhost:4200

```
yarn gov-website:dev
```

##### Run `gov-relayer`

```
# start docker
yarn gov-relayer:docker

# start webpack
yarn gov-relayer:serve

# start the CLI
yarn relayer:run
```
