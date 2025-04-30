export interface ExecutionResponse {
  /** Total runtime in `ms` */
  runtime: number;

  /** Peak Memory Usage in `mb` */
  peakMemb: number;

  output: string;
}

/**
 * This class is designed to provide an abstraction layer for remote code execution.
 * It allows us to easily switch between different providers if the current provider
 * becomes too expensive or doesn't meet our needs.
 */
export abstract class AbstractRemoteCodeExecutionImpl {
  /**
   * Executes the provided code remotely through the class's configured provider.
   * This method allows running user-submitted code retrieves the execution results.
   *
   * @param code The user's code to be executed. The code must be self-contained
   *             (including any necessary imports, libraries, or dependencies) - it's not magic.
   *
   * @param language A number associated with the programming language in which the code is written.
   *
   * @returns `ExecutionResponse`, which contains stats for the execution and the logs
   */
  abstract executeCode(code: string, language: number): Promise<ExecutionResponse>;
}
