import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.model';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService<Env> = app.get(ConfigService);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // elimina propiedades que no estan en el dtos
            forbidNonWhitelisted: true, // lanza una excepcion si hay propiedades extras
            transform: true, // transforma payloads a instancias de clase
        }),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const port: number = configService.get<number>('PORT', 4001) ?? 4001;
    await app.listen(port);
}
bootstrap();
