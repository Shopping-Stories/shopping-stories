---
sidebar_position: 1
---

# How to Deploy with Amplify

Both the main shoppingstories.org website and the docs website are deployed using
AWS amplify.

Amplify allows you to deploy the website directly to from the GitHub repository.
We have Amplify set up to automatically deploy when something committed to the `production` branch
of the repository.

To deploy a new version of the website you simple have to make a commit to the production branch.

:::danger
Each minute of build time for Amplify costs money so we recommend ensuring that your `npm run build`
works locally before deploying to Amplify.
:::

:::tip
With git you can update the `production` brach by simply updating it to whatever branch
you where developing on. For Example, if you using the Github Desktop client you can simply update the
`production` branch from `main` you can switch to the production branch

![Github Production](/img/amplify/production.PNG)

Then use the branch tab and click "Update from main" to pull all the commits made to main onto
production. Then to start the amplify build simply push the commits to production.

![Github Update Branch](/img/amplify/dialog.png)
:::

## Checking and Debugging your Amplify Build

Login to the AWS Console and search for Amplify.

![Searching for Amplify in AWS](/img/amplify/amplify-search.png)


From the Amplify page you will see the two sites deployed
through amplify, shopping-stories-website and shopping-stories-docs (the website your reading)

Choose the website you want to check the build logs for. In this case I'm looking at the build logs
for the main website that uses Next.js

![Amplify landing page](/img/amplify/amplify-landing.png)

From here you can click the build to see the logs.

![App landing page](/img/amplify/choose-build.png)

From the this page you can easily click through the logs and see
if there are any build or deployment issues.

![Build Page](/img/amplify/build-page.png)

:::tip
Make sure that your environment variables are properly defined because this could lead to build
issues if they are not. The environment variables tab is on the left sidebar.

![Environment Variables](/img/amplify/amplify-env-vars.png)
:::