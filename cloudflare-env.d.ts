declare namespace Cloudflare {
  interface Env {
    CONTACT_RATE_LIMITER?: RateLimit;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
