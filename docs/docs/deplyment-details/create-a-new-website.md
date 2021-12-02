---
sidebar_position: 2
---

# Creating a new Website with Amplify

You shouldn't need to create a new website. However, if you do
here are the steps to do it.

First click the new app and choose the host web app option.

![Amplify new app](/img/amplify/amplify-make-new.png)

From here choose to connect the App to a GitHub repo.

![Amplify GitHub Connect](/img/amplify/amplify-connect-to-git.png)

Here you have to login to GitHub, make sure you already have access to the Github
repo you want to connect to the App.

:::tip
If you trying to connect the repo from and organization like the Shopping-Stories
organization on GitHub you will have to make sure to give Amplify access to organization
repos somewhere on the Github page you are on after logging in.
:::

![Github Login](/img/amplify/github-login.png)


Once you have logged into GitHub you will be able to connect it to a repo you have access to.
You also have to choose the branch to deploy from (deployment is automatic each commit).
Our repo is a monorepo so you have to choose the folder was well (in this example the website folder would be deployed)

![Connect Options](/img/amplify/amplify-connect-repo.png)

After this you can set the build settings (you can check our build settings in the amplify.yml for an example) and use the environment variables. If you are deploying a Next.js website it is important to use one of the Next.js roles.
So that AWS has to proper permissions to deploy the necessary resources for the website.
I'm not actually deploying anything so I'm going to stop the tutorial here but the rest should
be straight forward. (Environment variables setting will be under advanced settings.)

![Build Options](/img/amplify/choose-correct-role.png)