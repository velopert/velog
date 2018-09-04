# velog

> velog is a blog platform for developers. It provides compfy markdown editor with syntax highlighter enabled. Currently, the service is only available in Korean. 

https://velog.io

The whole process of project development is recorded in my [Youtube Channel](https://www.youtube.com/watch?v=WEC6ATuP9Vo&list=PL9FpF_z-xR_FEhguHXMOvCErayV2Huezy&ab_channel=MinjunKim). Live stream is held at 11:00 PM KST everyday.

## Project Stack

### Client

Following items are core frontend technologies used in this project: 
- React
- React Router v4
- Sass
- Flow
- Redux
- Redux-pender
- Immer
- Marked
- Prismjs
- CodeMirror

### Server

Following items are core backend technologies used in this project: 
- Node.js
- Koa
- Sequelize
- Sequelize-cockroachdb
- Serverless (with AWS Lambda)
- Flow (on Service API)
- TypeScript (on SSR)


## Project Architecture

![](https://i.imgur.com/e7RIMOu.png)

This service heavily relies on AWS Lambda. Its server side rendering function and every service API are hosted on AWS Lambda. CockroachDB is used for RDBMS, and it can be scaled with ease.