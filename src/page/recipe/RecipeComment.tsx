import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import {
  getRecipeCommentList,
  recipeCommentDelete,
  recipeCommentModify,
  recipeCommentRegister,
} from "./api/RecipeApi";
import { RecipeCommentList } from "./entity/RecipeCommentList";

import "./css/RecipeComment.css";

interface RecipeCommentProps {
  recipeId: string;
}

const RecipeComment: React.FC<RecipeCommentProps> = ({ recipeId }) => {
  const [comment, setComment] = useState<string>("");
  const [modifiedComment, setModifiedComment] = useState<string>("");
  const [loadedItems, setLoadedItems] = useState<RecipeCommentList>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commentModify, setCommentModify] = useState<{ [key: number]: boolean }>({});

  const fetchRecipeCommentList = async () => {
    try {
      const data = await getRecipeCommentList(recipeId);
      setLoadedItems(data);
      setIsLoading(true);
    } catch (error) {
      toast.error("댓글 정보를 가져오는데 실패했습니다");
    }
  };

  useEffect(() => {
    fetchRecipeCommentList();
  }, []);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newComment = event.target.value;
    setComment(newComment);
  };

  const handleCommentModifyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const modifiedComment = event.target.value;
    setModifiedComment(modifiedComment);
  };

  const handleCommentRegister = async () => {
    if (comment === "") return toast.error("댓글을 입력해주세요");
    const requestData = {
      userToken: localStorage.getItem("userToken") || "",
      recipeId: Number(recipeId),
      commentContent: comment,
    };
    const data = await recipeCommentRegister(requestData);
    setComment("");
    fetchRecipeCommentList();
    if (!data) {
      toast.error("댓글 등록 중 오류가 발생했습니다");
    }
  };

  const handleModifyTextfieldOpen = (commentId: number) =>
    setCommentModify((prevComment) => ({
      ...prevComment,
      [commentId]: !prevComment[commentId],
    }));

  const handleCommentModify = async (commentId: number) => {
    if (modifiedComment === "") return toast.error("댓글을 입력해주세요");
    try {
      const isModify = await recipeCommentModify(commentId, modifiedComment);
      if (isModify) {
        toast.success("댓글이 수정되었습니다");
      } else {
        toast.error("댓글 수정에 실패했습니다");
      }
    } catch (error) {
      toast.error("댓글 수정 요청 중 오류가 발생했습니다");
    }
    handleModifyTextfieldOpen(commentId);
    fetchRecipeCommentList();
    setModifiedComment("");
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      const isDelete = await recipeCommentDelete(commentId);
      if (isDelete) {
        toast.success("댓글이 삭제되었습니다");
      } else {
        toast.error("댓글 삭제에 실패했습니다");
      }
    } catch (error) {
      toast.error("댓글 삭제 요청 중 오류가 발생했습니다");
    }
    fetchRecipeCommentList();
  };

  return (
    <div className="recipe-comment-flex">
      <div className="recipe-comment-info">
        댓글 ({loadedItems?.recipeCommentInfoResponseList.length || null})
      </div>
      <div className="recipe-comment-reg-container">
        <TextField
          className="recipe-comment-reg-field"
          placeholder="댓글을 입력하세요"
          value={comment}
          fullWidth
          multiline
          onChange={handleCommentChange}
        />
        <div className="recipe-comment-reg-btn">
          <Button
            type="submit"
            variant="outlined"
            style={{ minWidth: "50px", color: "#578b36", borderColor: "#578b36" }}
            onClick={handleCommentRegister}
          >
            확인
          </Button>
        </div>
        {loadedItems && isLoading ? (
          <div>
            {loadedItems.recipeCommentInfoResponseList.map((comment, idx) => (
              <div key={idx}>
                <div className="recipe-comment-grid">
                  {comment.isDeleted ? (
                    <p className="recipe-comment-deleted-content">작성자가 삭제한 댓글입니다.</p>
                  ) : (
                    <div className="recipe-comment-container">
                      <p className="recipe-comment-date">{comment.commentDate}</p>
                      <p className="recipe-comment-nickname">{comment.nickName}</p>
                      {commentModify[comment.commentId] ? (
                        <TextField
                          placeholder="댓글을 입력하세요"
                          multiline
                          value={modifiedComment}
                          onChange={handleCommentModifyChange}
                        />
                      ) : (
                        <p className="recipe-comment-content">{comment.content}</p>
                      )}
                    </div>
                  )}
                  <div className="recipe-comment-btn">
                    {comment.isMyRecipeComment && !comment.isDeleted ? (
                      <>
                        {commentModify[comment.commentId] ? (
                          <>
                            <div className="recipe-comment-btn">
                              <Button
                                type="submit"
                                variant="outlined"
                                style={{
                                  minWidth: "60px",
                                  color: "#578b36",
                                  borderColor: "#578b36",
                                }}
                                onClick={() => handleModifyTextfieldOpen(comment.commentId)}
                              >
                                취소
                              </Button>
                              <Button
                                type="submit"
                                variant="contained"
                                style={{
                                  minWidth: "60px",
                                  color: "white",
                                  backgroundColor: "#578b36",
                                }}
                                onClick={() => {
                                  handleCommentModify(comment.commentId);
                                }}
                              >
                                저장
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outlined"
                              style={{
                                minWidth: "60px",
                                maxHeight: "40px",
                                color: "#578b36",
                                borderColor: "#578b36",
                              }}
                              onClick={() => handleModifyTextfieldOpen(comment.commentId)}
                            >
                              수정
                            </Button>
                            <Button
                              variant="outlined"
                              style={{
                                minWidth: "60px",
                                maxHeight: "40px",
                                color: "#578b36",
                                borderColor: "#578b36",
                              }}
                              onClick={() => handleCommentDelete(comment.commentId)}
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>댓글 정보를 불러오는 중</div>
        )}
      </div>
    </div>
  );
};

export default RecipeComment;
