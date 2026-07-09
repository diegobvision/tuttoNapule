/**
 * Render a schema.org JSON-LD block. Server component — inject the output of
 * any builder in src/lib/seo.ts.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user-controlled script content).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
