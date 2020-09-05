docker container stop $(docker container ls -aq) && docker container prune -f
docker run -d --restart=unless-stopped -p 3003:3003 --name vm-exec vm-exec:latest
