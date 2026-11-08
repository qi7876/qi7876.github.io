function normalizePath(path: string): string {
  return path.replace(/^\/|\/$/g, "");
}

export function isHomePage(path: string): boolean {
  return normalizePath(path) === "";
}

export function isPostPage(path: string): boolean {
  return normalizePath(path).startsWith("posts/");
}

export function isAboutPage(path: string): boolean {
  return normalizePath(path) === "about";
}

export function getPageInfo(path: string) {
  return {
    isHome: isHomePage(path),
    isPost: isPostPage(path),
    isAbout: isAboutPage(path),
  };
}
