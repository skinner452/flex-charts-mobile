type FieldError = {
  msg: string;
  path: string;
};

export const isFieldError = (json: any): json is FieldError => {
  return json["msg"] && json["path"];
};
