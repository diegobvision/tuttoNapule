import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_FRAGMENT,
  CART_FRAGMENT,
  ARTICLE_FRAGMENT,
} from "./fragments";

// ── Products ─────────────────────────────────────────────────────────────
export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFull }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query Products($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges { node { ...ProductCard } }
    }
  }
`;

export const PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) { ...ProductCard }
  }
`;

// ── Collections ──────────────────────────────────────────────────────────
export const COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionByHandle(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo { title description }
      image { ...ImageFields }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges { node { ...ProductCard } }
      }
    }
  }
`;

/** Lightweight collection meta (title/image/description) without products. */
export const COLLECTION_META_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  query CollectionMeta($handle: String!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo { title description }
      image { ...ImageFields }
    }
  }
`;

/** All collections — powers the "Categorie" slide-over. */
export const ALL_COLLECTIONS_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  query AllCollections($first: Int!) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          handle
          title
          description
          image { ...ImageFields }
        }
      }
    }
  }
`;

// ── Shopify Pages (T&C, privacy, shipping, faq, about…) ──────────────────
export const PAGE_BY_HANDLE_QUERY = /* GraphQL */ `
  query PageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      handle
      title
      body
      bodySummary
      createdAt
      updatedAt
      seo { title description }
    }
  }
`;

// ── Blog / Articles ──────────────────────────────────────────────────────
export const ARTICLES_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${ARTICLE_FRAGMENT}
  query Articles($first: Int!) {
    blogs(first: 1) {
      edges {
        node {
          handle
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
            edges { node { ...ArticleFields } }
          }
        }
      }
    }
  }
`;

export const ARTICLE_BY_HANDLE_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${ARTICLE_FRAGMENT}
  query ArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blogByHandle(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) { ...ArticleFields }
    }
  }
`;

export const BLOG_HANDLES_QUERY = /* GraphQL */ `
  query BlogHandles {
    blogs(first: 20) {
      edges { node { handle } }
    }
  }
`;

// ── Handle listings for the sitemap ──────────────────────────────────────
export const ALL_PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query AllProductHandles($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node { handle updatedAt } }
    }
  }
`;

export const ALL_COLLECTION_HANDLES_QUERY = /* GraphQL */ `
  query AllCollectionHandles($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node { handle updatedAt } }
    }
  }
`;

export const ALL_PAGE_HANDLES_QUERY = /* GraphQL */ `
  query AllPageHandles($first: Int!, $after: String) {
    pages(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node { handle updatedAt } }
    }
  }
`;

export const ALL_ARTICLE_HANDLES_QUERY = /* GraphQL */ `
  query AllArticleHandles($first: Int!) {
    blogs(first: 1) {
      edges {
        node {
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
            edges { node { handle publishedAt } }
          }
        }
      }
    }
  }
`;

// ── Cart mutations ───────────────────────────────────────────────────────
export const CART_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${CART_FRAGMENT}
  query Cart($id: ID!) {
    cart(id: $id) { ...CartFields }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;
