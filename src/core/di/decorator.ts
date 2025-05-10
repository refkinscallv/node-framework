import 'reflect-metadata';
import FWContainer from '@core/di/container';

export function Injectable(token?: string): ClassDecorator {
    return (target: any) => {
        const key = token || target.name;
        FWContainer.autoRegister(key, target);
    };
}

export function Inject(): ParameterDecorator {
    return () => {};
}
