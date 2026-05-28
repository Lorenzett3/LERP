import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BusinessEntity } from '../erp.types';
import { EntitiesService } from './entities.service';

type EntityInput = Omit<BusinessEntity, 'id'>;

@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }

  @Post()
  create(@Body() body: EntityInput) {
    return this.entitiesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<EntityInput>) {
    return this.entitiesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(id);
  }
}
