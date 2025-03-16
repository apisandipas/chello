/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as BoardsImport } from './routes/boards'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as BoardBoardIdImport } from './routes/board/$boardId'
import { Route as BoardBoardIdCardCardIdImport } from './routes/board/$boardId/card/$cardId'

// Create/Update Routes

const BoardsRoute = BoardsImport.update({
  id: '/boards',
  path: '/boards',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const BoardBoardIdRoute = BoardBoardIdImport.update({
  id: '/board/$boardId',
  path: '/board/$boardId',
  getParentRoute: () => rootRoute,
} as any)

const BoardBoardIdCardCardIdRoute = BoardBoardIdCardCardIdImport.update({
  id: '/card/$cardId',
  path: '/card/$cardId',
  getParentRoute: () => BoardBoardIdRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/boards': {
      id: '/boards'
      path: '/boards'
      fullPath: '/boards'
      preLoaderRoute: typeof BoardsImport
      parentRoute: typeof rootRoute
    }
    '/board/$boardId': {
      id: '/board/$boardId'
      path: '/board/$boardId'
      fullPath: '/board/$boardId'
      preLoaderRoute: typeof BoardBoardIdImport
      parentRoute: typeof rootRoute
    }
    '/board/$boardId/card/$cardId': {
      id: '/board/$boardId/card/$cardId'
      path: '/card/$cardId'
      fullPath: '/board/$boardId/card/$cardId'
      preLoaderRoute: typeof BoardBoardIdCardCardIdImport
      parentRoute: typeof BoardBoardIdImport
    }
  }
}

// Create and export the route tree

interface BoardBoardIdRouteChildren {
  BoardBoardIdCardCardIdRoute: typeof BoardBoardIdCardCardIdRoute
}

const BoardBoardIdRouteChildren: BoardBoardIdRouteChildren = {
  BoardBoardIdCardCardIdRoute: BoardBoardIdCardCardIdRoute,
}

const BoardBoardIdRouteWithChildren = BoardBoardIdRoute._addFileChildren(
  BoardBoardIdRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/boards': typeof BoardsRoute
  '/board/$boardId': typeof BoardBoardIdRouteWithChildren
  '/board/$boardId/card/$cardId': typeof BoardBoardIdCardCardIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/boards': typeof BoardsRoute
  '/board/$boardId': typeof BoardBoardIdRouteWithChildren
  '/board/$boardId/card/$cardId': typeof BoardBoardIdCardCardIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/boards': typeof BoardsRoute
  '/board/$boardId': typeof BoardBoardIdRouteWithChildren
  '/board/$boardId/card/$cardId': typeof BoardBoardIdCardCardIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/boards'
    | '/board/$boardId'
    | '/board/$boardId/card/$cardId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/boards'
    | '/board/$boardId'
    | '/board/$boardId/card/$cardId'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/boards'
    | '/board/$boardId'
    | '/board/$boardId/card/$cardId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  BoardsRoute: typeof BoardsRoute
  BoardBoardIdRoute: typeof BoardBoardIdRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  BoardsRoute: BoardsRoute,
  BoardBoardIdRoute: BoardBoardIdRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/boards",
        "/board/$boardId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/boards": {
      "filePath": "boards.tsx"
    },
    "/board/$boardId": {
      "filePath": "board/$boardId.tsx",
      "children": [
        "/board/$boardId/card/$cardId"
      ]
    },
    "/board/$boardId/card/$cardId": {
      "filePath": "board/$boardId/card/$cardId.tsx",
      "parent": "/board/$boardId"
    }
  }
}
ROUTE_MANIFEST_END */
