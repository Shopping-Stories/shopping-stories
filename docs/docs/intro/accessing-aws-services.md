---
sidebar_position: 2
---

# Accessing AWS Services (excluding Amplify)

This page cover the AWS services we used and how to access them.
Amplify will be covered under the deployment section. This section
will also explain what services are left over from the previous group
that we did not use but choose not to delete just to be safe.

The main services we are using (excluding Amplify) are S3 for files, Lambda for API logic,
Cloudfront to direct request to the lambda functions, Route53 for domain management, and
EC2 for the Debian server hosting the MongoDB database.

To find these services just login to the AWS console and use the search bar to search the name
of the service you are looking for.

:::tip
All the service we used are in the us-east-1 region. Make sure you are using that region
when you are doing your searches.
:::

![AWS Console](/img/aws-console.png)

## S3

After clicking S3 from your search you should be on the S3 page where you can scroll down and see the buckets

![S3 Buckets](/img/S3-buckets.png)

The only bucket we made is the `shopping-stories` bucket. This bucket contains files and images from the Item
Glossary and Documents pages on the website

The `h4emjh-aqqgmer` bucket was created by Amplify to store the static files generated and served for the
shoppingstories.org website.

The other four buckets are from the previous group and we did not use them. It's up to
the project's sponsor Molly what to do with time.

## Cognito

Cognito is used for user management and authentication. From the Cognito landing page
you can choose to manage the User Pools or Identity Pools. I won't get into specifics about
what you can do with those. There are plenty of threads and things on google explaining those.

There are two user pools and identity pools. Shopping-Stories-2.0 and ShoppingStories2 are the names
of the User Pool and Identity Pool we are using the other pools are left over from the previous group
and currently not in use. Once again we didn't delete them because it's up to the sponsor if those
get deleted.

![Cognito Landing Page](/img/cognito-landing.png)

The user pool page is where you can do most of the stuff relating to user such as setting the password policy,
choosing how long the JSONWebtokens should last and managing the user groups such as Admin and Moderator.

![User Pool Page](/img/user-pool-page.png)

We only had to use the Identity Pool page once and I forgot what for. However, this is what it looks like
and now you know how to find it if you need it.

## EC2 and accessing MongoDB

On the EC2 page you can click the instances link to be taken to a page where you can see the virtual servers.

![EC2 landing page](/img/ec2-page.png)

The only virtual server we are using is the `MongoDB Server`.
any other instances are left over from the previous group and are not use. It's up to the sponsor what to do
with them.

![instances](/img/Instance.png)

You can click on the `MongoDB Server` to view its details and edit some of its settings.
You can get the Public IP or Public IPv4 DNS to ssh of the server from this page.
Also, if you need to open or close any ports on the server you can edit the security groups from here.

![MongoDB Instance](/img/MongoDB-instance-page.png)

### SSH Into EC2 Instance

If you have the IP or DNS from of the server and the `MongoDB-EC2-Key.pem` key file from Molly
you will be able to SSH into the server using the command

```
sudo ssh -i ~/path/to/MongoDB-EC2-Key.pem bitnami@<IP or DNS>
```

Molly also has a `MongoDB-EC2-Info.txt` file that has the username and info for the root user of
the instance and the username and password for the MongoDB database if you need it

:::tip
You can use cat or less to view the previous command executed on the server.
```
less ~/.bash_history
```
or
```
cat ~/.bash_history
```
:::

## Cloudfront

Cloudfront is used to route API traffic from the domain to the appropriate lambda function.
You shouldn't need to access this unless you delete the Next.js app from amplify. In that case
you will be able to delete this Cloudfront distribution using this management panel.

![Cloudfront](/img/Cloudfront.png)

## Lambda

Similar to Cloudfront these functions are create by Amplify automatically when deploying the Next.js
API so you don't need to mess with this page unless you need to increase the amount of time or memory
a function has or you deleted the Amplify app and want to clean up the unused functions.

![Lambda](/img/Lambda.png)

## Cloudwatch

You will be able to see the logs output during a lambda function's execution by going to the Cloudwatch page

![Cloudwatch landing page](/img/Cloudwatch-1.png)

To view the logs go Logs > Log groups

![log groups](/img/Cloudwatch-2.png)

From her just click through the functions till you find the one whose logs you are looking for.

![log groups](/img/Cloudwatch-3.png)

## Billing