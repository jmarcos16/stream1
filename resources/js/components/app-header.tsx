import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppHeader() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#27272a] px-6 py-3 shrink-0 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4 text-white">
                <div className="size-6">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path
                            clipRule="evenodd"
                            d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                            fill="currentColor"
                            fillRule="evenodd"
                        />
                        <path
                            clipRule="evenodd"
                            d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                            fill="currentColor"
                            fillRule="evenodd"
                        />
                    </svg>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    VidGen AI
                </h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
                <Avatar className="size-10">
                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuApW4AAMwr0mtyyei9kJd4hHJwZtCW3THoHe_1YJoP4tC6CxLJhFk--ub8GzEGvIc6OKsIsT7PxyTCDIBydvDyEFvF6xmUuwVwmapQE46yS1Uye7QeAVJQ6feWDXUvd3AiZmZGormsRgMb7HbHMYsqJF7PXykCekfRlv7K_FRp0NowQO_0Or-cSb5zorjEplzbuFlQ0nFirACKWXGbzAkFUI95yOJ9XDuGklW3Qg3w8wcJtHeL0tceirXJgIbeZCP_Z2_voX1tLv6g" alt="User profile" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
