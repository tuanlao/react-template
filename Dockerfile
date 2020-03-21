FROM node:12
USER node
RUN mkdir /home/node/react-template
COPY . /home/node/react-template/
WORKDIR /home/node/react-template
RUN npm install --no-audit --only=production
EXPOSE 3000
ENV NODE_ENV=production
ENV NODE_OPTIONS="--abort-on-uncaught-exception --max-old-space-size=1024 --no-warnings"
ENV UV_THREADPOOL_SIZE=16
CMD ["node", "server"]
