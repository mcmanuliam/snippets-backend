export interface ExecutionResponse {
  runtime: number;

  peakMemb: number;

  output: string;
}

export abstract class AbstractRemoteCodeExecutionImpl {
  /**
   * Executes the provided code remotely.
   * @param code User's code to be executed.
   */
  abstract executeCode(code: string, language: number): Promise<ExecutionResponse>;
}
