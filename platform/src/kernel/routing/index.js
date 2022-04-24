export function compilePath(path) {
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

export function matchPath(pathname, path, exact) {
  const [matcher, paramNames] = compilePath(path);

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
  const params = paramNames.reduce((memo, paramName, index) => {
    try {
      memo[paramName] = decodeURIComponent(captureGroups[index] || "");
    } catch (error) {
      memo[paramName] = captureGroups[index] || "";
    }

    return memo;
  }, {});

  return {
    path,
    url,
    isExact,
    params,
  };
}