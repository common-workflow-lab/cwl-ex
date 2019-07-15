from node:slim

COPY cwl-ex-1.0.0.tgz /root

RUN npm install --global /root/cwl-ex-1.0.0.tgz
