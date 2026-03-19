import { useState } from 'react'
import type { ApiFigureComment } from '../../api/types'
import {
    formatRelativeDate,
    getCommentAuthor,
    getCommentContent,
    getCommentDislikes,
    getCommentLikes,
} from '../../utils/figurine'
import { Avatar } from '../common/Avatar'
import { logModalAction } from '../../utils/modal'

type CommentItemProps = {
    comment: ApiFigureComment
    nested?: boolean
}

function countLabel(value: number | null) {
    return value === null ? 'N/A' : String(value)
}

export function CommentItem({ comment, nested = false }: CommentItemProps) {
    const author = getCommentAuthor(comment)
    const likes = getCommentLikes(comment)
    const dislikes = getCommentDislikes(comment)
    const replies = Array.isArray(comment.replies) ? comment.replies : []
    const [isRepliesExpanded, setIsRepliesExpanded] = useState(false)

    return (
        <article className={`flex items-start gap-3 sm:gap-4 ${nested ? 'pl-8 sm:pl-12' : ''}`}>
            <Avatar
                src="/assets/misc/profile_pick_example.jpg"
                name={author}
                size={nested ? 'sm' : 'lg'}
                className={
                    nested
                        ? 'size-9 border-[#dbd6d7] sm:size-10'
                        : 'size-12 border-[#dbd6d7] sm:size-14'
                }
            />

            <div
                className={`min-w-0 flex-1 pb-4 ${
                    nested ? '' : 'border-b border-[#ece9ea] sm:pb-6'
                }`}
            >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 leading-none text-[#6f6a6c]">
                    <p className="text-base font-semibold text-[#222] sm:text-lg">
                        {author}
                    </p>
                    <span className="text-xs font-light sm:text-sm">
                        {formatRelativeDate(comment.created_at)}
                    </span>
                </div>
                <p className="mt-2 text-sm font-normal leading-relaxed text-[#222] sm:text-base">
                    {getCommentContent(comment)}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6f6a6c] sm:text-sm">
                    <button
                        type="button"
                        onClick={() => console.log('[COMMENT] like', comment.id)}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        aria-label={`Like comment from ${author}`}
                    >
                        <img
                            src="/assets/icons/comments/like.svg"
                            alt=""
                            className="size-4"
                        />
                        {countLabel(likes)}
                    </button>
                    <button
                        type="button"
                        onClick={() => console.log('[COMMENT] dislike', comment.id)}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-[#222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                        aria-label={`Dislike comment from ${author}`}
                    >
                        <img
                            src="/assets/icons/comments/dislike.svg"
                            alt=""
                            className="size-4"
                        />
                        {countLabel(dislikes)}
                    </button>
                    <button
                        type="button"
                        onClick={() => logModalAction('comment-reply')}
                        className="font-medium text-[#ed5f7f] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40"
                    >
                        Reply
                    </button>
                </div>

                {!nested && replies.length > 0 ? (
                    <button
                        type="button"
                        onClick={() => {
                            setIsRepliesExpanded((value) => !value)
                            logModalAction(
                                isRepliesExpanded
                                    ? 'comment-replies-collapse'
                                    : 'comment-replies-expand'
                            )
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#ed5f7f] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed5f7f]/40 sm:text-sm"
                    >
                        <span className={`text-base leading-none transition-transform ${isRepliesExpanded ? 'rotate-180' : ''}`}>
                            ⌄
                        </span>
                        <span>
                            {replies.length} {replies.length > 1 ? 'Replies' : 'Reply'}
                        </span>
                    </button>
                ) : null}

                {replies.length > 0 && (nested || isRepliesExpanded) ? (
                    <div className="mt-4 space-y-4 sm:space-y-5">
                        {replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} nested />
                        ))}
                    </div>
                ) : null}
            </div>
        </article>
    )
}
