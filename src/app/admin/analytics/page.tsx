"use client";

import { useState, useEffect } from "react";
import { Link } from "../../../../data/links";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MousePointerClick, ExternalLink, TrendingUp, Link as LinkIcon, Crown, Sparkles, BarChart2 } from "lucide-react";

const chartConfig = {
  clicks: {
    label: "클릭 수",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AnalyticsDashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Auth 상태 추적
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // 파이어스토어에서 실시간 데이터 가져오기
  useEffect(() => {
    if (!user) {
      setLinks([]);
      return;
    }
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
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold mb-2">로그인이 필요합니다</h2>
        <p className="text-muted-foreground">통계를 보려면 우측 상단의 로그인 버튼을 눌러주세요.</p>
      </div>
    );
  }

  // 데이터 처리
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  const activeLinksCount = links.filter(link => link.isVisible).length;
  
  // 인기순 정렬
  const sortedLinks = [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
  const topLink = sortedLinks.length > 0 && (sortedLinks[0].clickCount || 0) > 0 ? sortedLinks[0] : null;

  // 차트용 데이터
  const chartData = sortedLinks.slice(0, 10).map(link => ({
    name: link.title,
    clicks: link.clickCount || 0,
    fill: "hsl(var(--primary))"
  }));

  return (
    <div className="min-h-screen bg-background p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* 헤더 섹션 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            성과 분석 <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-lg">내 방문자들이 어떤 링크를 가장 많이 클릭하는지 확인해보세요.</p>
        </div>

        {/* 핵심 지표 (Metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 총 클릭 수 */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="font-semibold text-primary/80 flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" /> 누적 총 클릭 수
              </CardDescription>
              <CardTitle className="text-5xl font-black text-primary">
                {totalClicks.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                모든 링크에서 발생한 클릭의 합
              </p>
            </CardContent>
          </Card>

          {/* 가장 인기 있는 링크 */}
          <Card className="shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Crown className="w-24 h-24 text-yellow-500" />
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" /> 최고 인기 링크
              </CardDescription>
              <CardTitle className="text-2xl font-bold truncate">
                {topLink ? topLink.title : "데이터 없음"}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              {topLink ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-black">{topLink.clickCount?.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">클릭</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">아직 클릭된 링크가 없습니다.</p>
              )}
            </CardContent>
          </Card>

          {/* 활성 링크 수 */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="font-semibold flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-500" /> 운영 중인 링크
              </CardDescription>
              <CardTitle className="text-4xl font-black">
                {activeLinksCount} <span className="text-2xl font-bold text-muted-foreground">/ {links.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">현재 공개되어 있는 링크 개수</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 차트 시각화 (좌측, 2칸 차지) */}
          <Card className="lg:col-span-2 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>클릭 트렌드 (Top 10)</CardTitle>
              <CardDescription>어떤 링크가 가장 매력적이었는지 한눈에 비교합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 && totalClicks > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[350px] w-full mt-4">
                  <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      tickMargin={12}
                      axisLine={false}
                      tickFormatter={(value) => value.length > 8 ? value.slice(0, 8) + '...' : value}
                      className="text-xs font-semibold"
                    />
                    <ChartTooltip 
                      cursor={{ fill: 'var(--primary)', opacity: 0.1 }} 
                      content={<ChartTooltipContent hideLabel />} 
                    />
                    <Bar 
                      dataKey="clicks" 
                      radius={[6, 6, 0, 0]} 
                      className="fill-primary hover:opacity-80 transition-opacity"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.5)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed mt-4">
                  <BarChart2 className="w-12 h-12 mb-3 opacity-20" />
                  <p>충분한 클릭 데이터가 모이면 차트가 표시됩니다.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 랭킹 리스트 (우측, 1칸 차지) */}
          <Card className="shadow-sm border-border/50 flex flex-col">
            <CardHeader>
              <CardTitle>전체 순위</CardTitle>
              <CardDescription>클릭 점유율(%)과 함께 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: '420px' }}>
              <div className="space-y-4">
                {sortedLinks.map((link, index) => {
                  const clickCount = link.clickCount || 0;
                  const percentage = totalClicks > 0 ? Math.round((clickCount / totalClicks) * 100) : 0;
                  
                  return (
                    <div 
                      key={link.id} 
                      className="relative group p-3 rounded-xl border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      {/* 배경 프로그레스 바 (점유율) */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-primary/5 transition-all duration-500 -z-10" 
                        style={{ width: `${percentage}%` }}
                      />
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs shadow-sm
                          ${index === 0 ? 'bg-yellow-400 text-yellow-950' : 
                            index === 1 ? 'bg-gray-300 text-gray-800' : 
                            index === 2 ? 'bg-amber-600 text-amber-50' : 
                            'bg-muted text-muted-foreground'}`}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                            {link.title}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground font-medium">{percentage}% 점유율</span>
                            <span className="font-bold text-sm flex items-center gap-1">
                              {clickCount.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">회</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {sortedLinks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    등록된 링크가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
