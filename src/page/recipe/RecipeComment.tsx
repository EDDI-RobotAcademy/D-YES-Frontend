import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { recipeCommentRegister } from "./api/RecipeApi";

interface RecipeCommentProps {
  recipeId: string;
}

const RecipeComment: React.FC<RecipeCommentProps> = ({ recipeId }) => {
  const [comment, setComment] = useState<string>("");

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
    <div>
      <div className="recipe-detail-info">
        <p className="recipe-detail-info-font">댓글</p>
      </div>
      <div className="recipe-detail-comment-container">
        <TextField
          className="recipe-detail-comment-field"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={handleCommentChange}
        />
        <div className="recipe-detail-comment-btn">
          <Button
            type="submit"
            variant="outlined"
            style={{ minWidth: "50px", color: "#578b36", borderColor: "#578b36" }}
            onClick={handleCommentRegister}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeComment;
