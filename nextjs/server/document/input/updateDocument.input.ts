import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateDocumentInput {
    @Field({ description: 'Name of document', nullable: true })
    name?: string;

    @Field({ description: 'Key of file in S3 bucket', nullable: true })
    fileKey?: string;

    @Field({ description: 'Description of document', nullable: true })
    description?: string;
}
