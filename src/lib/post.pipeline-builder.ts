import {submissionModel} from '../models/submission';
import {postConfig} from '../config/post.config';
import {PipelineStage} from 'mongoose';

export interface PostPipelineOpts {
  populateHot?: boolean;
}

export class PostPipelineBuilder {
  readonly #opts: Partial<PostPipelineOpts> = {};

  #pipeline: PipelineStage[] = [];

  public constructor(opts: Partial<PostPipelineOpts> = {}) {
    this.#opts = opts;
  }

  public build(): PipelineStage[] {
    this.#pipeline = [
      {$match: {deleted: {$ne: true}}},
    ];

    this.#populateHot();

    return this.#pipeline;
  }

  #populateHot(): void {
    if (!this.#opts.populateHot) {
      return;
    }

    const startOfWeek = new Date();
    startOfWeek.setUTCHours(0, 0, 0, 0);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());

    this.#pipeline.push(
      {
        $lookup: {
          as: 'submission',
          foreignField: 'post',
          from: submissionModel.collection.name,
          localField: '_id',
        },
      },
      {
        $addFields: {
          recentSubmissions: {
            $filter: {
              as: 's',
              cond: {$gte: ['$$s.createdAt', startOfWeek]},
              input: '$submission',
            },
          },
        },
      },
      {
        $addFields: {
          hot: {
            $cond: {
              else: null,
              if: {$gt: [{$size: '$recentSubmissions'}, postConfig.hotThreshold]},
              then: {$size: '$recentSubmissions'},
            },
          },
        },
      },
    );
  }
}
