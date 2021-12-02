---
sidebar_position: 3
---

# Dev Environment Set Up

To set up your dev environment first you have to clone the repository at [Shopping Stories](https://github.com/Shopping-Stories/shopping-stories) and install the required dependencies by running `npm install` in both the `website` and `docs` directories.

To run the docs dev site simply `cd` into the docs folder and run

```
npm start
```

To run the main website you must first get the `.env.local` file which contains the required credentials from Molly. Place this file in the `website` directory then `cd` into the `website` directory and run `npm run dev`. Now you should be running the website locally. Note: that locally it builds the website on the file which is slow so expect pages to take a while to load when running them with `npm run dev`.

To build the website locally use the command `npm run build` and then you can run the build website with `npm start`. Also, we have a command for automatically formatting the code using the rules in the `.prettierrc`. To automatically format all the files in the repo using prettier run the command `npm run format`. To check for TypeScript errors you can use the command `npm run typecheck`.