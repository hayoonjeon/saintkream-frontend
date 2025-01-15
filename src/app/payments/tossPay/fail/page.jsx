'use client';

import React from 'react';

export default function FailPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>결제가 실패했습니다.</h1>
      <p>결제가 처리되지 않았습니다. 다시 시도해 주세요.</p>
      <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        메인 페이지로 이동
      </a>
    </div>
  );
}
