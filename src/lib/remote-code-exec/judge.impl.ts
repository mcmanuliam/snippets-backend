import axios, {AxiosError} from 'axios';
import {AbstractRemoteCodeExecutionImpl, ExecutionResponse} from './abstract-remote-code-exec.impl';
import env from '../../util/env';
import {fromBase64, toBase64} from '../../util/to-base-64';

const enum Conf {
  BASE_URL = '/submissions',
  MEMORY_LIMIT = 128000,
  CPU_TIME_LIMIT = 5,
}

const enum ErrorMessages {
  NO_OUTPUT = 'No Output',
  UNKOWN_ERROR = 'An unknown error occurred',
  EXEC_FAILED = 'Execution failed',
  INVALID_FORMAT = 'Invalid submission format. Check your code/input formatting.',
  INVALID_KEYS = 'Invalid API credentials. Check your Judge0 keys.',
}

interface Judge0ApiResponse {
  token: string;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  memory: number;
  time: string,
  status?: {
    id: number;
    description: string;
  };
  error?: string | null;
}

export class Judge0RemoteCodeExecutionImpl extends AbstractRemoteCodeExecutionImpl {
  readonly #baseUrl: string = `${env('JUDGE_HOST')}${Conf.BASE_URL}`;

  readonly #headers = {
    'Content-Type': 'application/json',
    'x-rapidapi-key': env('JUDGE_KEY'),
  };

  public async executeCode(
    code: string,
    language: number,
  ): Promise<ExecutionResponse> {
    try {
      const response = await axios.post<Judge0ApiResponse>(
        this.#baseUrl,
        {
          cpu_time_limit: Conf.CPU_TIME_LIMIT,
          language_id: language,
          memory_limit: Conf.MEMORY_LIMIT,
          source_code: toBase64(code),
        },
        {
          headers: this.#headers,
          params: {
            base64_encoded: 'true',
            fields: '*',
            wait: 'true',
          },
        },
      );

      return this.#handleSubmissionResponse(response.data);
    } catch (error) {
      return this.#handleSubmissionError(error);
    }
  }

  #handleSubmissionResponse(res: Judge0ApiResponse): ExecutionResponse {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {status, stdout, stderr, compile_output, message, memory, time} = res;

    const isFailure = status?.id && status.id >= 6;

    const output =
      fromBase64(compile_output)?.trim() ||
      fromBase64(stderr)?.trim() ||
      fromBase64(stdout)?.trim() ||
      fromBase64(message)?.trim() ||
      (isFailure ? ErrorMessages.EXEC_FAILED : ErrorMessages.NO_OUTPUT);

    return {
      output,
      peakMemb: memory,
      runtime: parseFloat(time),
    };
  }

  #handleSubmissionError(error: unknown): ExecutionResponse {
    let errorMessage = ErrorMessages.UNKOWN_ERROR as string;

    if (axios.isAxiosError(error)) {
      errorMessage = this.#parseAxiosError(error);
    } else if (error instanceof Error) {
      errorMessage = `Runtime error: ${error.message}`;
    }

    return {
      output: errorMessage,
      peakMemb: 0,
      runtime: 0,
    }
  }

  #parseAxiosError(error: AxiosError): string {
    if (error.response?.status === 422) {
      return ErrorMessages.INVALID_FORMAT;
    }

    if (error.response?.status === 401) {
      return ErrorMessages.INVALID_KEYS;
    }

    return error.response?.data ? `${JSON.stringify(error.response.data)}` : `${error.message}`;
  }
}
