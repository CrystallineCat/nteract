export function deepFreeze(object: string | { [key: string]: any }) {
  if (typeof object === "string") {
    return Object.freeze(object);
  }

  // Retrieve the property names defined on object
  var propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self
  for (let name of propNames) {
    let value = object[name];

    object[name] =
      value && typeof value === "object" ? deepFreeze(value) : value;
  }

  return Object.freeze(object);
}
