import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.model';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService<Env> = app.get(ConfigService);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // elimina propiedades que no estan en el dtos
            forbidNonWhitelisted: true, // lanza una excepcion si hay propiedades extras
            transform: true, // transforma payloads a instancias de clase
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    const config = new DocumentBuilder().setTitle('Blog API').setDescription('The blog API description').setVersion('1.0').addTag('blog').build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory, { jsonDocumentUrl: 'swagger/json' });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const port: number = configService.get<number>('PORT', 4001) ?? 4001;
    app.use(helmet());
    app.enableCors({
        origin: 'http://localhost:3000',
    });
    await app.listen(port);
}
bootstrap();
