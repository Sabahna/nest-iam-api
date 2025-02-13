# Nest IAM Api

## For development

To install the `nest-iam` package to your development project,

```sh
# Go to the local package directory:
npm link
```

Then in your project and link

```sh
#In the directory of the project to use the package
npm link nest-iam
```

### For Mongodb

- Need Replication

### For PostgreSQL

run

```sh
DB_URL="postgresql://nestiam:nestiam@localhost:5432/nestiam" yarn --cwd ./node_modules/nest-iam db-push
```

head -c 64 /dev/urandom | base64
