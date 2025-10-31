const ApiMethod = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
};

type ApiMethod = (typeof ApiMethod)[keyof typeof ApiMethod];

export { ApiMethod };
