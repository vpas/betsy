FROM public.ecr.aws/lambda/nodejs:18

COPY package*.json ./
RUN npm install

COPY .meshrc.yaml ./
RUN mesh build

COPY app.mjs ./
    
CMD ["app.handler"]