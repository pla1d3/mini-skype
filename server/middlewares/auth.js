export default (req, res, next)=> {
  req.session.isAuth
    ? next()
    : res.status(401).send({ message: 'auth error' });
};
