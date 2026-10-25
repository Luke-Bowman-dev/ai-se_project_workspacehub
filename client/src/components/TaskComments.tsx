import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { commentService } from "../services/commentService";
import type { Comment, User } from "../types/models";
import { canManageComment } from "../utils/permissions";

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
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

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

  const handleUpdateComment = async (
    event: FormEvent<HTMLFormElement>,
    commentId: string,
  ) => {
    event.preventDefault();
    const trimmedContent = editingContent.trim();

    if (!trimmedContent || isUpdatingComment || deletingCommentId) {
      return;
    }

    setIsUpdatingComment(true);
    setActionError(null);

    try {
      const updatedComment = await commentService.update(taskId, commentId, {
        content: trimmedContent,
      });
      setComments((current) =>
        current.map((comment) =>
          comment._id === commentId ? updatedComment : comment,
        ),
      );
      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to update comment",
      );
    } finally {
      setIsUpdatingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isUpdatingComment || deletingCommentId) {
      return;
    }

    setDeletingCommentId(commentId);
    setActionError(null);

    try {
      await commentService.delete(taskId, commentId);
      setComments((current) =>
        current.filter((comment) => comment._id !== commentId),
      );
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditingContent("");
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to delete comment",
      );
    } finally {
      setDeletingCommentId(null);
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
              className="w-24 rounded-[10px] bg-ink px-4 py-2 text-center text-sm font-medium text-white transition hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
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
              const mayManageComment =
                canManageComment(user, comment) ||
                user?._id === populatedAuthor?._id;

              return (
                <li className="rounded-2xl bg-slate-50 p-4" key={comment._id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="font-medium text-ink">{authorName}</p>
                    <div className="flex items-center gap-3">
                      <time
                        className="text-xs text-slate-500"
                        dateTime={comment.createdAt}
                      >
                        {new Date(comment.createdAt).toLocaleString()}
                      </time>
                      {mayManageComment ? (
                        <div className="flex flex-col items-start gap-1">
                          <button
                            className="w-24 rounded-[10px] bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={
                              isUpdatingComment || deletingCommentId !== null
                            }
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditingContent(comment.content);
                              setActionError(null);
                            }}
                            type="button"
                          >
                            Update
                          </button>
                          <button
                            className="w-24 rounded-[10px] px-4 py-2 text-center text-sm font-normal text-danger transition hover:bg-rose-50 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={
                              isUpdatingComment || deletingCommentId !== null
                            }
                            onClick={() =>
                              void handleDeleteComment(comment._id)
                            }
                            type="button"
                          >
                            {deletingCommentId === comment._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {editingCommentId === comment._id ? (
                    <form
                      className="mt-2 flex flex-wrap gap-2"
                      onSubmit={(event) =>
                        void handleUpdateComment(event, comment._id)
                      }
                    >
                      <input
                        aria-label="Edit comment"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        disabled={isUpdatingComment}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                        value={editingContent}
                      />
                      <button
                        className="rounded-[10px] bg-ink px-3 py-2 text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={
                          !editingContent.trim() ||
                          isUpdatingComment ||
                          deletingCommentId !== null
                        }
                        type="submit"
                      >
                        {isUpdatingComment ? "Saving..." : "Save"}
                      </button>
                    </form>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {comment.content}
                    </p>
                  )}
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
