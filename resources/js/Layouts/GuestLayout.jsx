export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white">ATS Platform</span>
                </div>

                <div>
                    <h1 className="text-4xl font-bold leading-tight text-white">
                        채용을<br />더 스마트하게
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">
                        AI 기반 이력서 분석으로<br />최적의 인재를 빠르게 찾아보세요.
                    </p>
                    <div className="mt-10 flex flex-col gap-4">
                        {[
                            { icon: '⚡', text: 'PDF 이력서 자동 분석' },
                            { icon: '📊', text: 'AI 적합도 점수 산출' },
                            { icon: '📅', text: '면접 일정 통합 관리' },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-3 text-slate-300">
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-sm text-slate-600">© 2026 ATS Platform</p>
            </div>

            {/* Right panel */}
            <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:px-16">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-slate-900">ATS Platform</span>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
