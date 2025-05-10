import 'reflect-metadata';
import 'dotenv/config';
import '@app/hooks/register';
import '@core/scope';
import FWBoot from '@core/boot';

FWBoot.run();
