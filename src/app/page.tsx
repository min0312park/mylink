"use client";

import { useState, useEffect } from "react";
import { dummyProfile, Link } from "../../data/links";
import { Card, CardContent } from "@/components/ui/card";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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
    return (
      <main className="min-h-[calc(100vh-3.5rem)] bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">마이링크에 오신 것을 환영합니다!</h2>
        <p className="text-muted-foreground">시작하려면 상단의 Google 로그인 버튼을 눌러주세요.</p>
      </main>
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
