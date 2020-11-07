# api-run-code

## login

sudo docker login --username plataformalop

## build docker image

sudo docker build --tag plataformalop/vm-exec:<version> --tag plataformalop/vm-exec:latest .

## push docker image to repo

sudo docker push plataformalop/vm-exec:<version>
  
## stop all containers

sudo docker container stop $(sudo docker container ls -aq) && sudo docker container rm $(sudo docker container ls -aq)

## see processes using ports 3003

sudo lsof -i :3003 | grep LISTEN

## run container

sudo docker run -d --restart=unless-stopped --name vm-exec -p 3003:3003 plataformalop/vm-exec:<version>

## open bash into docker container

sudo docker exec -it vm-exec /bin/bash
