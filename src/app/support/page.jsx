import { redirect } from 'next/navigation';
import Notices from './notices/page'
export default function SupportDefaultPage() {
  // /support로 접근 시 /support/notices로 리다이렉트
  redirect('/support/notices');

}
