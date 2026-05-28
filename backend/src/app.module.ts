import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { ErpDataService } from './erp-data.service';
import { EntitiesController } from './entities/entities.controller';
import { EntitiesService } from './entities/entities.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

@Module({
  imports: [],
  controllers: [
    AuthController,
    DashboardController,
    EntitiesController,
    InventoryController,
    OrdersController,
    ProductsController,
  ],
  providers: [
    AuthService,
    DashboardService,
    EntitiesService,
    ErpDataService,
    InventoryService,
    OrdersService,
    ProductsService,
  ],
})
export class AppModule {}
