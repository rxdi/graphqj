import moment from 'moment';

export function fromNow() {
  return moment('20111031', 'YYYYMMDD').fromNow();
}
