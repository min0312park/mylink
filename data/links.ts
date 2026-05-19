export interface Link {
  id: string;
  title: string;
  url: string;
  faviconUrl: string;
  isVisible: boolean;
  clickCount?: number;
}

export interface Profile {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  backgroundColor: string; // 단색 배경색 (예: #fef08a)
}

// PRD의 페르소나 '지윤'을 바탕으로 한 프로필 더미 데이터
export const dummyProfile: Profile = {
  username: 'jiyoon_draws',
  name: 'Jiyoon, Illustrator',
  bio: 'Drawing warm daily lives 🎨',
  avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sophia',
  backgroundColor: '#063970',
};

export const dummyLinks: Link[] = [
  {
    id: 'link-1',
    title: 'Visit my Merch Store',
    url: 'https://marpple.shop',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=marpple.shop&sz=64',
    isVisible: true,
  },
  {
    id: 'link-2',
    title: 'Portfolio (Notion)',
    url: 'https://notion.so',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=notion.so&sz=64',
    isVisible: true,
  },
  {
    id: 'link-3',
    title: 'Watch my YouTube Videos',
    url: 'https://youtube.com',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64',
    isVisible: true,
  },
  {
    id: 'link-4',
    title: 'New Brush Set (Coming Soon)',
    url: 'https://smartstore.naver.com',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=naver.com&sz=64',
    isVisible: false,
  }
];
