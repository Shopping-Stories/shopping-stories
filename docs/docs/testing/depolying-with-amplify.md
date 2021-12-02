---
sidebar_position: 1
---

# Testing Example

I did not have time to write the API test scripts but was able to write an example of Unit testing the cat.resolver and cat.service respectively. These example tests are in the `.spec` files next to the cat.resolver and cat.service files. To write an integration you can mock the request and pass it to the endpoint like a function [here is an example of this](https://seanconnolly.dev/unit-testing-nextjs-api-routes). You can run tests with the `npm run test` command