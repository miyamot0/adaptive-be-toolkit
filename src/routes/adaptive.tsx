import AdaptiveDemandPage from '#/components/pages/demand/adaptive-demand-page.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/adaptive')({
    loader: async () => {
        return {};
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <AdaptiveDemandPage Reinforcer="Sample Reinforcer" />;
}
