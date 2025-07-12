import {Request, Response} from 'express';
import {Judge0RemoteCodeExecutionImpl} from '../lib/remote-code-exec/judge.impl';
import {SubmissionDocument, submissionModel} from '../models/submission';

const provider = new Judge0RemoteCodeExecutionImpl();

export async function executeCode(req: Request, res: Response): Promise<void> {
  if (!req.params.id!) {
    return res.badRequest();
  }

  const id = req.params.id;

  try {
    const submission = await submissionModel.findById<SubmissionDocument>(id);
    if (!submission) {
      return res.notFound();
    }

    const {code, language} = submission.implementation;
    const results = await provider.executeCode(code, language);

    return res.ok(results);
  } catch (error) {
    return res.negotiate(error);
  }
}
