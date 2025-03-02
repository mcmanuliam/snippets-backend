/* eslint-disable no-redeclare */
import dotenv from 'dotenv';

export const NONE = Symbol('none');

/**
 * Fetches an environment variable safely.
 * Returns the environment variable value as a string if found.
 * Returns the default value (including undefined) if provided and variable is missing.
 * Throws only when no default is provided and variable is missing.
 *
 * @param key - The name of the environment variable.
 * @param defaultValue - A fallback value (any type) if the environment variable is not set.
 * @returns The environment variable value as string, or provided default.
 * @throws {Error} Only if the environment variable is missing and no default is provided.
 */
function env(key: string): string;
function env<T>(key: string, defaultValue: T): string | T;
function env<T>(key: string, defaultValue?: T | typeof NONE): string | T {
  if (!process.env.LOADED_ENV) {
    dotenv.config();
    process.env.LOADED_ENV = 'true';
  }

  const value = process.env[key]?.trim();
  if (value !== undefined && value !== '') {
    return value;
  }

  if (defaultValue === NONE) {
    throw new Error(`Missing required environment variable "${key}"`);
  }

  return defaultValue as T;
}

export default env;
