import * as React from "react";
import { Card, CardContent, CardMedia } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { RecipeListResponseForm } from "./entity/RecipeList";
import { getRecipeList } from "./api/RecipeApi";
import { toast } from "react-toastify";
import TimerIcon from "@mui/icons-material/Timer";
import { getImageUrl } from "utility/s3/awsS3";

import "./css/RecipeListPage.css";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: 200,
  [theme.breakpoints.down("sm")]: {
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

const RecipeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loadedItems, setLoadedItems] = React.useState<RecipeListResponseForm[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const showRecipeDetail = (recipeId: number) => {
    navigate(`/recipe/detail/${recipeId}`);
  };

  React.useEffect(() => {
    const fetchRecipeListData = async () => {
      try {
        const data = await getRecipeList();
        setLoadedItems(data);
        setIsLoading(true);
      } catch (error) {
        toast.error("레시피 목록을 가져오는데 실패했습니다");
      }
    };
    fetchRecipeListData();
  }, []);

  const registerRecipe = () => {
    navigate("/recipe/register");
  };

  return (
    <div className="recipe-list-container">
      <div className="recipe-list-grid">
        <div className="recipe-list-page-name">
          <p>레시피 목록</p>
          <p className="recipe-list-reg-btn" onClick={registerRecipe}>
            레시피 등록하기
          </p>
        </div>
        <hr />
        {isLoading ? (
          loadedItems && loadedItems.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                minWidth: 300,
                width: "100%",
                gap: "5px",
              }}
            >
              {loadedItems?.map((recipe: RecipeListResponseForm, idx: number) => (
                <Card key={idx} sx={{ maxWidth: "340px", alignItems: "center" }}>
                  <CardMedia>
                    <ImageButton
                      focusRipple
                      style={{ width: "100%" }}
                      onClick={() => showRecipeDetail(recipe.recipeId)}
                    >
                      <ImageSrc
                        style={{ backgroundImage: `url(${getImageUrl(recipe.recipeMainImage)})` }}
                      />
                      <ImageBackdrop className="MuiImageBackdrop-root" />
                      <Image>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="inherit"
                          sx={{
                            position: "relative",
                            p: 4,
                            pt: 2,
                            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                          }}
                        >
                          {recipe.recipeName}
                          <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                      </Image>
                    </ImageButton>
                  </CardMedia>
                  <CardContent>
                    <div className="recipe-list-info">
                      <div className="recipe-list-description">{recipe.recipeDescription}</div>
                      <div className="recipe-list-detail">
                        <p className="recipe-list-icon">
                          <TimerIcon fontSize="inherit" />
                          {recipe.cookingTime}분
                        </p>
                        <p>{recipe.nickName}님의 레시피</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <p>레시피 정보가 없습니다</p>
          )
        ) : (
          <p>레시피를 불러오는 중</p>
        )}
      </div>
    </div>
  );
};

export default RecipeListPage;
