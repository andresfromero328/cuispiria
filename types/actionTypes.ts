export type ActionResult =
  | { ok: true }
  | {
      ok: false;
      /** A user-friendly error message suitable for UI display */
      error: string;
    };
