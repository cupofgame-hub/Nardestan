import Fastify from 'fastify';

const server = Fastify({
  logger: false
});

server.get('/health', async () => ({
  status: 'ok',
  service: 'nardestan-api',
  timestamp: new Date().toISOString()
}));

const start = async () => {
  const port = Number(process.env.API_PORT ?? 3000);
  await server.listen({ port, host: '0.0.0.0' });
};

void start();
