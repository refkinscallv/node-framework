import 'reflect-metadata';
import 'dotenv/config';
import '@app/hooks/register';
import '@core/scope';
import Boot from '@core/boot';

Boot.run();
