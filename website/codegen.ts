import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/api/graphql",
  documents: "./graphql/graphqlDefs.graphql",
  generates: {
    "./graphql/generated/graphql.ts": {
      plugins: ["typescript","typescript-operations", "typescript-urql"]
    }
  }
};

export default config;
