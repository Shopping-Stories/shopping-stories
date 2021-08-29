import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';

@Controller('cats')
export class CatsController {
	constructor(private readonly appService: CatsService) {}

	@Post()
	createCat(@Body() createCat: CreateCatDto): Promise<Cat> {
		return this.appService.create(createCat);
	}

	@Get()
	getAllCats(): Promise<Cat[]> {
		return this.appService.findAll();
	}
}
