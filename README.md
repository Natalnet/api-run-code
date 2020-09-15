# api-run-code

## build docker image

sudo docker build --tag igorosberg/lop-vm-exec:1.0.4 .

## push docker image to repo

sudo docker push igorosberg/lop-vm-exec:1.0.4

## run container

sudo docker run -d --restart=unless-stopped -p 3003:3003 --name lop-vm-exec igorosberg/lop-vm-exec:1.0.4

## open bash into docker container

sudo docker exec -it lop-vm-exec /bin/bash
