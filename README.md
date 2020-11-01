# api-run-code

## login

sudo docker login --username plataformalop

## build docker image

sudo docker build --tag plataformalop/vm-exec:<version> .

## push docker image to repo

sudo docker push plataformalop/vm-exec:<version>
  
## stop all containers

sudo docker container stop $(docker container ls -aq)

## run container

sudo docker run -d --restart=unless-stopped -p 3003:3003 plataformalop/vm-exec:<version>

## open bash into docker container

sudo docker exec -it vm-exec /bin/bash
