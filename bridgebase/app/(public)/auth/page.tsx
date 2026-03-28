import { redirect } from 'next/navigation';

/** TSA Webmaster: sites must not require login to be judged. */
export default function AuthRemovedPage() {
  redirect('/home');
}
