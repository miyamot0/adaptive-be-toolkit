import Footer from "./footer";
import Header from "./header";

type PageWrapperProps = {
    ShowHeader?: boolean;
    ShowFooter?: boolean;
    children: React.ReactNode;
};

export default function PageWrapper({ ShowHeader = false, ShowFooter = false, children }: PageWrapperProps) {
    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto gap-4">
            {ShowHeader && <Header />}
            {children}
            {ShowFooter && <Footer />}
        </div>
    );
}