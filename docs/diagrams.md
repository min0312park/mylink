# MyLink 다이어그램: 와이어프레임 및 순서도

## 1. UI 와이어프레임 구조 (Wireframe)
관리자 대시보드(Admin Dashboard)와 사용자 퍼블릭 페이지(Public Page)의 대략적인 화면 구조를 나타냅니다.

```mermaid
graph TD
    subgraph Admin ["어드민 대시보드 (Admin Dashboard)"]
        direction LR
        
        subgraph Editor ["좌측: 링크 및 프로필 편집 영역"]
            direction TB
            Nav["상단 탭: 링크 관리 | 디자인 설정"]
            Profile["프로필 섹션 (이미지 업로드, 이름, Bio)"]
            AddLink[("+ 새 링크 추가 버튼")]
            
            subgraph LinkList ["등록된 링크 목록 (Drag & Drop)"]
                direction TB
                L1["[≡] 구글 파비콘 + 링크 타이틀 / URL (On/Off)"]
                L2["[≡] 구글 파비콘 + 링크 타이틀 / URL (On/Off)"]
            end
            
            Nav --- Profile --- AddLink --- LinkList
        end
        
        subgraph Preview ["우측: 실시간 미리보기 (Mobile View)"]
            direction TB
            P_Bg["단색 배경 적용 영역"]
            P_Img(("프로필 이미지"))
            P_Name["@username"]
            P_Bio["짧은 소개글"]
            B1("링크 1 버튼")
            B2("링크 2 버튼")
            
            P_Bg --- P_Img --- P_Name --- P_Bio --- B1 --- B2
        end
        
        Editor -. "실시간 데이터 반영" .-> Preview
    end
```

## 2. 사용자 순서도 (User Flow)
사용자가 서비스에 접속하여 링크를 만들고, 일반 방문자가 그 링크를 클릭하기까지의 전체 흐름입니다.

```mermaid
flowchart TD
    %% 노드 정의
    Start([사용자 접속])
    CheckLogin{로그인 상태}
    Landing[랜딩 페이지]
    Auth[회원가입 / 로그인]
    Dashboard[대시보드 접속]
    
    Action{작업 선택}
    EditProfile[프로필 수정]
    AddLink[링크 추가 및 수정]
    FetchFavicon[구글 API 파비콘 자동 추출]
    ChangeDesign[단색 배경 디자인 설정]
    
    UpdatePreview[실시간 미리보기 업데이트]
    SaveDB[(데이터베이스 저장)]
    
    Visitor([일반 방문자])
    PublicPage[퍼블릭 페이지 접속: mylink.com/@username]
    IncView[페이지 조회수 증가]
    ClickLink[링크 클릭 및 외부 사이트 이동]
    
    %% 흐름 정의
    Start --> CheckLogin
    CheckLogin -- "비로그인" --> Landing --> Auth --> Dashboard
    CheckLogin -- "로그인됨" --> Dashboard
    
    Dashboard --> Action
    
    Action -- "프로필" --> EditProfile --> UpdatePreview
    Action -- "링크 관리" --> AddLink --> FetchFavicon --> UpdatePreview
    Action -- "디자인" --> ChangeDesign --> UpdatePreview
    
    UpdatePreview --> SaveDB
    
    Visitor --> PublicPage
    PublicPage --> IncView
    IncView --> ClickLink
```
