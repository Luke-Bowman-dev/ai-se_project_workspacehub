import { useState, type FormEvent } from "react";
import { commentService } from "../services/commentService";
import type { Comment, User } from "../types/models";

interface PopulatedCommentAuthor {
  _id: string;
  firstName: string;
  lastName: string;
}

const getPopulatedAuthor = (
  authorId: unknown,
): PopulatedCommentAuthor | null => {
  if (
    typeof authorId !== "object" ||
    authorId === null ||
    !("_id" in authorId) ||
    !("firstName" in authorId) ||
    !("lastName" in authorId) ||
    typeof authorId._id !== "string" ||
    typeof authorId.firstName !== "string" ||
    typeof authorId.lastName !== "string"
  ) {
    return null;
  }

  return {
    _id: authorId._id,
    firstName: authorId.firstName,
    lastName: authorId.lastName,
  };
};

interface TaskCommentsProps {
  taskId: string;
  commentCount: number;
  users: User[];
}

export const TaskComments = ({
  taskId,
  commentCount,
  users,
}: TaskCommentsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadComments = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const loadedComments = await commentService.list(taskId);
      setComments(loadedComments);
      setCommentsLoaded(true);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load comments",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    const willExpand = !isExpanded;
    setIsExpanded(willExpand);

    if (willExpand && !commentsLoaded && !isLoading) {
      void loadComments();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmitting || !commentsLoaded) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      const createdComment = await commentService.create(taskId, {
        content: trimmedContent,
      });
      setComments((current) => [createdComment, ...current]);
      setContent("");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to add comment",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="rounded-[10px] border border-slate-200 px-4 py-2 text-sm font-medium text-ink transition hover:bg-slate-50 active:opacity-70"
        onClick={handleToggle}
        type="button"
      >
        {isExpanded
          ? "Hide Comments"
          : `Show Comments (${commentsLoaded ? comments.length : commentCount})`}
      </button>
      {isExpanded ? (
        <section className="basis-full rounded-3xl border border-slate-200 p-4">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading comments...</p>
          ) : null}
          {loadError ? (
            <div className="mb-4" role="alert">
              <p className="text-sm text-danger">{loadError}</p>
              <button
                className="mt-2 text-sm font-medium text-ink underline"
                disabled={isLoading}
                onClick={() => void loadComments()}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : null}
          <form
            className="space-y-3"
            onSubmit={(event) => void handleSubmit(event)}
          >
            <label
              className="block text-sm font-medium text-ink"
              htmlFor={`comment-${taskId}`}
            >
              Add a comment
            </label>
            <textarea
              className="min-h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 transition placeholder:text-[#94A3B880] hover:border-slate-300"
              id={`comment-${taskId}`}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write a comment..."
              disabled={!commentsLoaded || isSubmitting}
              value={content}
            />
            <button
              className="rounded-[10px] bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!content.trim() || !commentsLoaded || isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Adding comment..." : "Add comment"}
            </button>
          </form>
          {actionError ? (
            <p className="mt-3 text-sm text-danger" role="alert">
              {actionError}
            </p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {comments.map((comment) => {
              const populatedAuthor = getPopulatedAuthor(comment.authorId);
              const author = users.find(
                (user) =>
                  user._id === (populatedAuthor?._id ?? comment.authorId),
              );
              const authorName = populatedAuthor
                ? `${populatedAuthor.firstName} ${populatedAuthor.lastName}`
                : author
                  ? `${author.firstName} ${author.lastName}`
                  : "Unknown user";

              return (
                <li className="rounded-2xl bg-slate-50 p-4" key={comment._id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="font-medium text-ink">{authorName}</p>
                    <time
                      className="text-xs text-slate-500"
                      dateTime={comment.createdAt}
                    >
                      {new Date(comment.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {comment.content}
                  </p>
                </li>
              );
            })}
          </ul>
          {commentsLoaded && comments.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No comments yet.</p>
          ) : null}
        </section>
      ) : null}
    </>
  );
};
