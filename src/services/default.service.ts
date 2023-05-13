import Repository from "../database/repositories";
import { ListOptionsInterface, QueryOptionsInterface } from "../types";

export default class DefaultService<T> {
  constructor(private repository: Repository<T>) {}

  list = async (queryOptions: QueryOptionsInterface<T>, options?: ListOptionsInterface<T>) => {
    return this.repository.find(queryOptions, options);
  };

  get = async (queryOptions: QueryOptionsInterface<T>) => {
    return this.repository.findOne(queryOptions);
  };

  create = async (data: T) => {
    return this.repository.create(data);
  };

  bulkCreate = async (data: T[]) => data.map(item => this.repository.create(item));

  update = async (queryOptions: QueryOptionsInterface<T>, data: Partial<T>) => {
    return this.repository.update(queryOptions, data);
  };

  delete = async (queryOptions: QueryOptionsInterface<T>) => {
    return this.repository.delete(queryOptions);
  };
}
