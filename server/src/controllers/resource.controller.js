export function createResourceController(service, options = {}) {
  const slugField = options.slugField !== false;

  return {
    list: async (request, response, next) => {
      try {
        const filter = options.buildFilter ? options.buildFilter(request) : {};
        const items = await service.list({ filter, populate: options.populate });
        response.json({ success: true, data: items });
      } catch (error) {
        next(error);
      }
    },

    getOne: async (request, response, next) => {
      try {
        const filter = options.buildOneFilter ? options.buildOneFilter(request) : {};
        const item = slugField
          ? await service.findBySlug(request.params.slug, { populate: options.populate, filter })
          : await service.findById(request.params.id, { populate: options.populate });
        response.json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    create: async (request, response, next) => {
      try {
        const item = await service.create({ ...request.body, createdBy: request.user?.sub || request.user?._id || request.user?.id });
        response.locals.auditResourceId = item._id;
        response.status(201).json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    update: async (request, response, next) => {
      try {
        const item = await service.update(request.params.id, { ...request.body, updatedBy: request.user?.sub || request.user?._id || request.user?.id });
        response.locals.auditResourceId = item._id;
        response.json({ success: true, data: item });
      } catch (error) {
        next(error);
      }
    },

    remove: async (request, response, next) => {
      try {
        await service.remove(request.params.id);
        response.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}
