import { Button } from '#/components/ui/button.tsx';
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'

const errorSearchSchema = z.object({
  error: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: (search) => errorSearchSchema.parse(search),
  component: App
})

function App() {
  const { error } = Route.useSearch()

  return (
    <main className="pb-8 pt-14">
      <section className="relative overflow-hidden rounded-[2rem] py-10 sm:py-14 flex flex-col gap-4">
        {
          error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700" role="alert">
              <span className="font-medium">Error: </span>{error}
            </div>
          )
        }

        <Button>
          <Link to="/$id/discounting" params={{ id: 'sample-id', }} >Adaptive Discounting (Base)</Link>
        </Button>

        <Button>
          <Link to="/$id/discounting" params={{ id: 'sample-id' }} search={{ debug: 'true', figures: 'true', reinforcer: 'Dollars' }}>Adaptive Discounting (Debug)</Link>
        </Button>

        <Button>
          <Link to="/$id/demand" params={{ id: 'sample-id', }} >Adaptive Demand (Base)</Link>
        </Button>

        <Button>
          <Link to="/$id/demand" params={{ id: 'sample-id' }} search={{ debug: 'true', figures: 'true', reinforcer: '12 oz Alcoholic Beverages' }}>Adaptive Demand (Debug)</Link>
        </Button>
      </section>
    </main>
  )
}
