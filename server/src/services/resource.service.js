import mongoose from 'mongoose';

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function assertObjectId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid resource id');
  }
}

function formatValidationError(error) {
  if (error.name !== 'ValidationError') {
    return error;
  }

  const details = Object.values(error.errors).map((item) => item.message).join('; ');
  return new ApiError(400, details || 'Validation failed');
}

export function createResourceService(Model) {
  return {
    async list({ filter = {}, sort = { createdAt: -1 }, populate = [] } = {}) {
      let query = Model.find(filter).sort(sort);
      for (const path of populate) query = query.populate(path);
      return query.exec();
    },

    async findBySlug(slug, { populate = [], filter = {} } = {}) {
      let query = Model.findOne({ ...filter, slug });
      for (const path of populate) query = query.populate(path);
      const item = await query.exec();
      if (!item) throw new ApiError(404, `${Model.modelName} not found`);
      return item;
    },

    async findById(id, { populate = [] } = {}) {
      assertObjectId(id);
      let query = Model.findById(id);
      for (const path of populate) query = query.populate(path);
      const item = await query.exec();
      if (!item) throw new ApiError(404, `${Model.modelName} not found`);
      return item;
    },

    async create(payload) {
      try {
        return await Model.create(payload);
      } catch (error) {
        throw formatValidationError(error);
      }
    },

    async update(id, payload) {
      assertObjectId(id);
      try {
        const item = await Model.findByIdAndUpdate(id, payload, { new: true, runValidators: true, context: 'query' });
        if (!item) throw new ApiError(404, `${Model.modelName} not found`);
        return item;
      } catch (error) {
        throw formatValidationError(error);
      }
    },

    async remove(id) {
      assertObjectId(id);
      const item = await Model.findByIdAndDelete(id);
      if (!item) throw new ApiError(404, `${Model.modelName} not found`);
      return item;
    },
  };
}
