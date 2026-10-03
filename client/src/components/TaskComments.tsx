import { useState, type FormEvent } from "react";
import type { Comment, User } from "../types/models";

interface TaskCommentsProps {
  taskId: string;
  users: User[];
}

export const TaskComments = ({ taskId, users }: TaskCommentsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(() => [
    {
      _id: `mock-comment-${taskId}`,
      organizationId: users[0]?.organizationId ?? "",
      taskId,
      authorId: users[0]?._id ?? "mock-author",
      content: "Use comments to keep task updates and discussion in one place.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [content, setContent] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    const timestamp = new Date().toISOString();
    setComments((current) => [
      {
        _id: `mock-comment-${Date.now()}`,
        organizationId: users[0]?.organizationId ?? "",
        taskId,
        authorId: users[0]?._id ?? "mock-author",
        content: trimmedContent,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      ...current,
    ]);
    setContent("");
  };

  return (
    <>
      <button
        className="rounded-[10px] border border-slate-200 px-4 py-2 text-sm font-medium text-ink transition hover:bg-slate-50 active:opacity-70"
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        {isExpanded ? "Hide Comments" : `Show Comments (${comments.length})`}
      </button>
      {isExpanded ? (
        <section className="basis-full rounded-3xl border border-slate-200 p-4">
          <form className="space-y-3" onSubmit={handleSubmit}>
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
              value={content}
            />
            <button
              className="rounded-[10px] bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!content.trim()}
              type="submit"
            >
              Add comment
            </button>
          </form>
          <ul className="mt-4 space-y-3">
            {comments.map((comment) => {
              const author = users.find(
                (user) => user._id === comment.authorId,
              );
              const authorName = author
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
        </section>
      ) : null}
    </>
  );
};
