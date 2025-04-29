import {Request, Response} from 'express';
import {snippetModel, SnippetDocument} from '../models/snippet';
import {Judge0RemoteCodeExecutionImpl} from '../lib/remote-code-exec/judge.impl';

const provider = new Judge0RemoteCodeExecutionImpl();

export async function executeCode(req: Request, res: Response): Promise<void> {
  if (!req.params.id || !req.body.code) {
    return res.badRequest();
  }

  const code = req.body.code;
  const id = req.params.id;

  try {
    const snippet = await snippetModel.findById<SnippetDocument>(id);
    if (!snippet) {
      return res.notFound();
    }

    const {language} = snippet.signature;
    const results = await provider.executeCode(code, language);

    return res.ok(results);
  } catch (error) {
    return res.negotiate(error);
  }
}
