function compilePath(path) {
  const paramNames = [];
  let regexpSource =
    "^" +
    path
      .replace(/\/*\*?$/, "")
      .replace(/^\/*/, "/")
      .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&")
      .replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^\\/]+)";
      });

  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else {
    regexpSource += "(?:\\b|\\/|$)";
  }

  const matcher = new RegExp(regexpSource, "i");

  return [matcher, paramNames];
}

export function matchPath(pathname, mask, exact) {
  const [matcher, paramNames] = compilePath(mask);

  const match = pathname.match(matcher);
  if (!match) {
    return null;
  }

  const url = match[0];

  const isExact = pathname === url;

  if (exact && !isExact) {
    return null;
  }

  const captureGroups = match.slice(1);
  const params = paramNames.reduce((acc, paramName, index) => {
    try {
      acc[paramName] = decodeURIComponent(captureGroups[index]);
    } catch (error) {
      acc[paramName] = captureGroups[index];
    }
    return acc;
  }, {});

  return {
    path: mask,
    url,
    isExact,
    params,
  };
}