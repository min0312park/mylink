"use client";

import { useState, useEffect } from "react";
import { dummyProfile, Link } from "../../data/links";
import { Card, CardContent } from "@/components/ui/card";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { MousePointerClick, Layers, Zap } from "lucide-react";

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Auth 상태 추적
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLinks([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(
      collection(db, `users/${user.uid}/links`),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: Link[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Link[];
      setLinks(fetchedLinks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLinkClick = async (linkId: string) => {
    if (!user) return;
    try {
      const linkRef = doc(db, `users/${user.uid}/links`, linkId);
      await updateDoc(linkRef, {
        clickCount: increment(1)
      });
    } catch (error) {
      console.error("Failed to update click count:", error);
    }
  };

  const activeLinks = links.filter((link) => link.isVisible);

  if (!user) {
    const handleLogin = async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-background flex flex-col overflow-x-hidden selection:bg-primary/20">
        {/* Hero Section */}
        <section className="relative px-6 py-20 sm:py-32 flex flex-col items-center text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            나만의 링크를 <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              하나의 페이지
            </span>로.
          </h1>
          <p className="text-lg sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
            인스타그램, 틱톡, 유튜브 등 흩어져 있는 모든 링크를 단 하나의 깔끔한 프로필로 모아보세요.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg rounded-full font-bold shadow-xl hover:shadow-primary/25 transition-all hover:-translate-y-1" 
              onClick={handleLogin}
            >
              지금 무료로 시작하기
            </Button>
          </div>
        </section>

        {/* Feature & Mockup Section */}
        <section className="px-6 pb-32 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Features */}
          <div className="grid gap-6 order-2 lg:order-1">
            <Card className="p-6 bg-background/50 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <MousePointerClick className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">실시간 성과 추적</h3>
                  <p className="text-muted-foreground leading-relaxed">어떤 링크가 가장 인기가 많은지, 클릭 수는 얼마나 되는지 실시간 통계 대시보드에서 직관적으로 확인하세요.</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/50 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <Layers className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">무제한 링크 관리</h3>
                  <p className="text-muted-foreground leading-relaxed">원하는 만큼 링크를 마음껏 추가하세요. 수정과 삭제도 언제든지 간편하게 클릭 몇 번으로 가능합니다.</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/50 backdrop-blur-xl border-white/10 dark:border-white/5 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">세련된 프로필 디자인</h3>
                  <p className="text-muted-foreground leading-relaxed">복잡한 설정 없이도 모바일과 PC 모두에서 완벽하게 보이는 모던하고 트렌디한 디자인이 기본 제공됩니다.</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Phone Mockup */}
          <div className="relative mx-auto w-full max-w-[320px] order-1 lg:order-2 animate-in fade-in zoom-in-95 duration-1000 delay-500 animate-float">
            {/* Glowing Backdrop */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/40 via-purple-500/30 to-blue-500/20 blur-3xl opacity-60 -z-10 rounded-[3rem] animate-pulse" />
            
            {/* Phone Frame */}
            <div className="relative bg-background/80 backdrop-blur-2xl border-[8px] border-muted/80 rounded-[3rem] h-[640px] w-full shadow-2xl overflow-hidden flex flex-col items-center pt-14 px-5 ring-1 ring-border/50">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-7 bg-muted/80 rounded-b-3xl w-36 mx-auto" />
              
              {/* Profile Image */}
              <div className="w-24 h-24 rounded-full bg-secondary mb-5 p-1 ring-1 ring-border shadow-md">
                <img src={dummyProfile.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover bg-background" />
              </div>
              
              {/* Profile Info */}
              <h4 className="font-extrabold text-xl tracking-tight">{dummyProfile.name}</h4>
              <p className="text-sm font-semibold text-muted-foreground mt-1 mb-8 uppercase tracking-widest">@{dummyProfile.username}</p>
              
              {/* Links */}
              <div className="w-full space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-16 bg-card/80 border rounded-2xl flex items-center px-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-background rounded-sm" />
                    </div>
                    <div className="h-3 bg-muted rounded-full w-28 mx-auto" />
                  </div>
                ))}
              </div>
              
              {/* Bottom Gradient Fade */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-20 px-6 sm:px-12 selection:bg-primary/20 overflow-hidden">
      <div className="w-full max-w-lg flex flex-col items-center space-y-12 relative z-10">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-5 animate-in fade-in zoom-in-95 duration-1000 ease-out">
          {/* Profile Image */}
          <div className="relative w-28 h-28 p-1.5 rounded-full bg-card shadow-xl ring-1 ring-border">
            <div className="w-full h-full rounded-full overflow-hidden bg-background shadow-inner">
              <img 
                src={dummyProfile.avatarUrl} 
                alt={dummyProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Profile Text */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {dummyProfile.name}
            </h1>
            <p className="text-base font-bold text-muted-foreground tracking-wider uppercase">
              @{dummyProfile.username}
            </p>
            <p className="text-lg font-medium text-foreground/90 mt-4 max-w-[300px] mx-auto leading-relaxed">
              {dummyProfile.bio}
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="w-full flex flex-col space-y-4 pt-2">
          {activeLinks.map((link, index) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className="group outline-none block"
              style={{
                animationDelay: `${index * 120}ms`,
                animationFillMode: 'both'
              }}
            >
              <Card 
                className="
                  w-full relative overflow-hidden
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-lg
                  active:scale-[0.98] active:translate-y-0
                  rounded-2xl cursor-pointer
                  animate-in fade-in slide-in-from-bottom-8
                "
              >
                {/* Hover tint effect based on primary color */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardContent className="flex items-center p-4 relative z-10">
                  {/* Favicon */}
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-background rounded-full shadow-sm ring-1 ring-border group-hover:shadow-md transition-all duration-300">
                    <img 
                      src={link.faviconUrl} 
                      alt={`${link.title} icon`}
                      className="w-6 h-6 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                  
                  {/* Link Title */}
                  <div className="flex-1 text-center pr-12">
                    <span className="text-lg font-bold group-hover:text-primary transition-colors tracking-tight">
                      {link.title}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
