import {submissionModel} from '../models/submission';
import {postConfig} from '../config/post.config';
import {PipelineStage, Types} from 'mongoose';
import {userModel} from '../models/user';

export interface PostPipelinePopulateOpts {
  owner?: boolean;
  hot?: boolean;
}

export interface PostPipelineOpts {
  _id?: string;
  populate?: PostPipelinePopulateOpts;
}

export class PostPipelineBuilder {
  readonly #opts: Partial<PostPipelineOpts> = {};

  readonly #user?: Types.ObjectId;

  #pipeline: PipelineStage[] = [];

  public constructor(opts: Partial<PostPipelineOpts> = {}, user?: Types.ObjectId) {
    this.#opts = opts;
    this.#user = user;
  }

  public build(): PipelineStage[] {
    this.#pipeline = [
      {$match: {deleted: {$ne: true}}},
    ];

    this.#preQuery();
    this.#query();
    this.#postQuery();

    return this.#pipeline;
  }

  /** Pre-query stage hook, should be used for massive knockout fields. */
  #preQuery(): void {
    this.#matchId();
  }

  /** Main query stage hook, should be used for your more taxing and specific queries that can't be included in `preQuery` */
  #query(): void {}

  /** Post-query stage hook, should be used for lookups, computed fields and formatting. */
  #postQuery(): void {
    this.#populatedSubmission();
    this.#populateHot();
    this.#populateOwner();
  }

  #matchId(): void {
    if (!this.#opts._id) {
      return;
    }

    this.#pipeline.push({
      $match: {
        _id: new Types.ObjectId(this.#opts._id),
      },
    })
  }

  #populateOwner(): void {
    if (!this.#opts.populate?.owner) {
      return;
    }

    this.#pipeline.push(
      {
        $lookup: {
          as: 'user',
          foreignField: '_id',
          from: userModel.collection.name,
          localField: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
    )
  }

  #populatedSubmission(): void {
    if (!this.#user) {
      return;
    }

    this.#pipeline.push(
      {
        $lookup: {
          as: 'submission',
          from: submissionModel.collection.name,
          let: {postId: '$_id'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {$eq: ['$post', '$$postId']},
                    {$eq: ['$user', this.#user._id]},
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$submission',
          preserveNullAndEmptyArrays: true,
        },
      },
    );
  }

  #populateHot(): void {
    if (!this.#opts.populate?.hot) {
      return;
    }

    const startOfWeek = new Date();
    startOfWeek.setUTCHours(0, 0, 0, 0);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - startOfWeek.getUTCDay());

    this.#pipeline.push(
      {
        $lookup: {
          as: 'hot',
          from: submissionModel.collection.name,
          let: {postId: '$_id'},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {$eq: ['$post', '$$postId']},
                    {$gte: ['$createdAt', startOfWeek]},
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          hot: {
            $cond: {
              else: null,
              if: {$gt: [{$size: '$hot'}, postConfig.hotThreshold]},
              then: {$size: '$hot'},
            },
          },
        },
      },
    );
  }
}
