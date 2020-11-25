FROM ubuntu
RUN apt-get update && apt-get install -y nodejs 
RUN apt-get update && apt-get install -y npm
RUN apt-get update && apt-get install -y g++
RUN apt-get update && apt-get install -y python3
RUN apt-get update && apt-get install -y npm
RUN apt-get update && apt-get install -y cron
RUN apt-get update && apt-get install -y python3-pip
RUN apt-get update && apt-get install -y openjdk-11-jdk
#RUN npm install -g yarn pm2
RUN pip3 install scipy numpy
RUN mkdir -p /usr/local/vm-exec
COPY . /usr/local/vm-exec
EXPOSE 3003
WORKDIR /usr/local/vm-exec
RUN cd /usr/local/vm-exec
RUN npm install --dotenv-extended
RUN npm install
COPY clear-cron /etc/cron.d/clear-cron
RUN chmod 0644 /etc/cron.d/clear-cron
RUN crontab /etc/cron.d/clear-cron
RUN touch /var/log/cron.log
CMD [ "node", "app.js" ]
