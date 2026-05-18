import React from "react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold tracking-tight">Park Min-sung</div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-blue-600 transition-colors">소개</a>
            <a href="#education" className="hover:text-blue-600 transition-colors">학력</a>
            <a href="#experience" className="hover:text-blue-600 transition-colors">경력</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">문의</a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12 lg:py-24">
        {/* Hero Section */}
        <section id="about" className="mb-24 flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Math & Physics Expert
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              수학/과학(물리) 1:1 맞춤형 과외
            </h1>
            <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0">
              안녕하세요. 한양대학교 신소재공학부 박민성입니다.<br />
              단순한 문제 풀이를 넘어, 원리를 꿰뚫는 분석과 학생 맞춤형 피드백으로 최상의 결과를 만들어냅니다.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start pt-4">
              <a href="#contact" className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-8 text-sm font-bold text-white transition-transform hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900">
                무료 상담 신청하기
              </a>
              <a href="#experience" className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-8 text-sm font-bold transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                수업 방식 확인하기
              </a>
            </div>
          </div>
          
          <div className="relative h-64 w-64 shrink-0 overflow-hidden rounded-3xl bg-zinc-200 dark:bg-zinc-800 lg:h-80 lg:w-80">
            {/* Placeholder for Profile Image */}
            <div className="flex h-full w-full items-center justify-center text-zinc-400">
              <span className="text-4xl font-bold">MS</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-24 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
          {[
            { label: "내신 성적", value: "상위 1%" },
            { label: "수학/과학", value: "1등급" },
            { label: "강의 경험", value: "다수" },
            { label: "맞춤 피드백", value: "100%" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
              <div className="text-sm font-medium text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Education */}
          <section id="education" className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">학력 및 성적</h2>
            <div className="space-y-6">
              <div className="relative border-l-2 border-blue-500 pl-6">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-blue-500 bg-white dark:bg-black"></div>
                <h3 className="text-lg font-bold">한양대학교 신소재공학부</h3>
                <p className="text-zinc-600 dark:text-zinc-400">전공 심화 및 이공계 전문성 보유</p>
              </div>
              <div className="relative border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-zinc-200 bg-white dark:bg-black dark:border-zinc-800"></div>
                <h3 className="text-lg font-bold">안양 소재 고등학교 졸업</h3>
                <p className="text-zinc-600 dark:text-zinc-400">내신 상위 1% (최상위권 성적 유지)</p>
              </div>
              <div className="relative border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-zinc-200 bg-white dark:bg-black dark:border-zinc-800"></div>
                <h3 className="text-lg font-bold">평가원 모의고사 수학/과학 1등급</h3>
                <p className="text-zinc-600 dark:text-zinc-400">수능 및 모의고사 최적화 전략 보유</p>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">강의 경력</h2>
            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900/50">
                <p className="leading-relaxed">
                  단순히 성적만 높은 선생님이 아닙니다. <br /><br />
                  장기간의 **조교 활동**과 **다수의 강의 경험**을 통해 학생들이 어떤 부분에서 막히는지, 어떤 설명이 이해가 빠른지 정확히 파악하고 있습니다. 
                  주먹구구식 전달이 아닌, 학생의 눈높이에서 가장 효율적인 피드백을 전달합니다.
                </p>
              </div>
              <ul className="grid gap-3 px-2">
                {[
                  "학생 수준별 개인 맞춤형 커리큘럼",
                  "실전 대비 오답 분석 및 피드백",
                  "물리 원리 이해를 통한 문제 해결력 강화",
                  "내신 대비 안양 지역 학교 분석",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <section id="contact" className="mt-24 rounded-3xl bg-blue-600 px-6 py-12 text-center text-white dark:bg-blue-700">
          <h2 className="mb-4 text-3xl font-bold">수업 문의 및 상담</h2>
          <p className="mb-8 text-blue-100">학생의 현재 상태 진단부터 목표 달성까지 함께하겠습니다.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="rounded-xl bg-white/10 px-6 py-3 font-medium backdrop-blur-sm">
              카카오톡: [카카오톡 ID 입력]
            </div>
            <div className="rounded-xl bg-white/10 px-6 py-3 font-medium backdrop-blur-sm">
              연락처: [연락처 입력]
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-12 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-zinc-500">
          © 2024 Park Min-sung. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
