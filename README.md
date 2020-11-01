# api-run-code

## build docker image

sudo docker build --tag plataformalop/vm-exec:<version> .

## push docker image to repo

sudo docker push plataformalop/vm-exec:<version>

## run container

sudo docker run -d --restart=unless-stopped -p 3003:3003 --name vm-exec plataformalop/vm-exec:<version>

## open bash into docker container

sudo docker exec -it vm-exec /bin/bash
