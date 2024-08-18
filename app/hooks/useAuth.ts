import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import { SessionPayload } from '../lib/session';

export const useAuth = () => {
  const { data } = useSWR<{ session: SessionPayload }>('/api/me', fetcher);
  return data?.session;
};
