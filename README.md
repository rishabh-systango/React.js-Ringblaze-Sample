It's always recommended to use Docker when working on this project to avoid unexpected bugs. 



# SET UP
Install docker for Mac: https://www.docker.com/products/docker#/mac

Clone `ui` repo to your local computer
```bash
git clone git@gitlab.com:ringblaze/ui.git
```

Start the server by executing this command inside the repo
```bash
docker-compose up -d
```

At any time, you can check the logs of `ui` container (exit using `Ctr-C`)
```bash
docker-compose logs -f ui
```

After the server started, you should see ui by going to http://localhost:4000

## Run command against the container
When the container is running, we can run any command against the container using `docker-compose exec`

```bash
docker-compose exec ui yarn add my-module
```

We use `yarn` instead of `npm` for package management.

# TESTING
Test accounts:

test-admin@ringblaze.com / changeme123

test-user@ringblaze.com / changeme123

Run test when the container is running

```bash
docker-compose exec ui yarn run test
```

We can also run a command when the container stopped and exit using `docker-compose run`

```bash
docker-compose run ui yarn run test
```

## Other docker commands
Remove containers with their volumes to start from scratch if you get in trouble. All the data in the container will be wiped out

```bash
docker-compose stop
docker-compose rm -vf
```

If the Dockerfile changes, you have to rebuild the image. Stop and remove the `ui` container then run
```bash
docker-compose build
```
