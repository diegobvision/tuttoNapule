// Reusable GraphQL fragments, kept DRY across queries.

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

/** Compact product used in grids and cards. */
export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    vendor
    availableForSale
    featuredImage { ...ImageFields }
    priceRange {
      minVariantPrice { ...MoneyFields }
      maxVariantPrice { ...MoneyFields }
    }
    compareAtPriceRange {
      minVariantPrice { ...MoneyFields }
      maxVariantPrice { ...MoneyFields }
    }
  }
`;

/** Full product used on the PDP. */
export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFull on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    createdAt
    updatedAt
    seo { title description }
    featuredImage { ...ImageFields }
    images(first: 12) {
      edges { node { ...ImageFields } }
    }
    options { id name values }
    priceRange {
      minVariantPrice { ...MoneyFields }
      maxVariantPrice { ...MoneyFields }
    }
    compareAtPriceRange {
      minVariantPrice { ...MoneyFields }
      maxVariantPrice { ...MoneyFields }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price { ...MoneyFields }
          compareAtPrice { ...MoneyFields }
          selectedOptions { name value }
          image { ...ImageFields }
        }
      }
    }
  }
`;

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ...MoneyFields }
      totalAmount { ...MoneyFields }
      totalTaxAmount { ...MoneyFields }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { ...MoneyFields } }
          merchandise {
            ... on ProductVariant {
              id
              title
              price { ...MoneyFields }
              selectedOptions { name value }
              product {
                handle
                title
                featuredImage { ...ImageFields }
              }
            }
          }
        }
      }
    }
  }
`;

export const ARTICLE_FRAGMENT = /* GraphQL */ `
  fragment ArticleFields on Article {
    id
    handle
    title
    excerpt
    contentHtml
    publishedAt
    tags
    author: authorV2 { name }
    image { ...ImageFields }
    seo { title description }
    blog { handle }
  }
`;
