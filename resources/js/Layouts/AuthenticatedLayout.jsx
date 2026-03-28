import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    {
        label: '대시보드',
        href: 'dashboard',
        match: 'dashboard',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
            </svg>
        ),
        adminOnly: false,
    },
    {
        label: '채용공고',
        href: 'job-postings.index',
        match: 'job-postings.*',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        adminOnly: true,
    },
    {
        label: '지원자',
        href: 'applicants.index',
        match: 'applicants.*',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        adminOnly: false,
    },
    {
        label: '면접',
        href: 'interviews.index',
        match: 'interviews.*',
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        adminOnly: false,
    },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const isAdmin = auth.roles?.includes('admin');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const logout = () => router.post(route('logout'));

    const NavItem = ({ item }) => {
        if (item.adminOnly && !isAdmin) return null;
        const isActive = route().current(item.match);
        return (
            <Link
                href={route(item.href)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
                {item.icon}
                {item.label}
            </Link>
        );
    };

    const Sidebar = () => (
        <aside className="flex h-full w-64 flex-col bg-slate-900">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <span className="text-base font-bold text-white">ATS Platform</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-3 py-5">
                {navItems.map((item) => <NavItem key={item.href} item={item} />)}
            </nav>

            {/* User */}
            <div className="border-t border-slate-800 p-4">
                <div className="mb-3 px-1">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route('profile.edit')}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        프로필
                    </Link>
                    <button
                        onClick={logout}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        로그아웃
                    </button>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:shrink-0">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex h-full w-64">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-500 hover:text-slate-700"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {header && <div className="text-base font-semibold text-slate-800">{header}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                            {isAdmin ? '관리자' : '면접관'}
                        </span>
                    </div>
                </div>

                {/* Flash messages */}
                {(flash?.success || flash?.error) && (
                    <div className="px-6 pt-4 lg:px-8">
                        {flash?.success && (
                            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                                <svg className="h-4 w-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                                <svg className="h-4 w-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {flash.error}
                            </div>
                        )}
                    </div>
                )}

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
