import { Model, UpdateQuery, Types, ProjectionType } from "mongoose";
import { ListOptionsInterface, ListInterface, QueryOptionsInterface } from "../../types";
import { removeUndefined, flatten } from "../../helpers";
import { queryBuilder } from "../../utilities";

export default class DefaultRepository<T> {
  constructor(private model: Model<T>) {
    Types.ObjectId.prototype.valueOf = function () {
      return this.toString();
    };
  }

  count = async (queryOptions: QueryOptionsInterface<T>): Promise<number> => {
    return this.model.count(queryBuilder<T>(queryOptions)).exec();
  };

  find = async (
    queryOptions: QueryOptionsInterface<T>,
    { page = 0, pageLimit = 10, sortBy, sortDirection = 1, showAll, projection }: ListOptionsInterface<T> = {}
  ): Promise<ListInterface<T>> => {
    const query = queryBuilder<T>(queryOptions);
    const curser = this.model.find(query, projection);

    if (sortBy) curser.sort({ [sortBy]: sortDirection });
    if (!showAll) curser.skip(page * pageLimit).limit(pageLimit);

    return {
      data: await curser.lean(),
      totalCount: await this.model.count(query).exec(),
    };
  };

  findOne = async (queryOptions: QueryOptionsInterface<T>, projection?: ProjectionType<T>): Promise<T | null> => {
    return this.model.findOne(queryBuilder<T>(queryOptions), projection).lean();
  };

  create = async (data: T): Promise<T> => {
    return this.model
      .findOneAndUpdate(
        queryBuilder<T>({ filter: data, options: { flattenQuery: true } }),
        { ...data, isDeleted: false },
        { upsert: true, new: true }
      )
      .lean() as Promise<T>;
  };

  // TODO INSERT MANY
  insertMany = async (data: T[]): Promise<T[]> => {
    return Promise.all(data.map(async item => await this.create(item)));
  };

  update = async (queryOptions: QueryOptionsInterface<T>, data: UpdateQuery<T>): Promise<T | null> => {
    return this.model
      .findOneAndUpdate(queryBuilder<T>(queryOptions), flatten<UpdateQuery<T>>(removeUndefined<UpdateQuery<T>>(data)))
      .lean();
  };

  delete = async (queryOptions: QueryOptionsInterface<T>): Promise<T | null> => {
    return this.model.findOneAndUpdate(queryBuilder<T>(queryOptions), { isDeleted: true }).lean();
  };
}
