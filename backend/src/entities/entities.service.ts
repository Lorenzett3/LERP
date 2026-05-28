import { Injectable, NotFoundException } from '@nestjs/common';
import { ErpDataService } from '../erp-data.service';
import { BusinessEntity } from '../erp.types';

type EntityInput = Omit<BusinessEntity, 'id'>;

@Injectable()
export class EntitiesService {
  constructor(private readonly data: ErpDataService) {}

  findAll() {
    return this.data.entities;
  }

  create(input: EntityInput) {
    const prefix = input.kind === 'CUSTOMER' ? 'BP-1' : 'BP-2';
    const entity = {
      id: `${prefix}${Math.floor(Math.random() * 9000 + 1000)}`,
      ...input,
    };
    this.data.entities.unshift(entity);
    return entity;
  }

  update(id: string, input: Partial<EntityInput>) {
    const entity = this.data.entities.find((item) => item.id === id);
    if (!entity) {
      throw new NotFoundException('Entidade nao encontrada.');
    }

    Object.assign(entity, input);
    return entity;
  }

  remove(id: string) {
    const index = this.data.entities.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException('Entidade nao encontrada.');
    }

    const [removed] = this.data.entities.splice(index, 1);
    return removed;
  }
}
