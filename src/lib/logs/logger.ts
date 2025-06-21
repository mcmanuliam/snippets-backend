import {colours} from '../../util/colours'

export const logLevels = {
  debug: colours.fg.cyan,
  error: colours.fg.red,
  info: colours.fg.green,
};

const RESET = colours.reset;

class Logger {
  #log(level: keyof typeof logLevels, message: string, data: unknown): void {
    const timestamp = new Date().toISOString();
    const colour = logLevels[level] || logLevels.info;

    const formattedMessage = `${logLevels.debug}${timestamp} ${colour}[${level.toLocaleLowerCase()}] ${RESET}- ${message}`;

    if (data) {
      console[level](formattedMessage, data);
    } else {
      console.log(formattedMessage);
    }
  }

  public skip(lines = 0): void {console.log('\n'.repeat(lines))}

  public info(message: string, data?: unknown) {
    this.#log('info', message, data);
  }

  public error(message: string, data?: unknown) {
    this.#log('error', message, data);
  }

  public debug(message: string, data?: unknown) {
    this.#log('debug', message, data);
  }
}

export const log = new Logger();
