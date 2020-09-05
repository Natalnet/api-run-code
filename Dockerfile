FROM ubuntu
RUN apt-get install nodejs g++ python3 npm pip3
RUN npm install -g yarn pm2
RUN pip3 install scipy numpy
COPY . ~