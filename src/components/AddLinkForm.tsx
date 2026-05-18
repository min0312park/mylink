"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Link } from "../../data/links";

// 1. Zod를 활용한 유효성 검증 스키마 정의
const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title is too long (max 50 chars)"),
  url: z.string().url("Please enter a valid URL (e.g., https://example.com)"),
});

// 스키마를 바탕으로 폼 타입 추론
type LinkFormValues = z.infer<typeof linkSchema>;

export function AddLinkForm({ onAddLink }: { onAddLink: (link: Link) => void }) {
  const [open, setOpen] = useState(false);

  // 2. react-hook-form 및 zodResolver 연결
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  // 3. 폼 제출 핸들러 (유효성 검증 통과 시에만 실행됨)
  const onSubmit = (data: LinkFormValues) => {
    let hostname = "";
    try {
      hostname = new URL(data.url).hostname;
    } catch (error) {
      hostname = data.url.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
    }

    const newLink: Link = {
      id: `link-${Date.now()}`,
      title: data.title,
      url: data.url,
      faviconUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      isVisible: true,
    };

    onAddLink(newLink);
    
    // 폼 초기화 및 모달 닫기
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) reset(); // 모달이 닫힐 때 폼 초기화
    }}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
            <DialogDescription>
              Enter the title and URL. The favicon will be automatically fetched using Google API.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            
            {/* Title 입력 필드 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium">
                Title
              </Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  placeholder="e.g. My New Blog"
                  {...register("title")}
                  className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {/* 에러 메시지 표시 */}
                {errors.title && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{errors.title.message}</p>
                )}
              </div>
            </div>

            {/* URL 입력 필드 */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right font-medium">
                URL
              </Label>
              <div className="col-span-3">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  {...register("url")}
                  className={errors.url ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {/* 에러 메시지 표시 */}
                {errors.url && (
                  <p className="text-xs text-destructive mt-1.5 font-medium">{errors.url.message}</p>
                )}
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              reset();
              setOpen(false);
            }}>
              Cancel
            </Button>
            <Button type="submit">Save Link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
