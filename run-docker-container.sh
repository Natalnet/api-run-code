docker container stop $(docker container ls -aq) && docker container prune -f
docker run -d --restart=unless-stopped -p 3003:3003 --name lop-vm-exec igorosberg/lop-vm-exec:1.0.1
