import React from 'react';
import { FormControl, FormControlLabel, FormLabel, Checkbox, FormGroup, Button } from '@mui/material';

const ChatReport = ({ room_id }) => {
  return (
    <>
      <br />
      <br />

      <div className="chat-report-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FormControl component="fieldset" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <FormLabel
            component="legend"
            sx={{
              textAlign: 'center',
              mb: 2,
              color: 'black',
              '&.Mui-focused': { color: 'black' },
              fontWeight: 'bold',
              fontSize: '22px' // 글씨 크기 설정 (원하는 크기로 수정 가능)
            }}
          >
            신고 사유 선택
          </FormLabel>
          <br /><br />
          <FormGroup sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left', paddingLeft: '180px' }}>
            <FormControlLabel
              control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
              label={<span style={{  }}>비정상적인 업체로 보임</span>}
            />
            <FormControlLabel
              control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
              label={<span style={{  }}>현금의 비정상적인 언급이 있음</span>}
            />
            <FormControlLabel
              control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
              label={<span style={{  }}>거짓된 거래조건 언급이 있음</span>}
            />
            <FormControlLabel
              control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
              label={<span style={{  }}>정상적인 방법을 언급이 있음</span>}
            />
            <FormControlLabel
              control={<Checkbox sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />}
              label={<span style={{  }}>사기관련 조직적 행태로 의심됨</span>}
            />
          </FormGroup>
          <br /><br /><br /><br /><br /><br /><br />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#000000', // 기본 배경색
              ':hover': {
                bgcolor: '#d32f2f' // 호버 시 배경색
              },
              mt: 2,
              width: '240px',
              height: '50px',
              fontSize: '16px'
            }}
          >
            신고하기
          </Button>
        </FormControl>
      </div>
    </>
  );
};

export default ChatReport;