import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Grid2, Box } from '@mui/material';

function TransactionPage({ setNextButton, data }) {
  const [selected, setSelected] = useState(null); // 선택된 거래방식 저장
  const containerRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelected(null);
        setNextButton(0); // 외부 클릭 시 초기화
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setNextButton]);

  const handleNext = () => {
    if (selected === 'parcel') {
      setNextButton(1); // 택배 거래 선택 시 1 전달
    } else if (selected === 'direct') {
      setNextButton(2); // 직거래 선택 시 2 전달
    } else {
      setNextButton(0); // 선택하지 않은 경우 초기값 전달
    }
  };

  return (
    <Grid2 container spacing={2} direction="column" alignItems="center" justifyContent="center" textAlign="center" style={{ minHeight: '90vh', padding: '20px', width: '100%' }} ref={containerRef}>
      <Grid2 item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          원하시는 거래방법을 선택해 주세요<br/><br/>
        </Typography>
      </Grid2>
      <Grid2 item xs={12}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            textAlign: 'center',
            height: '200px',
            width: '400px',
            mb: 2,
            backgroundColor: selected === 'parcel' ? '#e0e0e0' : '#ffffff',
            color: '#000000',
            border: '1px solid lightgray',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#f0f0f0', boxShadow: 'none' },
            opacity: String(data.is_delivery) === "1" ? 1 : 0.5, // 선택 불가능 시 투명도 낮춤.
          }}
          onClick={() => setSelected('parcel')}
          disabled = {String(data.is_delivery) !== "1"} // 선택 불가능 시 비활성화
        >
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography component="div" sx={{ fontSize: '20px', fontWeight: 'bold', mb: 1 }}>택배 거래</Typography>
            <Typography component="div" sx={{ fontSize: '16px' }}>원하는 주소로 물건을 택배로 받을 수 있어요.</Typography>
          </Box>
        </Button>
      </Grid2>
      <Grid2 item xs={12}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            textAlign: 'center',
            height: '200px',
            width: '400px',
            mb: 2,
            backgroundColor: selected === 'direct' ? '#e0e0e0' : '#ffffff',
            color: '#000000',
            border: '1px solid lightgray',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#f0f0f0', boxShadow: 'none' },
            opacity: String(data.is_direct) === "1" ? 1 : 0.5, // 선택 불가능 시 투명도 낮춤.
          }}
          onClick={() => setSelected('direct')}
          disabled={String(data.is_direct) !== "1"} // 선택 불가능 시 비활성화
        >
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Typography component="div" sx={{ fontSize: '20px', fontWeight: 'bold', mb: 1 }}>직거래</Typography>
            <Typography component="div" sx={{ fontSize: '16px' }}>채팅으로 약속을 정하고 직접 만나 볼 수 있어요.</Typography>
          </Box>
        </Button>
      </Grid2>
      <Grid2 item xs={12}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            height: '56px',
            width: '400px',
            borderColor: 'white',
            color: 'white',
            backgroundColor: selected ? 'black' : 'gray',
            '&:hover': { backgroundColor: 'black', boxShadow: 'none' },
          }}
          onClick={handleNext}
        >
          다음
        </Button>
      </Grid2>
    </Grid2>
  );
}

export default TransactionPage;
