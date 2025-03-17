import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { OrderController } from './controllers/order.controller';
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';
import { PrismaService } from './services/prisma.service';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { OrderRepository } from './repositories/order.repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [],
  controllers: [ProductController, OrderController],
  providers: [
    ProductService,
    OrderService,
    PrismaService,
    OrderRepository,
    ProductRepository,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
