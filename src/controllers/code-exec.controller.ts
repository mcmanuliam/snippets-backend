import {Request, Response} from 'express';
import {postModel, PostDocument} from '../models/post';
import {Judge0RemoteCodeExecutionImpl} from '../lib/remote-code-exec/judge.impl';

const provider = new Judge0RemoteCodeExecutionImpl();

export async function executeCode(req: Request, res: Response): Promise<void> {
  if (!req.params.id || !req.body.code) {
    return res.badRequest();
  }

  const code = req.body.code;
  const id = req.params.id;

  try {
    const post = await postModel.findById<PostDocument>(id);
    if (!post) {
      return res.notFound();
    }

    const {language} = post.signature;
    const results = await provider.executeCode(code, language);

    return res.ok(results);
  } catch (error) {
    return res.negotiate(error);
  }
}
