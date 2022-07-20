# App Gov

- [Environment](#environments)
  - [Development](#development)
- [Deployment](#deployment)

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
yarn gov-relayer:webpack

# start the CLI
yarn relayer:run
```

## Deployment

### `gov-relayer`

- Ensure `apps/gov-relayer/package.json#dependencies` is up-to-date with the code base
- Run `yarn gov-relayer:build`
- The folder `dist/apps/gov-relayer` is ready to be copied over to a container
