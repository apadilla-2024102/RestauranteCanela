export const createSwaggerDocument = (port) => ({
  openapi: '3.0.0',
  info: {
    title: 'Menu Inventory Service API',
    version: '1.0.0',
    description: 'Documentación Swagger para Menu Inventory Service',
  },
  servers: [{ url: `http://localhost:${port}/api/v1` }],
  paths: {
    '/health': {
      get: {
        summary: 'Estado del servicio',
        responses: {
          '200': { description: 'Servicio sano' },
        },
      },
    },
    '/menu': {
      get: {
        summary: 'Obtener todos los ítems de menú',
        responses: { '200': { description: 'Lista de ítems' } },
      },
      post: {
        summary: 'Crear un ítem de menú',
        responses: { '201': { description: 'Ítem creado' } },
      },
    },
    '/menu/{id}': {
      get: {
        summary: 'Obtener un ítem de menú por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Ítem encontrado' } },
      },
      put: {
        summary: 'Actualizar un ítem de menú por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Ítem actualizado' } },
      },
      delete: {
        summary: 'Eliminar un ítem de menú por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Ítem eliminado' } },
      },
    },
  },
});
