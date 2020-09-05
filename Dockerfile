FROM ubuntu
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y g++
RUN apt-get install -y python3
RUN apt-get install -y npm
RUN npm install -g yarn pm2
RUN apt install -y python3-pip
RUN pip3 install scipy numpy
RUN mkdir -p /usr/local/vm-exec
COPY . /usr/local/vm-exec
EXPOSE 3003
WORKDIR /usr/local/vm-exec
RUN cd /usr/local/vm-exec
RUN npm install --dotenv-extended
RUN npm install
CMD [ "node", "app.js" ]
