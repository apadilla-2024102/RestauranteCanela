export const createSwaggerDocument = (port) => ({
  openapi: '3.0.0',
  info: {
    title: 'Reservation Service API',
    version: '1.0.0',
    description: 'Documentación Swagger para Reservation Service',
  },
  servers: [{ url: `http://localhost:${port}/api/v1` }],
  paths: {
    '/health': {
      get: {
        summary: 'Estado del servicio',
        responses: { '200': { description: 'Servicio sano' } },
      },
    },
    '/reservations': {
      get: { summary: 'Listar reservaciones', responses: { '200': { description: 'Reservaciones listadas' } } },
      post: { summary: 'Crear una reservación', responses: { '201': { description: 'Reservación creada' } } },
    },
    '/reservations/{id}': {
      get: {
        summary: 'Obtener una reservación por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Reservación encontrada' } },
      },
      put: {
        summary: 'Actualizar una reservación por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Reservación actualizada' } },
      },
      delete: {
        summary: 'Eliminar una reservación por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Reservación eliminada' } },
      },
    },
  },
});
