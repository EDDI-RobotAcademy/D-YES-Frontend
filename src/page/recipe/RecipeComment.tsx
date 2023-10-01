import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { getRecipeCommentList, recipeCommentRegister } from "./api/RecipeApi";
import { RecipeCommentList } from "./entity/RecipeCommentList";

import "./css/RecipeComment.css";

interface RecipeCommentProps {
  recipeId: string;
}

const RecipeComment: React.FC<RecipeCommentProps> = ({ recipeId }) => {
  const [comment, setComment] = useState<string>("");
  const [loadedItems, setLoadedItems] = useState<RecipeCommentList>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecipeCommentList = async () => {
      try {
        const data = await getRecipeCommentList(recipeId);
        setLoadedItems(data);
        setIsLoading(true);
      } catch (error) {
        toast.error("댓글 정보를 가져오는데 실패했습니다");
      }
    };
    fetchRecipeCommentList();
  }, []);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newComment = event.target.value;
    setComment(newComment);
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
    if (!data) {
      toast.error("댓글 등록 중 오류가 발생했습니다");
    }
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
                  <div className="recipe-comment-container">
                    <p className="recipe-comment-date">{comment.commentDate}</p>
                    <p className="recipe-comment-nickname">{comment.nickName}</p>
                    {comment.isDeleted ? (
                      <>삭제된 댓글입니다.</>
                    ) : (
                      <p className="recipe-comment-content">{comment.content}</p>
                    )}
                  </div>
                  <div className="recipe-comment-btn">
                    <Button
                      variant="outlined"
                      style={{
                        minWidth: "60px",
                        maxHeight: "40px",
                        color: "#578b36",
                        borderColor: "#578b36",
                      }}
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
                    >
                      삭제
                    </Button>
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
