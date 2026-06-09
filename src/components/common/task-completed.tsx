export default function TaskCompleted() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <h1 className="text-2xl font-bold text-green-600">Task Completed</h1>
            <p className="text-gray-700">Thank you for completing the task. Proceed to the next step in the survey.</p>
        </div>
    );
}