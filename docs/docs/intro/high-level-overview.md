---
sidebar_position: 1
---

# High Level System Design

This page is a quick overview of the Tech and AWS services we are using
for the website.

This entire project using TypeScript with Node.js.

We used Next.js as the development framework for this project.
Next.js is a great framework for writing React.js based web applications
and comes with a lot of great stuff to make development easier.

To get a quick run down on Next.js be sure to check out there [docs](https://nextjs.org/docs/getting-started)

:::tip
If you are a Senior Design team, please do yourself a favor and learn these technologies in SD1 don't
put it off. The internet is a great resources and YouTube has a ton of tutorials on this stuff.
:::

On the backend we are utilizing Next.js's API capabilities for our GraphQL endpoint.
We are using MongoDB for the database and connecting to it with Mongoose ([Mongoose Docs](https://mongoosejs.com/docs/api.html)) and Typegoose ([docs](https://typegoose.github.io/typegoose/)) which allows you to define your mongoose
schemas with Typescript classes.

For the API we are using a protocol named GraphQL. [howtographql.com](https://www.howtographql.com/basics/0-introduction/) has great stuff to introduce you to GraphQL. They also have a great tutorial using the same
GraphQL [frontend client we used and React.js](https://www.howtographql.com/react-urql/0-introduction/) which will help you understand our usage of [URQL](https://formidable.com/open-source/urql/) and React.js on the frontend.

We used a library called [TypeGraphQL](https://typegraphql.com/docs/introduction.html) so we could define our GraphQL Schemas in a similar way to how we define
out Mongoose Models with Typegoose.

On the frontend we used React.js we the Component Library [Material UI](https://mui.com/). Material's
documentation is great for understanding how to use it's components and there are plent of reasources
on React. Just use YouTube and Google.
:::tip
React used to only have class based components but now have function based components and we almost
exclusively used function based components due to their simplicity and raise in use.
:::

Finally, we used [Jest](https://jestjs.io/) For the very limited API tests we have.


To Deploy the website we used a service AWS offers called Amplify. This service has great support for Next.js
which makes deploying the website much easier by allowing you to connect your GitHub repo to Amplify. This may
feel similar to Heroku or Vercel if you have used those services before.

The MongoDB database is hosted on an EC2 server in AWS. The backend API and frontend client or deployed with
Amplify. Under the surface Amplify create serverless Lambda functions and Cloudfront to serve your Next.js
API endpoints (and Server-side rendered pages but we don't have any of those).

For User-management and Authentication we used an AWS service called Cognito. Any files such as Images
and documents on the documents page are uploaded and download from an S3 Bucket.

![System Diagram](/img/System-Block-Diagram.png)