import {colours} from '../../util/colours'

export const logLevels = {
  debug: colours.fg.cyan,
  error: colours.fg.red,
  info: colours.fg.green,
  namespace: colours.fg.magenta,
  reset: colours.reset,
  verbose: colours.fg.blue,
  warn: colours.fg.yellow,
};

class Logger {
  #log(level: keyof typeof logLevels, message: string, data: unknown): void {
    const timestamp = new Date().toISOString();
    const colour = logLevels[level] || logLevels.info;

    const formattedMessage = `${logLevels.debug}${timestamp} ${colour}[${level.toLocaleLowerCase()}] ${colours.reset}- ${message}`;

    if (data) {
      console.log(formattedMessage, data);
    } else {
      console.log(formattedMessage);
    }
  }

  public skip(lines = 0): void {console.log('\n'.repeat(lines))}

  public info(message: string, data?: unknown) {
    this.#log('info', message, data);
  }

  public warn(message: string, data?: unknown) {
    this.#log('warn', message, data);
  }

  public error(message: string, data?: unknown) {
    this.#log('error', message, data);
  }

  public debug(message: string, data?: unknown) {
    this.#log('debug', message, data);
  }

  public verbose(message: string, data?: unknown) {
    this.#log('verbose', message, data);
  }
}

export const log = new Logger();
