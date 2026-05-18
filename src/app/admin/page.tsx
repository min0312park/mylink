"use client";

import { useState } from "react";
import { dummyLinks, Link } from "../../../data/links";
import { AddLinkForm } from "@/components/AddLinkForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  // 우선 로컬 상태(useState)로 링크 목록 관리
  const [links, setLinks] = useState<Link[]>(dummyLinks);

  // 링크 추가 핸들러
  const handleAddLink = (newLink: Link) => {
    // 새 링크를 목록 맨 위에 추가
    setLinks([newLink, ...links]);
  };

  // 링크 삭제 핸들러 (테스트용)
  const handleDelete = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* 헤더 및 추가 버튼 영역 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your links and profile</p>
          </div>
          <AddLinkForm onAddLink={handleAddLink} />
        </div>

        {/* 링크 관리 리스트 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight border-b pb-2">Your Links</h2>
          
          {links.map((link) => (
            <Card key={link.id} className="bg-card hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center p-4">
                {/* 드래그 핸들 아이콘 */}
                <div className="mr-4 cursor-grab text-muted-foreground hover:text-foreground transition-colors">
                  <GripVertical className="h-5 w-5" />
                </div>
                
                {/* 파비콘 */}
                <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-background rounded-full border mr-4 overflow-hidden">
                  <img src={link.faviconUrl} alt="icon" className="w-5 h-5 object-contain" />
                </div>
                
                {/* 링크 정보 */}
                <div className="flex-1 overflow-hidden pr-4">
                  <h3 className="font-semibold text-foreground truncate">{link.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline flex items-center">
                      {link.url}
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </a>
                  </div>
                </div>
                
                {/* 우측 컨트롤 (상태 및 삭제) */}
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${link.isVisible ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                    {link.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {links.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border rounded-xl border-dashed bg-secondary/20">
              No links added yet. Click "Add New Link" to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
