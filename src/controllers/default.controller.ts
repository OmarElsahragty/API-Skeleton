import { Request, Response, NextFunction } from "express";
import { ResponseInterface, IntervalInterface, Exception, NotFoundException } from "../types";
import { parser } from "../helpers";
import Service from "../services";

export default class DefaultController<T> {
  constructor(private service: Service<T>) {}

  protected response = async <T>(logic: Promise<T> | Promise<T>[], res: Response, next: NextFunction) => {
    try {
      const response: ResponseInterface<T> = {};

      const { fulfilled = [], rejected = [] }: { fulfilled?: T | T[]; rejected?: Exception[] } = (
        await Promise.allSettled(Array.isArray(logic) ? logic : [logic])
      ).reduce(
        (acc: { fulfilled: T[]; rejected: Exception[] }, item) => {
          if (item.status === "fulfilled") {
            return Object.assign(acc, { fulfilled: acc.fulfilled.concat(item.value) });
          }

          return Object.assign(acc, { rejected: acc.rejected.concat([new Exception(item.reason)]) });
        },
        { fulfilled: [], rejected: [] }
      );

      if (!fulfilled.length && !rejected.length) throw new NotFoundException();
      if (!fulfilled.length) throw rejected;

      response.metadata = { errors: rejected.map(({ status, message }) => ({ status, message })) };
      response.data = fulfilled?.length < 2 ? fulfilled?.[0] : fulfilled;

      return res
        .status(
          fulfilled.length
            ? 200
            : rejected.reduce((acc: number, rejection) => (rejection.status < acc ? rejection.status : acc), 0)
        )
        .send(response);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    const filter = parser<Partial<T>>(req.query.filter?.toString());
    const intervals = parser<IntervalInterface[]>(req.query.intervals?.toString());
    const projection =
      req.query.projection
        ?.toString()
        .split(",")
        .reduce((acc: Record<string, 1>, item) => (item ? Object.assign(acc, { [item]: 1 }) : acc), {}) || {};

    return this.response(
      this.service.list(
        {
          filter,
          intervals,
          id: req.query.id?.toString(),
          options: { flattenQuery: true, operation: req.query.operation?.toString() === "and" ? "and" : "or" },
        },
        {
          sortBy: req.query.sort?.toString(),
          sortDirection: req.query.direction?.toString() === "1" ? 1 : -1,
          page: parseInt(req.query.page?.toString() || "0"),
          pageLimit: parseInt(req.query.limit?.toString() || "10"),
          showAll: req.query.showAll?.toString() === "true",
          projection: Object.keys(projection).length ? projection : undefined,
        }
      ),
      res,
      next
    );
  };

  get = async (req: Request, res: Response, next: NextFunction) =>
    this.response(this.service.get({ id: req.params.id }), res, next);

  create = async (req: Request, res: Response, next: NextFunction) =>
    this.response(this.service.create(req.body), res, next);

  bulkCreate = async (req: Request, res: Response, next: NextFunction) =>
    this.response(this.service.bulkCreate(req.body), res, next);

  update = async (req: Request, res: Response, next: NextFunction) =>
    this.response(this.service.update({ id: req.params.id }, req.body), res, next);

  delete = async (req: Request, res: Response, next: NextFunction) =>
    this.response(this.service.delete({ id: req.params.id }), res, next);
}
