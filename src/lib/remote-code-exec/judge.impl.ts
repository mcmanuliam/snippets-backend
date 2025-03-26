import axios, {AxiosError} from 'axios';
import {TestCaseInterface} from '../../models/snippet';
import {AbstractRemoteCodeExecutionImpl, TestResult} from './abstract-remote-code-exec.impl';
import env from '../../util/env';

const enum Conf {
  BASE_URL = '/submissions',
  MEMORY_LIMIT = 128000,
  CPU_TIME_LIMIT = 5
}

interface Judge0ApiResponse {
  token: string;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
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

  public async executeCode(code: string, testCases: TestCaseInterface[], language: number): Promise<TestResult[]> {
    const submissionPromises = testCases.map(testCase => this.#processTestCase(code, testCase, language));
    return Promise.all(submissionPromises);
  }

  async #processTestCase(
    code: string,
    {input, expectedOutput}: TestCaseInterface,
    language: number,
  ): Promise<TestResult> {
    try {
      const createResponse = await axios.post<Judge0ApiResponse>(
        this.#baseUrl,
        {
          cpu_time_limit: Conf.CPU_TIME_LIMIT,
          language_id: language,
          memory_limit: Conf.MEMORY_LIMIT,
          source_code: code,
          stdin: input,
        },
        {
          headers: this.#headers,
          params: {
            base64_encoded: 'false',
            fields: '*',
            wait: 'true',
          },
        },
      );

      return this.#handleSubmissionResponse(createResponse.data, input, expectedOutput);
    } catch (error) {
      return this.#handleSubmissionError(error, input);
    }
  }

  #handleSubmissionResponse(
    {stdout, stderr, compile_output, message, status}: Judge0ApiResponse,
    input: string,
    expectedOutput: string,
  ): TestResult {
    if (status?.id && status.id >= 6) {
      return {
        input,
        isValid: false,
        result: (message && stderr) ? `${message}\n${stderr}` : 'Execution failed',
      };
    }

    return {
      input,
      isValid: this.validateTestCase(expectedOutput, stdout || ''),
      result: stdout || stderr || compile_output || 'No output',
    };
  }

  #handleSubmissionError(error: unknown, input: string): TestResult {
    let errorMessage = 'An unknown error occurred';

    if (axios.isAxiosError(error)) {
      errorMessage = this.#parseAxiosError(error);
    } else if (error instanceof Error) {
      errorMessage = `Runtime error: ${error.message}`;
    }

    return {input, isValid: false, result: errorMessage};
  }

  #parseAxiosError(error: AxiosError): string {
    if (error.response?.status === 422) {
      return 'Invalid submission format. Check your code/input formatting.';
    }

    if (error.response?.status === 401) {
      return 'Invalid API credentials. Check your Judge0 keys.';
    }

    return error.response?.data ? `${JSON.stringify(error.response.data)}` : `${error.message}`;
  }

  public validateTestCase(expected: string, actual: string): boolean {
    const safeExpected = (expected || '').trim();
    const safeActual = (actual || '').trim();

    return safeExpected === safeActual;
  }
}
