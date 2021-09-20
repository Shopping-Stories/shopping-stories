import { loadEnvConfig } from '@next/env';
import { resolve } from 'path';

export default async () => {
	const envFile = resolve(__dirname, '..');
	loadEnvConfig(envFile);
};
