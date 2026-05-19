"use client";

import { useState, useEffect } from "react";
import { Link } from "../../../data/links";
import { AddLinkForm } from "@/components/AddLinkForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical, ExternalLink, Pencil, X, Check, Loader2 } from "lucide-react";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  
  // 수정 관련 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editErrors, setEditErrors] = useState<{title?: string, url?: string}>({});
  const [isSaving, setIsSaving] = useState(false);

  // 삭제 모달 관련 상태
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 파이어스토어에서 실시간 데이터 가져오기
  useEffect(() => {
    const q = query(
      collection(db, "users/anonymous/links"),
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
  }, []);

  // 링크 추가 핸들러
  const handleAddLink = async (newLink: Link) => {
    try {
      await addDoc(collection(db, "users/anonymous/links"), {
        title: newLink.title,
        url: newLink.url,
        faviconUrl: newLink.faviconUrl,
        isVisible: newLink.isVisible,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // 링크 삭제 확정 핸들러
  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users/anonymous/links", deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting document: ", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 수정 시작
  const handleEditClick = (link: Link) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditErrors({});
  };

  // 수정 취소
  const handleEditCancel = () => {
    setEditingId(null);
  };

  // 수정 저장
  const handleEditSave = async (id: string) => {
    const errors: {title?: string, url?: string} = {};
    if (!editTitle.trim()) {
      errors.title = "Title is required";
    } else if (editTitle.length > 50) {
      errors.title = "Title is too long (max 50 chars)";
    }

    let isValidUrl = true;
    try {
      new URL(editUrl);
    } catch {
      isValidUrl = false;
    }
    
    if (!editUrl.trim() || !isValidUrl) {
      errors.url = "Please enter a valid URL (e.g., https://example.com)";
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setIsSaving(true);
    let hostname = "";
    try {
      hostname = new URL(editUrl).hostname;
    } catch (error) {
      hostname = editUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
    }
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

    try {
      await updateDoc(doc(db, "users/anonymous/links", id), {
        title: editTitle,
        url: editUrl,
        faviconUrl,
        updatedAt: serverTimestamp(),
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setIsSaving(false);
    }
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
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
                
                {editingId === link.id ? (
                  // 수정 모드 UI
                  <div className="flex-1 w-full flex flex-col gap-3">
                    <div className="grid gap-2">
                      <Input 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="e.g. My New Blog"
                        className={editErrors.title ? "border-destructive" : ""}
                        disabled={isSaving}
                      />
                      {editErrors.title && <p className="text-xs text-destructive font-medium">{editErrors.title}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Input 
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://example.com"
                        className={editErrors.url ? "border-destructive" : ""}
                        disabled={isSaving}
                      />
                      {editErrors.url && <p className="text-xs text-destructive font-medium">{editErrors.url}</p>}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={handleEditCancel} disabled={isSaving}>
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleEditSave(link.id)} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />} Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 기본 뷰 모드 UI
                  <>
                    {/* 드래그 핸들 아이콘 */}
                    <div className="cursor-grab text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    
                    {/* 파비콘 */}
                    <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-background rounded-full border overflow-hidden">
                      <img src={link.faviconUrl} alt="icon" className="w-5 h-5 object-contain" />
                    </div>
                    
                    {/* 링크 정보 */}
                    <div className="flex-1 overflow-hidden w-full">
                      <h3 className="font-semibold text-foreground truncate">{link.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline flex items-center">
                          {link.url}
                          <ExternalLink className="h-3 w-3 ml-1 inline" />
                        </a>
                      </div>
                    </div>
                    
                    {/* 우측 컨트롤 (상태, 수정, 삭제) */}
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium mr-1 ${link.isVisible ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                        {link.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(link)} className="text-muted-foreground hover:text-primary hover:bg-primary/10" disabled={isDeleting}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(link.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
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

      {/* 삭제 확인 모달 */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && !isDeleting && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription className="mt-2">
              이 작업은 되돌릴 수 없으며, 링크가 영구적으로 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
