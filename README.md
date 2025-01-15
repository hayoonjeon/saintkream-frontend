
깃허브 홈페이지 들어가기 -> repository -> team4_next

(맨 처음 진행)

#### 1. Issue : New issue 만들기 -> 개발예정 (기능이나 업데이트, 버그 수정)
#### 1_1. create a branch -> Repository destination 폴더 변경 드랍다운, change branch source : develop -> Create Branch
#### 1_2. 복사하기 : git fetch origin 
      복사하기 : git checkout 6-푸터-텍스트-변경하겠습다-연습 
#### 1_3. 저장소 주소 복사하기 : https://github.com/ICTTeam4/team4_next.git

#### 2. 내가 D드라이브에 생성한 폴더안에서 git bash를 키고 -> git init -> git remote add origin https://github.com/ICTTeam4/team4_next.git(저장소 주소) 
-> git fetch origin -> git checkout 6-푸터-텍스트-변경하겠습다-연습(브렌치 이름)

#### 3. 내가 생성한 폴더 안에서 VS코드를 열고 새 터미널에서 -> npm install

#### (깃허브에 올리기)

#### [VS코드에서]

#### 0. read.me 삭제하기 (겹쳐서 오류 남)

#### 1. 수정 다 마치고 터미널에서 -> git add . -> git commit -m "푸터변경"
   -> git push origin 6-푸터-텍스트-변경하겠습다-연습(브렌치이름)

#### [깃허브 웹사이트에서]

#### 레포지토리 카테고리에서 -> Pull request -> New pull Request - base를 디벨롭(최종 전 단계 브렌치)으로 변경하기 
-> compare (내 브렌치이름) 변경하기 -> create pull request 누르기-> Write 안에 내용은 상세하게 설명해야 한다. 
-> create pull request 누르기 -> Merge pull request 누르기 -> Confirm merge (최종확인하고 누르기)

