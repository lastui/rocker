function compilePath(path) {
  let paramNames = [];
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
    regexpSource +=
      path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else {
    regexpSource += "(?:\\b|\\/|$)";
  }

  let matcher = new RegExp(regexpSource, "i");

  return [matcher, paramNames];
}

export function matchPath(pathname, path, exact) {
  let [matcher, paramNames] = compilePath(path);

  let match = pathname.match(matcher);
  if (!match) return null;

  let url = match[0];

  const isExact = pathname === url;

  if (exact && !isExact) {
    return null;
  }

  let pathnameBase = url.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = paramNames.reduce((memo, paramName, index) => {
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = url
        .slice(0, url.length - splatValue.length)
        .replace(/(.)\/+$/, "$1");
    }

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
