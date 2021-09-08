import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry, EntryDocument } from './entry.schema';

@Injectable()
export class EntryService {
	constructor(
		@InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
	) {}

	async createEntry(createEntryDto: CreateEntryDto): Promise<Entry> {
		const createdCat = new this.entryModel(createEntryDto);
		return createdCat.save();
	}

	async findAllEntries(): Promise<Entry[]> {
		return this.entryModel.find().exec();
	}

	async findOneEntry(id: string): Promise<Entry> {
		return this.entryModel.findById(id).exec();
	}
}
