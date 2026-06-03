import HomePage from '#/components/pages/home/home-page.tsx';
import { errorSearchSchema } from '#/schema/common.ts';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  validateSearch: (search) => errorSearchSchema.parse(search),
  component: App
})

function App() {
  const { error } = Route.useSearch()

  return (
    <HomePage ShowHeader={true} ShowFooter={true} error={error} />
  )
}
