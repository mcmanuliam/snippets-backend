import {TestCaseInterface} from '../../models/snippet';

export interface TestResult {
  input: string;

  result: unknown;

  isValid: boolean;
}

export abstract class AbstractRemoteCodeExecutionImpl {
  /**
   * Executes the provided code remotely, using the provided test cases.
   * @param code User's code to be executed.
   * @param testCases List of test cases to validate the user's code against.
   * @returns A promise that resolves to the results of each test case.
   */
  abstract executeCode(code: string, testCases: TestCaseInterface[], language: number): Promise<TestResult[]>;

  /**
   * Validates the result of the user's code.
   * @param expectedOutput The expected output for a test case.
   * @param result The actual output returned by the user's code.
   * @returns True if the result matches the expected output, otherwise false.
   */
  abstract validateTestCase(expectedOutput: string, result: string): boolean;
}
