import { useState } from 'react'
import type { ApiFigureComment } from '../../api/types'
import { Avatar } from '../common/Avatar'
import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { SkeletonBlock } from '../common/Skeletons'
import { CommentItem } from './CommentItem'
import { logModalAction } from '../../utils/modal'

type CommentsListProps = {
    comments: ApiFigureComment[]
    isLoading: boolean
    error: string | null
    onRetry?: () => void
}

export function CommentsList({
    comments,
    isLoading,
    error,
    onRetry,
}: CommentsListProps) {
    const [draftComment, setDraftComment] = useState('')

    return (
        <section
            id="comments"
            className="mx-auto w-full max-w-screen-2xl px-4 py-14 sm:px-8 sm:py-16 lg:px-12 xl:py-20 2xl:px-32"
        >
            <header>
                <h2 className="text-xl font-semibold leading-tight text-[#222] sm:text-2xl lg:text-3xl">
                    Comments
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-light text-[#7b7778] sm:text-sm lg:text-base">
                    <p>{comments.length} comments posted</p>
                    <button
                        type="button"
                        onClick={() => logModalAction('comments-sort')}
                        className="inline-flex items-center gap-2 font-medium text-[#6f6a6c] transition-colors hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                    >
                        <span className="text-sm leading-none lg:text-base">⇅</span>
                        Sort by...
                    </button>
                </div>
            </header>

            <div className="mt-8 w-full">
                <form
                    className="flex flex-wrap items-center gap-3 border-b border-[#ece9ea] pb-4 sm:flex-nowrap sm:gap-4 sm:pb-5"
                    onSubmit={(event) => {
                        event.preventDefault()
                        const nextValue = draftComment.trim()
                        console.log('[COMMENT] submit', nextValue)
                        setDraftComment('')
                    }}
                >
                    <Avatar
                        src="/assets/misc/profile_pick_example.jpg"
                        name="Current user"
                        size="sm"
                        className="size-10 border-[#dbd6d7]"
                    />
                    <input
                        aria-label="Write a comment"
                        type="text"
                        value={draftComment}
                        onChange={(event) => setDraftComment(event.target.value)}
                        placeholder="Leave a comment!"
                        className="h-10 min-w-0 flex-1 rounded-md border border-[#e3dfe1] bg-[#fffbfc] px-3 text-sm text-[#222] placeholder:text-[#8a8688] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                    />
                    <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-[#222] px-4 text-sm font-medium text-[#fffbfc] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222]/40"
                    >
                        Post
                    </button>
                </form>

                {isLoading ? (
                    <div className="mt-6 space-y-5">
                        <SkeletonBlock className="h-28 w-full rounded-lg sm:h-32" />
                        <SkeletonBlock className="h-24 w-full rounded-lg sm:h-28" />
                        <SkeletonBlock className="h-24 w-full rounded-lg sm:h-28" />
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-6">
                        <ErrorState message={error} onRetry={onRetry} />
                    </div>
                ) : null}

                {!isLoading && !error && comments.length === 0 ? (
                    <div className="mt-6">
                        <EmptyState
                            title="No comments yet"
                            description="There are currently no API comments for this figurine."
                        />
                    </div>
                ) : null}

                {!isLoading && !error && comments.length > 0 ? (
                    <div className="mt-6 space-y-5 sm:space-y-6">
                        {comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    )
}
