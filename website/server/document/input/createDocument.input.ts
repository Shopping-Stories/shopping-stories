import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateDocumentInput {
    @Field({ description: 'Name of document' })
    name: string;

    @Field({ description: 'Key of file in S3 bucket' })
    fileKey: string;

    @Field({ description: 'Description of document' })
    description: string;
}
