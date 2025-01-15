'use client';

import React from 'react';

export default function SuccessPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>결제가 성공적으로 완료되었습니다!</h1>
      <p>결제가 완료되었습니다. 구매해 주셔서 감사합니다.</p>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        메인 페이지로 이동
      </a>
    </div>
  );
}
