import {
  Button,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Select,
  SelectChangeEvent,
  Backdrop,
  Box,
} from "@mui/material";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import useRecipeStore from "./store/RecipeStore";
import { recipeRegister } from "./api/RecipeApi";
import { compressImg } from "utility/s3/imageCompression";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { uploadFileAwsS3 } from "utility/s3/awsS3";
import { RecipeName } from "./entity/RecipeName";
import { RecipeContent } from "./entity/RecipeContent";
import { RecipeIngredient } from "./entity/RecipeIngredient";
import { RecipeImage } from "./entity/RecipeImage";
import { RecipeCategory } from "./entity/RecipeCategory";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearIcon from "@mui/icons-material/Clear";
import TimerIcon from "@mui/icons-material/Timer";

import "./css/RecipeRegisterPage.css";

interface Category {
  value: string;
  label: string;
}

const RecipeRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { recipes, setRecipes } = useRecipeStore();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [additionalIngredient, setAdditionalIngredient] = React.useState([{ name: "", unit: "" }]);
  const [seasoning, setSeasoning] = React.useState([{ name: "", unit: "" }]);
  const [recipeDetails, setRecipeDetails] = React.useState([{ step: 1, description: "" }]);
  const [openBackdrop1, setOpenBackdrop1] = React.useState(false);
  const [openBackdrop2, setOpenBackdrop2] = React.useState(false);
  const [selectedMainMenu, setSelectedMainMenu] = React.useState<Category>();
  const [selectedSubMenu, setSelectedSubMenu] = React.useState<Category>();
  const [servingSize, setServingSize] = React.useState(1);
  const mutation = useMutation(recipeRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("recipe", data);
      navigate("/recipe/list");
    },
  });

  // 이미지
  const onMainImageDrop = async (acceptedFile: File[]) => {
    if (acceptedFile.length) {
      try {
        const compressedImage = await compressImg(acceptedFile[0]);
        setRecipes({
          ...recipes,
          recipeMainImageRegisterRequest: { recipeMainImage: compressedImage },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { getRootProps: mainImageRootProps, getInputProps: mainImageInputProps } = useDropzone({
    onDrop: onMainImageDrop,
    maxFiles: 1,
  });

  // 레시피 이름
  const handleRecipeNameChange = (newRecipeName: string) => {
    setRecipes({
      ...recipes,
      recipeRegisterRequest: {
        ...recipes.recipeRegisterRequest,
        recipeName: newRecipeName,
      },
    });
  };

  // 간단한 설명
  const handleRecipeDescriptionChange = (newRecipeDescription: string) => {
    setRecipes({
      ...recipes,
      recipeContentRegisterRequest: {
        ...recipes.recipeContentRegisterRequest,
        recipeDescription: newRecipeDescription,
      },
    });
  };

  // 조리시간
  const handleTimeChange = (newTime: string) => {
    setRecipes({
      ...recipes,
      recipeContentRegisterRequest: {
        ...recipes.recipeContentRegisterRequest,
        cookingTime: newTime,
      },
    });
  };

  // 난이도
  const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRecipes({
      ...recipes,
      recipeContentRegisterRequest: {
        ...recipes.recipeContentRegisterRequest,
        difficulty: value,
      },
    });
  };

  const recipeMainCategory = [
    { value: "KOREAN", label: "한식" },
    { value: "WESTERN", label: "양식" },
    { value: "JAPANESE", label: "일식" },
    { value: "CHINESE", label: "중식" },
    { value: "FUSION", label: "퓨전" },
    { value: "STREET_FOOD", label: "분식" },
    { value: "BAKING", label: "베이킹" },
  ];

  const recipeSubCategory = [
    { value: "RICE_BOWL", label: "덮밥" },
    { value: "FRIED_RICE", label: "볶음밥" },
    { value: "NOODLE", label: "면요리" },
    { value: "SALAD", label: "샐러드" },
    { value: "SIDE_DISHES", label: "밑반찬" },
    { value: "STIR_FRY", label: "볶음요리" },
    { value: "STEW", label: "찌개·국" },
    { value: "BRAISED_DISHES", label: "조림" },
    { value: "STEAMED_DISHES", label: "찜" },
    { value: "HOT_POT", label: "전골" },
    { value: "PANCAKES_FRIED", label: "전·튀김" },
    { value: "SOUP", label: "스프" },
    { value: "BRUNCH", label: "브런치" },
    { value: "DESSERT", label: "디저트" },
    { value: "GRILLED_DISHES", label: "구이" },
    { value: "SAUCE", label: "소스" },
    { value: "OTHERS", label: "기타" },
  ];

  const handleBackdropOpen = (backdropNumber: number) => {
    if (backdropNumber === 1) {
      setOpenBackdrop1(true);
    } else if (backdropNumber === 2) {
      setOpenBackdrop2(true);
    }
  };

  const handleBackdropClose = (backdropNumber: number) => {
    if (backdropNumber === 1) {
      setOpenBackdrop1(false);
    } else if (backdropNumber === 2) {
      setOpenBackdrop2(false);
    }
  };

  // 몇인분
  const increaseServingSize = async () => {
    setServingSize(servingSize + 1);
  };

  const decreaseServingSize = async () => {
    if (servingSize > 1) {
      setServingSize(servingSize - 1);
    }
  };

  const mainIngredients = [
    { value: "CABBAGE", label: "양배추" },
    { value: "CARROT", label: "당근" },
    { value: "CUCUMBER", label: "오이" },
    { value: "KIMCHI_CABBAGE", label: "배추" },
    { value: "ONION", label: "양파" },
    { value: "POTATO", label: "감자" },
    { value: "WELSH_ONION", label: "대파" },
    { value: "YOUNG_PUMPKIN", label: "청경채" },
  ];

  // 메인재료 select box 변경
  const handleMainIngredientChange = (event: SelectChangeEvent<{ value: string }>) => {
    const value = event.target.value as string;
    setRecipes({
      ...recipes,
      recipeIngredientRegisterRequest: {
        ...recipes.recipeIngredientRegisterRequest,
        mainIngredient: value,
      },
    });
  };

  // 메인재료 양 변경
  const handleMainIngredientAmountChange = (newIngrediendAmount: string) => {
    setRecipes({
      ...recipes,
      recipeIngredientRegisterRequest: {
        ...recipes.recipeIngredientRegisterRequest,
        mainIngredientAmount: newIngrediendAmount,
      },
    });
  };

  // 부가 재료 이름, 양 변경
  const handleAdditionalIngredientChange = (index: number, name: string, unit: string) => {
    const updatedIngredients = [...additionalIngredient];
    updatedIngredients[index] = { name, unit };
    setAdditionalIngredient(updatedIngredients);
  };

  // 부가 재료 input 필드 추가
  const addAdditionalIngredient = () => {
    setAdditionalIngredient([...additionalIngredient, { name: "", unit: "" }]);
  };

  // 부가 재료 input 필드 제거
  const removeAdditionalIngredient = (index: number) => {
    const updatedIngredients = [...additionalIngredient];
    updatedIngredients.splice(index, 1);
    setAdditionalIngredient(updatedIngredients);
  };

  // 양념 이름, 양 변경
  const handleSeasoningChange = (index: number, name: string, unit: string) => {
    const updatedIngredients = [...seasoning];
    updatedIngredients[index] = { name, unit };
    setSeasoning(updatedIngredients);
  };

  // 양념 input 필드 추가
  const addSeasoning = () => {
    setSeasoning([...seasoning, { name: "", unit: "" }]);
  };

  // 양념 input 필드 제거
  const removeSeasoning = (index: number) => {
    const updatedIngredients = [...seasoning];
    updatedIngredients.splice(index, 1);
    setSeasoning(updatedIngredients);
  };

  // 만드는법
  const handleRecipeDetailChange = (step: number, newDescription: string) => {
    const updatedDetails = recipeDetails.map((detail) =>
      detail.step === step ? { ...detail, description: newDescription } : detail
    );
    setRecipeDetails(updatedDetails);
    const descriptionOnly = updatedDetails.map((detail) => detail.description);
    setRecipes({
      ...recipes,
      recipeContentRegisterRequest: {
        ...recipes.recipeContentRegisterRequest,
        recipeDetails: descriptionOnly,
      },
    });
  };

  // 만드는법 input 필드 추가
  const addRecipeDetail = () => {
    const newStep = currentStep + 1;
    setRecipeDetails((prevDetails) => [...prevDetails, { step: newStep, description: "" }]);
    setCurrentStep(newStep);
  };

  // 만드는법 input 필드 제거
  const removeRecipeDetail = (index: number) => {
    const updatedIngredients = [...recipeDetails];
    updatedIngredients.splice(index, 1);
    setRecipeDetails(updatedIngredients);
  };

  // 등록
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const mainFileToUpload = recipes.recipeMainImageRegisterRequest?.recipeMainImage
      ? recipes.recipeMainImageRegisterRequest.recipeMainImage
      : "";

    if (!mainFileToUpload) return toast.error("이미지를 등록해주세요");
    if (!recipes.recipeRegisterRequest?.recipeName)
      return toast.error("레시피 이름을 작성해주세요");
    if (!recipes.recipeContentRegisterRequest?.recipeDescription)
      return toast.error("레시피 설명을 작성해주세요");
    if (!recipes.recipeContentRegisterRequest?.cookingTime)
      return toast.error("예상 소요 시간을 작성해주세요");
    if (!recipes.recipeContentRegisterRequest?.difficulty)
      return toast.error("레시피 난이도를 선택해주세요");
    if (!selectedMainMenu) return toast.error("요리 분류 카테고리를 선택해주세요");
    if (!selectedSubMenu) return toast.error("요리 종류 카테고리를 선택해주세요");
    if (
      !recipes.recipeIngredientRegisterRequest?.mainIngredient ||
      !recipes.recipeIngredientRegisterRequest?.mainIngredientAmount
    )
      return toast.error("메인 재료를 추가해주세요");
    if (!recipes.recipeContentRegisterRequest?.recipeDetails)
      return toast.error("만드는 방법을 작성해주세요");

    const recipeRegisterRequest: RecipeName = {
      recipeName: recipes.recipeRegisterRequest.recipeName,
    };

    const recipeContentRegisterRequest: RecipeContent = {
      recipeDetails: recipes.recipeContentRegisterRequest.recipeDetails,
      recipeDescription: recipes.recipeContentRegisterRequest.recipeDescription,
      cookingTime: recipes.recipeContentRegisterRequest.cookingTime,
      difficulty: recipes.recipeContentRegisterRequest.difficulty,
    };

    const recipeCategoryRegisterRequest: RecipeCategory = {
      recipeMainCategory: selectedMainMenu.value,
      recipeSubCategory: selectedSubMenu.value,
    };

    const recipeIngredientRegisterRequest: RecipeIngredient = {
      servingSize: servingSize,
      mainIngredient: recipes.recipeIngredientRegisterRequest.mainIngredient,
      mainIngredientAmount: recipes.recipeIngredientRegisterRequest.mainIngredientAmount,
      otherIngredienList: recipes.recipeIngredientRegisterRequest.otherIngredienList,
      seasoningList: recipes.recipeIngredientRegisterRequest.seasoningList,
    };

    // 모든 유효성 검사 통과 후 S3에 이미지 업로드
    const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

    const mainImage = mainFileToUpload
      ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
      : "undefined main image";

    const data = {
      userToken: localStorage.getItem("userToken") || "",
      recipeRegisterRequest: recipeRegisterRequest,
      recipeContentRegisterRequest: recipeContentRegisterRequest,
      recipeCategoryRegisterRequest: recipeCategoryRegisterRequest,
      recipeIngredientRegisterRequest: recipeIngredientRegisterRequest,
      recipeMainImageRegisterRequest: mainImage,
    };

    await mutation.mutateAsync({
      ...data,
      recipeRegisterRequest: recipeRegisterRequest,
      recipeContentRegisterRequest: recipeContentRegisterRequest,
      recipeCategoryRegisterRequest: recipeCategoryRegisterRequest,
      recipeIngredientRegisterRequest: recipeIngredientRegisterRequest,
      recipeMainImageRegisterRequest: mainImage as unknown as RecipeImage,
    });
  };

  const goToRecipeList = () => {
    navigate("/recipe/list");
  };

  return (
    <div className="recipe-reg-container">
      <div className="recipe-reg-grid">
        <div className="recipe-reg-page-name">레시피 등록</div>
        <hr />
        <div className="recipe-reg-position">
          <div className="recipe-reg-input">
            <div className="recipe-reg-input-flex">
              <div className="recipe-reg-image-container" {...mainImageRootProps()}>
                {recipes.recipeMainImageRegisterRequest?.recipeMainImage ? (
                  <div className="recipe-reg-image">
                    <img
                      src={URL.createObjectURL(
                        recipes.recipeMainImageRegisterRequest.recipeMainImage
                      )}
                      className="recipe-reg-selected-image"
                      alt="Selected"
                    />
                    <input {...mainImageInputProps()} />
                  </div>
                ) : (
                  <div className="recipe-reg-image-input">
                    <img alt="이미지 업로드" src="../img/upload-icon.png" width={40} />
                    <div>클릭하여 이미지를 추가해주세요</div>
                    <input {...mainImageInputProps()} />
                  </div>
                )}
              </div>
              <TextField
                label="레시피 이름"
                name="recipeName"
                fullWidth
                variant="outlined"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
                value={recipes.recipeRegisterRequest?.recipeName || ""}
                onChange={(e) => handleRecipeNameChange(e.target.value)}
              />
              <TextField
                label="레시피를 간단하게 설명해주세요."
                name="recipeDescription"
                fullWidth
                variant="outlined"
                margin="normal"
                className="custom-input"
                InputLabelProps={{ shrink: true }}
                value={recipes.recipeContentRegisterRequest?.recipeDescription || ""}
                onChange={(e) => handleRecipeDescriptionChange(e.target.value)}
              />
              <div className="recipe-reg-spacer" />
              <div className="recipe-reg-input">
                <p className="recipe-reg-title">예상 소요 시간</p>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    margin: "15px",
                    paddingBottom: "10px",
                  }}
                >
                  <TimerIcon fontSize="small" />
                  <TextField
                    name="cookingTime"
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    value={recipes.recipeContentRegisterRequest?.cookingTime || ""}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    placeholder="분 단위까지 적어주세요 예) 10분"
                  />
                </Box>
              </div>
              <div className="recipe-reg-input">
                <p className="recipe-reg-title">난이도</p>
                <RadioGroup
                  row
                  name="difficulty"
                  style={{ margin: "15px", paddingBottom: "10px" }}
                  value={recipes.recipeContentRegisterRequest?.difficulty || ""}
                  onChange={handleDifficultyChange}
                >
                  <FormControlLabel value="EASY" control={<Radio />} label="쉬움" />
                  <FormControlLabel value="NORMAL" control={<Radio />} label="보통" />
                  <FormControlLabel value="HARD" control={<Radio />} label="어려움" />
                </RadioGroup>
              </div>
              <div>
                <p className="recipe-reg-title">카테고리</p>
                <div className="recipe-reg-category-selector">
                  <div className="recipe-reg-category-btn" onClick={() => handleBackdropOpen(1)}>
                    <span>{selectedMainMenu ? selectedMainMenu.label : "요리 분류"}</span>
                    <ArrowDropDownIcon className="recipe-reg-arrow-icon" />
                  </div>
                  <Backdrop
                    sx={{ color: "#ccc", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop1}
                  >
                    <div className="recipe-reg-backdrop-container">
                      <div className="recipe-reg-backdrop-grid">
                        <div className="recipe-reg-backdrop-padding">
                          <div className="recipe-reg-backdrop-name">레시피 분류</div>
                          <div className="recipe-reg-backdrop-menu">
                            {recipeMainCategory.map((menu, idx) => (
                              <button
                                key={idx}
                                className="recipe-reg-backdrop-btn"
                                onClick={() => {
                                  setSelectedMainMenu(menu);
                                  handleBackdropClose(1);
                                }}
                              >
                                {menu.label}
                              </button>
                            ))}
                            <button
                              className="recipe-reg-backdrop-cancel"
                              onClick={() => handleBackdropClose(1)}
                            >
                              닫기
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Backdrop>
                  <div className="recipe-reg-category-btn" onClick={() => handleBackdropOpen(2)}>
                    <span>{selectedSubMenu ? selectedSubMenu.label : "요리 종류"}</span>
                    <ArrowDropDownIcon className="recipe-reg-arrow-icon" />
                  </div>
                  <Backdrop
                    sx={{ color: "#ccc", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop2}
                  >
                    <div className="recipe-reg-backdrop-container">
                      <div className="recipe-reg-backdrop-grid">
                        <div className="recipe-reg-backdrop-padding">
                          <div className="recipe-reg-backdrop-name">레시피 종류</div>
                          <div className="recipe-reg-backdrop-menu">
                            {recipeSubCategory.map((menu, idx) => (
                              <button
                                key={idx}
                                className="recipe-reg-backdrop-btn"
                                onClick={() => {
                                  setSelectedSubMenu(menu);
                                  handleBackdropClose(2);
                                }}
                              >
                                {menu.label}
                              </button>
                            ))}
                            <button
                              className="recipe-reg-backdrop-cancel"
                              onClick={() => handleBackdropClose(2)}
                            >
                              닫기
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Backdrop>
                </div>
              </div>
              <div className="recipe-reg-spacer" />
              <div className="recipe-reg-input">
                <p className="recipe-reg-title">기준량</p>
                <div className="recipe-reg-quantity-container">
                  <div className="recipe-reg-counter-button" onClick={() => decreaseServingSize()}>
                    <RemoveIcon />
                  </div>
                  <p className="recipe-reg-quantity">{servingSize}</p>
                  <div className="recipe-reg-counter-button" onClick={() => increaseServingSize()}>
                    <AddIcon />
                  </div>
                  <p className="recipe-reg-text-p">인분</p>
                </div>
              </div>
              <div className="recipe-reg-input">
                <p className="recipe-reg-title">메인 재료</p>
                <div className="recipe-reg-ing-container">
                  <Select
                    className="recipe-reg-ing-input"
                    value={
                      (recipes.recipeIngredientRegisterRequest?.mainIngredient as
                        | ""
                        | { value: string; label: string }) || ""
                    }
                    onChange={handleMainIngredientChange}
                  >
                    {mainIngredients.map((ingredient) => (
                      <MenuItem key={ingredient.value} value={ingredient.value}>
                        {ingredient.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    className="recipe-reg-unit-input"
                    placeholder="예) 1개"
                    value={recipes.recipeIngredientRegisterRequest?.mainIngredientAmount || ""}
                    onChange={(e) => handleMainIngredientAmountChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="recipe-reg-input">
                <p className="recipe-reg-title">부가 재료</p>
                {additionalIngredient.map((ingredient, idx) => (
                  <div key={idx} className="recipe-reg-ing-container">
                    <TextField
                      className="recipe-reg-ing-input"
                      placeholder="예) 사과"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleAdditionalIngredientChange(idx, e.target.value, ingredient.unit)
                      }
                    />
                    <TextField
                      className="recipe-reg-unit-input"
                      placeholder="예) 반개"
                      value={ingredient.unit}
                      onChange={(e) =>
                        handleAdditionalIngredientChange(idx, ingredient.name, e.target.value)
                      }
                    />
                    <div
                      className="recipe-reg-ing-delete-btn"
                      onClick={() => removeAdditionalIngredient(idx)}
                    >
                      <ClearIcon fontSize="small" />
                    </div>
                  </div>
                ))}
                <div className="recipe-reg-btn-position">
                  <Button
                    className="recipe-reg-add-btn"
                    style={{ borderColor: "#578b36", color: "#578b36" }}
                    onClick={addAdditionalIngredient}
                    variant="outlined"
                  >
                    재료 추가
                  </Button>
                </div>
              </div>
              <div className="recipe-reg-input">
                <p className="recipe-reg-title">양념</p>
                {seasoning.map((list, idx) => (
                  <div key={idx} className="recipe-reg-ing-container">
                    <TextField
                      className="recipe-reg-ing-input"
                      placeholder="예) 간장"
                      value={list.name}
                      onChange={(e) => handleSeasoningChange(idx, e.target.value, list.unit)}
                    />
                    <TextField
                      className="recipe-reg-unit-input"
                      placeholder="예) 2큰술"
                      value={list.unit}
                      onChange={(e) => handleSeasoningChange(idx, list.name, e.target.value)}
                    />
                    <div className="recipe-reg-ing-delete-btn" onClick={() => removeSeasoning(idx)}>
                      <ClearIcon fontSize="small" />
                    </div>
                  </div>
                ))}
                <div className="recipe-reg-btn-position">
                  <Button
                    className="recipe-reg-add-btn"
                    style={{ borderColor: "#578b36", color: "#578b36" }}
                    onClick={addSeasoning}
                    variant="outlined"
                  >
                    재료 추가
                  </Button>
                </div>
              </div>
              <div className="recipe-reg-spacer" />
              <div className="recipe-reg-title">만드는 방법</div>
              {recipeDetails.map((detail, idx) => (
                <div key={idx} className="recipe-reg-ing-container">
                  <TextField
                    className="recipe-reg-detail-recipe"
                    label={`${detail.step} 단계`}
                    variant="outlined"
                    fullWidth
                    multiline
                    value={detail.description}
                    onChange={(e) => {
                      handleRecipeDetailChange(detail.step, e.target.value);
                    }}
                  />
                  <div
                    className="recipe-reg-ing-delete-btn"
                    onClick={() => removeRecipeDetail(idx)}
                  >
                    <ClearIcon fontSize="small" />
                  </div>
                </div>
              ))}
              <div className="recipe-reg-btn-position">
                <Button
                  className="recipe-reg-add-btn"
                  style={{ borderColor: "#578b36", color: "#578b36" }}
                  onClick={addRecipeDetail}
                  variant="outlined"
                >
                  추가
                </Button>
              </div>
            </div>
          </div>
          <div className="recipe-reg-btn-container">
            <div className="recipe-reg-submit-btn">
              <Button
                style={{
                  borderColor: "#578b36",
                  color: "#578b36",
                  width: "120px",
                }}
                variant="outlined"
                onClick={goToRecipeList}
              >
                돌아가기
              </Button>
            </div>
            <div className="recipe-reg-submit-btn">
              <Button
                style={{
                  borderColor: "#578b36",
                  backgroundColor: "#578b36",
                  color: "white",
                  width: "120px",
                }}
                variant="contained"
                onClick={handleSubmit}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeRegisterPage;
