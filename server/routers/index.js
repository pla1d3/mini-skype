import publicRouter from './public';
import privateRouter from './private';
import wsRouters from './ws';

export default {
  public: publicRouter,
  private: privateRouter,
  ws: wsRouters
};
