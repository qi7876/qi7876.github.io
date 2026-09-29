import { base } from '@/config'

function normalizePath(path: string): string {
  const pathWithoutBase = base && path.startsWith(`${base}/`)
    ? path.slice(base.length)
    : path

  return pathWithoutBase.replace(/^\/|\/$/g, '')
}

export function isHomePage(path: string): boolean {
  return normalizePath(path) === ''
}

export function isPostPage(path: string): boolean {
  return normalizePath(path).startsWith('posts/')
}

export function isAboutPage(path: string): boolean {
  return normalizePath(path) === 'about'
}

export function getPageInfo(path: string) {
  return {
    isHome: isHomePage(path),
    isPost: isPostPage(path),
    isAbout: isAboutPage(path),
  }
}
