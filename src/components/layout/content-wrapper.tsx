import type { ReactNode } from "react";

export const ContentWrapper = ({
    children,
    Title,
}: {
    children: ReactNode;
    Title: string;
}) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full border p-4 rounded-lg shadow-md gap-4">


            <h1 className="text-2xl font-bold">{Title}</h1>
            {children}
        </div>
    );
};