FROM ubuntu
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y g++
RUN apt-get install -y python3
RUN apt-get install -y cron
RUN apt install -y python3-pip
RUN pip3 install scipy numpy
#COPY clear-cron /etc/cron.d/clear-cron
#RUN chmod 0644 /etc/cron.d/clear-cron
#RUN crontab /etc/cron.d/clear-cron
#RUN touch /var/log/cron.log


RUN useradd -ms /bin/bash vmexec
USER vmexec
WORKDIR /home/vmexec
RUN mkdir -p ./code
COPY . ./code
WORKDIR /home/vmexec/code
EXPOSE 3003
CMD [ "node", "app.js" ]
