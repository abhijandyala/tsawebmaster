/** Service areas shown on the public landing page (marketing copy). */
export const LANDING_REGIONS = [
  {
    id: 'charlotte-lake',
    title: 'Charlotte & Lake Norman',
    blurb: 'Urban core and northern lake communities.',
    places: ['Charlotte', 'Lake Norman Area', 'Huntersville'],
  },
  {
    id: 'meck-union',
    title: 'Mecklenburg & Union Counties',
    blurb: 'Townships and suburbs across the metro.',
    places: ['Matthews', 'Pineville', 'Waxhaw', 'Weddington', 'Marvin'],
  },
  {
    id: 'cabarrus',
    title: 'Cabarrus County',
    blurb: 'Northeast of Charlotte.',
    places: ['Concord', 'Harrisburg', 'Kannapolis'],
  },
] as const;
