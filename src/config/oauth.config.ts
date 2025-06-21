import env from '../util/env';

const baseUrl = (provider: keyof OAuthConfig) => `${env('HOST')}/oauth/${provider}/callback`

interface BaseOAuthConfig {
  client: string;

  secret: string;

  callback: string;

  enable: boolean;
}

interface OAuthConfig {
  google: BaseOAuthConfig;

  discord: BaseOAuthConfig;

  github: BaseOAuthConfig;
}

export const oAuthConfig: OAuthConfig = {
  discord: {
    callback: baseUrl('discord'),
    client: env('DISCORD_CLIENT_ID'),
    enable: true,
    secret: env('DISCORD_CLIENT_SECRET'),
  },

  github: {
    callback: baseUrl('github'),
    client: env('GITHUB_CLIENT_ID'),
    enable: true,
    secret: env('GITHUB_CLIENT_SECRET'),
  },

  google: {
    callback: baseUrl('google'),
    client: env('GOOGLE_CLIENT_ID'),
    enable: true,
    secret: env('GOOGLE_CLIENT_SECRET'),
  },
};
