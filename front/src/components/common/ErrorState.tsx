import { Button } from './Button'

type ErrorStateProps = {
    message: string
    onRetry?: () => void
    light?: boolean
}

export function ErrorState({ message, onRetry, light = true }: ErrorStateProps) {
    return (
        <div
            role="alert"
            className={`rounded-xl border px-5 py-4 text-sm ${
                light
                    ? 'border-[#f0c5ce] bg-[#fff3f6] text-[#9b2740]'
                    : 'border-[#6f3847] bg-[#422631] text-[#ffc8d3]'
            }`}
        >
            <p>{message}</p>
            {onRetry ? (
                <div className="mt-3">
                    <Button
                        onClick={onRetry}
                        variant={light ? 'primary' : 'outline'}
                        size="sm"
                    >
                        Retry
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
