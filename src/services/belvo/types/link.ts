export type LinkAccessMode = 'single' | 'recurrent' | 'null';

export type LinkStatus = 'valid' | 'invalid' | 'unconfirmed' | 'token_required';

export type LinkRefreshRate = '6h' | '12h' | '24h' | '7d' | '30d' | 'null';

export type Link = {
  /** Belvo's unique ID for the current Link. */
  id: string;
  /** Belvo's name for the institution. */
  institution: string;
  /** The link type. */
  access_mode: LinkAccessMode;
  /** The ISO-8601 timestamp of Belvo's most recent successful access to the institution for the given link. */
  last_accessed_at: string;
  /** The ISO-8601 timestamp of when the data point was last updated in Belvo's database. */
  created_at: string;
  /** The `external_id` you provided as an additional identifier for the link. */
  external_id: string;
  /** A unique 44-character string that can be used to identify a user at a given institution. */
  institution_user_id: string;
  /** The current status of the link. */
  status: LinkStatus;
  /** The unique ID for the user that created this link. */
  created_by: string;
  /** The update refresh rate for the recurrent link. */
  refresh_rate: LinkRefreshRate;
};
