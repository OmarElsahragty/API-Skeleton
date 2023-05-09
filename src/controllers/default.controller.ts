import { Request, Response, NextFunction } from "express";
import { notFound } from "../errors";
import { parser } from "../helpers";
import Service from "../services";

export default class DefaultController<T> {
  constructor(private service: Service<T>) {}

  protected exec = async (promise: Promise<any>, res: Response, next: NextFunction) => {
    try {
      const data = await promise;
      if (!data) throw notFound();
      return res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    const filter = req.query.filter ? parser(req.query.filter.toString()) : undefined;
    const intervals = req.query.intervals ? parser(req.query.intervals.toString()) : [];
    const projection =
      req.query.projection
        ?.toString()
        .split(",")
        .reduce((acc: Record<string, 1>, item) => (item ? Object.assign(acc, { [item]: 1 }) : acc), {}) || {};

    return this.exec(
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
    this.exec(this.service.get({ id: req.params.id }), res, next);

  create = async (req: Request, res: Response, next: NextFunction) =>
    this.exec(this.service.create(req.body), res, next);

  bulkCreate = async (req: Request, res: Response, next: NextFunction) =>
    this.exec(this.service.bulkCreate(req.body), res, next);

  update = async (req: Request, res: Response, next: NextFunction) =>
    this.exec(this.service.update({ id: req.params.id }, req.body), res, next);

  delete = async (req: Request, res: Response, next: NextFunction) =>
    this.exec(this.service.delete({ id: req.params.id }), res, next);
}
