import {
    filterObject,
    getMongoTextSearchObject,
    optimizedMongoCount,
} from '../config/utils';
import { DocumentInfo, DocumentInfoModel } from './document.schema';
import { CreateDocumentInput } from './input/createDocument.input';
import { UpdateDocumentInput } from './input/updateDocument.input';

export default class DocumentService {
    static async create(
        glossaryItem: CreateDocumentInput,
    ): Promise<DocumentInfo> {
        const createdDocument = new DocumentInfoModel(glossaryItem);
        return createdDocument.save();
    }

    static async findAll(
        skip: number,
        limit: number,
        selectedFields: Object,
        search?: string,
    ): Promise<DocumentInfo[]> {
        if (!!search) {
            return DocumentInfoModel.find(getMongoTextSearchObject(search), {
                ...selectedFields,
                score: { $meta: 'textScore' },
            })
                .skip(skip)
                .limit(limit)
                .sort({
                    score: { $meta: 'textScore' },
                    name: 'asc',
                    _id: 'asc',
                })
                .lean<DocumentInfo[]>()
                .exec();
        }
        return DocumentInfoModel.find(
            getMongoTextSearchObject(search),
            selectedFields,
        )
            .sort({ name: 'asc', _id: 'asc' })
            .skip(skip)
            .limit(limit)
            .lean<DocumentInfo[]>()
            .exec();
    }

    static async count(search?: string): Promise<number> {
        return optimizedMongoCount(DocumentInfoModel, search);
    }

    static async findOne(
        id: string,
        selectedFields: Object,
    ): Promise<DocumentInfo | null> {
        return DocumentInfoModel.findOne({ _id: id })
            .select(selectedFields)
            .lean<DocumentInfo>()
            .exec();
    }

    static async updateOne(
        id: string,
        updateFields: UpdateDocumentInput,
        selectedFields: Object,
    ): Promise<DocumentInfo | null> {
        return DocumentInfoModel.findOneAndUpdate(
            { _id: id },
            {
                $set: filterObject(
                    updateFields,
                    (val: any, _key: any) => val !== undefined,
                ),
            },
            { new: true }, // returns new document
        )
            .select(selectedFields)
            .exec();
    }

    static async deleteOne(
        id: string,
        selectedFields: Object,
    ): Promise<DocumentInfo | null> {
        return DocumentInfoModel.findOneAndDelete({ _id: id })
            .select(selectedFields)
            .exec();
    }
}
