---
sidebar_position: 1
---

# Frontend Info

I didn't have much time to document the frontend but the main things you should know is that the frontend uses React and we extensively used Material UI. The material Ui docs are great and explain a lot. Another thing we used when setting up Material UI with Next JS is [this tutorial](https://www.ansonlowzf.com/create-a-website-with-material-ui-v5-nextjs/)

Also, for forms we utilized [formik](https://formik.org/docs/examples/with-material-ui) and [yup](https://github.com/jquense/yup). And we used the URQL graphql client to make requests to the API and set up automatic token refreshing.

We also utilize the [Amplify Javascript library](https://docs.amplify.aws/lib/q/platform/js/) to utilize AWS services such as Cognito and the S3 bucket from the front end.

To change the access level of a group to files in the S3 bucket you will have to edit the inline policy of the IAM role associated with that group [here's a little more info](https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js/#customization)