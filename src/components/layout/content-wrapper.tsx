import type { ReactNode } from "react";
import { Progress } from "../ui/progress";

export const ContentWrapper = ({
    children,
    Title,
}: {
    children: ReactNode;
    Title: string;
}) => {
    //const { route, routes } = use(StateContext);

    //const index_in_routes = routes.indexOf(route);
    //const progress_in_routes = (index_in_routes / routes.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full border p-4 rounded-lg shadow-md gap-4">
            <Progress value={0} />

            <h1 className="text-2xl font-bold">{Title}</h1>
            {children}
        </div>
    );
};