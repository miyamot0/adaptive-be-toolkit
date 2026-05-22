import AdaptiveTaskGenericPage from '#/components/pages/adaptive-clinical-page.tsx';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/adaptive')({
    loader: async () => {
        return {};
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <AdaptiveTaskGenericPage Reinforcer="Sample Reinforcer" />;
}
