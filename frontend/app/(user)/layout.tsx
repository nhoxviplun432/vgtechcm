import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      {/* Scroll container — snap giữa các section */}
      <div className="user-scroll-container relative z-10 h-screen overflow-y-scroll">
        <Header />
        <main id="main-content" className="relative z-10">
            {/* Background cố định — ngoài scroll container */}
            <div className="pointer-events-none fixed inset-0 z-[1]">
                <div className="absolute -top-40 -left-40 h-[320px] w-[320px] rounded-full bg-fuchsia-500/20 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-[320px] w-[320px] rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.1]" style={{
                    backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,.2) 1px, transparent 1px)
                    `, backgroundSize: "44px 44px",
                }}
                />
            </div>
                {children}
            </main>
        <Footer />
      </div>
    </>
  );
}
