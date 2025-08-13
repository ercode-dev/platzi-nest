import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // elimina propiedades que no estan en el dtos
            forbidNonWhitelisted: true, // lanza una excepcion si hay propiedades extras
            transform: true, // transforma payloads a instancias de clase
        }),
    );
    await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
