import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import type { AuthPayload } from "../types/domain";
import { AppError } from "../utils/appError";
import { requireString } from "../utils/validators";
import { canManageComment } from "./permissionService";

const ensureTaskInOrganization = async (
  taskId: string,
  organizationId: string,
) => {
  const task = await Task.findOne({ _id: taskId, organizationId });

  if (!task) {
    throw new AppError("Task not found", 404);
  }
};

const getScopedComment = async (
  organizationId: string,
  taskId: string,
  commentId: string,
) => {
  const comment = await Comment.findOne({
    _id: commentId,
    taskId,
    organizationId,
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  return comment;
};

const ensureCanManageComment = (actor: AuthPayload, authorId: string) => {
  if (!canManageComment(actor, authorId)) {
    throw new AppError(
      "You do not have permission to manage this comment",
      403,
    );
  }
};

export const listComments = async (organizationId: string, taskId: string) => {
  await ensureTaskInOrganization(taskId, organizationId);

  return Comment.find({ organizationId, taskId })
    .populate("authorId", "firstName lastName")
    .sort({ createdAt: -1 });
};

export const getCommentById = async (
  organizationId: string,
  taskId: string,
  commentId: string,
) => {
  await ensureTaskInOrganization(taskId, organizationId);
  const comment = await getScopedComment(organizationId, taskId, commentId);
  return comment.populate("authorId", "firstName lastName");
};

export const createComment = async (
  actor: AuthPayload,
  taskId: string,
  payload: Record<string, unknown>,
) => {
  await ensureTaskInOrganization(taskId, actor.organizationId);
  const content = requireString(payload.content, "Content");

  const comment = await Comment.create({
    organizationId: actor.organizationId,
    taskId,
    authorId: actor.userId,
    content,
  });

  return comment.populate("authorId", "firstName lastName");
};

export const updateComment = async (
  actor: AuthPayload,
  taskId: string,
  commentId: string,
  payload: Record<string, unknown>,
) => {
  await ensureTaskInOrganization(taskId, actor.organizationId);
  const comment = await getScopedComment(
    actor.organizationId,
    taskId,
    commentId,
  );
  ensureCanManageComment(actor, String(comment.authorId));
  comment.content = requireString(payload.content, "Content");
  await comment.save();

  return comment.populate("authorId", "firstName lastName");
};

export const deleteComment = async (
  actor: AuthPayload,
  taskId: string,
  commentId: string,
) => {
  await ensureTaskInOrganization(taskId, actor.organizationId);
  const comment = await getScopedComment(
    actor.organizationId,
    taskId,
    commentId,
  );
  ensureCanManageComment(actor, String(comment.authorId));
  await comment.deleteOne();

  return { deleted: true };
};
