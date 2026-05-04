export const createSwaggerDocument = (port) => ({
  openapi: '3.0.0',
  info: {
    title: 'Order Service API',
    version: '1.0.0',
    description: 'Documentación Swagger para Order Service',
  },
  servers: [{ url: `http://localhost:${port}/api/v1` }],
  paths: {
    '/health': {
      get: {
        summary: 'Estado del servicio',
        responses: { '200': { description: 'Servicio sano' } },
      },
    },
    '/orders': {
      get: { summary: 'Listar pedidos', responses: { '200': { description: 'Pedidos listados' } } },
      post: { summary: 'Crear un pedido', responses: { '201': { description: 'Pedido creado' } } },
    },
    '/orders/{id}': {
      get: {
        summary: 'Obtener un pedido por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Pedido encontrado' } },
      },
      put: {
        summary: 'Actualizar un pedido por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Pedido actualizado' } },
      },
      delete: {
        summary: 'Eliminar un pedido por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'Pedido eliminado' } },
      },
    },
  },
});
