import {
  Box,
  Container,
  Button,
  TableContainer,
  Grid,
  TextField,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  SelectChangeEvent,
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

const RecipeRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { recipes, setRecipes } = useRecipeStore();
  const [recipeDetails, setRecipeDetails] = React.useState([{ step: 1, description: "" }]);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [additionalIngredient, setAdditionalIngredient] = React.useState("");
  const [additionalIngredients, setAdditionalIngredients] = React.useState<string[]>([]);
  const mutation = useMutation(recipeRegister, {
    onSuccess: (data) => {
      queryClient.setQueryData("recipe", data);
      navigate("/recipe");
    },
  });

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

  const handleRecipeNameChange = (newRecipeName: string) => {
    setRecipes({
      ...recipes,
      recipeRegisterRequest: {
        ...recipes.recipeRegisterRequest,
        recipeName: newRecipeName,
      },
    });
  };

  const handleRecipeDescriptionChange = (newRecipeDescription: string) => {
    setRecipes({
      ...recipes,
      recipeContentRegisterRequest: {
        ...recipes.recipeContentRegisterRequest,
        recipeDescription: newRecipeDescription,
      },
    });
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setRecipes({
      ...recipes,
      recipeContentRegisterRequest: {
        ...recipes.recipeContentRegisterRequest,
        cookingTime: value,
      },
    });
  };

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

  const handleMainIngredientChange = (
    event: SelectChangeEvent<{ value: string; label: string }>
  ) => {
    const value = event.target.value as string;
    setRecipes({
      ...recipes,
      recipeIngredientRegisterRequest: {
        ...recipes.recipeIngredientRegisterRequest,
        mainIngredient: value,
      },
    });
  };

  const addAdditionalIngredient = () => {
    if (additionalIngredient.trim() === "") {
      return;
    }

    const currentIngredients = recipes.recipeIngredientRegisterRequest || {};

    const updatedAdditionalIngredients = [...additionalIngredients, additionalIngredient];

    setRecipes({
      ...recipes,
      recipeIngredientRegisterRequest: {
        ...currentIngredients,
        otherIngredient: updatedAdditionalIngredients,
      },
    });

    setAdditionalIngredients(updatedAdditionalIngredients);
    setAdditionalIngredient("");
  };

  const handleAddRecipeDetail = () => {
    const newStep = currentStep + 1;
    setRecipeDetails((prevDetails) => [...prevDetails, { step: newStep, description: "" }]);
    setCurrentStep(newStep);
  };

  const handleDescriptionChange = (step: number, newDescription: string) => {
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const mainFileToUpload = recipes.recipeMainImageRegisterRequest.recipeMainImage
      ? recipes.recipeMainImageRegisterRequest.recipeMainImage
      : "";
    if (!mainFileToUpload) {
      toast.error("이미지를 등록해주세요");
      return;
    }

    const s3MainObjectVersion = (await uploadFileAwsS3(mainFileToUpload)) || "";

    const mainImage = mainFileToUpload
      ? mainFileToUpload.name + "?versionId=" + s3MainObjectVersion
      : "undefined main image";

    const recipeRegisterRequest: RecipeName = {
      recipeName: recipes.recipeRegisterRequest.recipeName,
    };

    const recipeContentRegisterRequest: RecipeContent = {
      recipeDetails: recipes.recipeContentRegisterRequest.recipeDetails,
      recipeDescription: recipes.recipeContentRegisterRequest.recipeDescription,
      cookingTime: recipes.recipeContentRegisterRequest.cookingTime,
      difficulty: recipes.recipeContentRegisterRequest.difficulty,
    };

    const recipeIngredientRegisterRequest: RecipeIngredient = {
      mainIngredient: recipes.recipeIngredientRegisterRequest.mainIngredient,
      otherIngredient: recipes.recipeIngredientRegisterRequest.otherIngredient,
    };
    console.log("디테일 어케받냐 지금", recipes.recipeContentRegisterRequest.recipeDetails);
    const data = {
      userToken: localStorage.getItem("userToken") || "",
      recipeRegisterRequest: recipeRegisterRequest,
      recipeContentRegisterRequest: recipeContentRegisterRequest,
      recipeIngredientRegisterRequest: recipeIngredientRegisterRequest,
      recipeMainImageRegisterRequest: mainImage,
    };

    await mutation.mutateAsync({
      ...data,
      recipeRegisterRequest: recipeRegisterRequest,
      recipeContentRegisterRequest: recipeContentRegisterRequest,
      recipeIngredientRegisterRequest: recipeIngredientRegisterRequest,
      recipeMainImageRegisterRequest: mainImage as unknown as RecipeImage,
    });
    console.log("데이터확인", data);
  };

  return (
    <TableContainer>
      <Box display="flex" flexDirection="column" gap={2} p={2} alignItems="center">
        <form onSubmit={handleSubmit}>
          <h1>레시피 등록</h1>
          <div>
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "400px",
                  height: "400px",
                  backgroundColor: "#e4e4e4",
                  cursor: "pointer",
                }}
                {...mainImageRootProps()}
              >
                {recipes.recipeMainImageRegisterRequest?.recipeMainImage ? (
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(
                        recipes.recipeMainImageRegisterRequest.recipeMainImage
                      )}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        cursor: "pointer",
                      }}
                      alt="Selected"
                    />
                    <input {...mainImageInputProps()} />
                  </div>
                ) : (
                  <div style={{ textAlign: "center", fontFamily: "SUIT-Light" }}>
                    <img
                      className="upload-icon"
                      alt="이미지 업로드"
                      src="../img/upload-icon.png"
                      width={40}
                    />
                    <div>클릭하여 이미지를 추가해주세요</div>
                    <input {...mainImageInputProps()} />
                  </div>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
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
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
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
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">예상 소요 시간</FormLabel>
                  <RadioGroup
                    row
                    aria-label="cookingTime"
                    name="cookingTime"
                    value={recipes.recipeContentRegisterRequest?.cookingTime || ""}
                    onChange={handleTimeChange}
                  >
                    <FormControlLabel value="15" control={<Radio />} label="15분" />
                    <FormControlLabel value="30" control={<Radio />} label="30분" />
                    <FormControlLabel value="60" control={<Radio />} label="1시간" />
                    <FormControlLabel value="61" control={<Radio />} label="1시간 이상" />
                  </RadioGroup>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">난이도</FormLabel>
                  <RadioGroup
                    row
                    aria-label="difficulty"
                    name="difficulty"
                    value={recipes.recipeContentRegisterRequest?.difficulty || ""}
                    onChange={handleDifficultyChange}
                  >
                    <FormControlLabel value="EASY" control={<Radio />} label="쉬움" />
                    <FormControlLabel value="NORMAL" control={<Radio />} label="보통" />
                    <FormControlLabel value="HARD" control={<Radio />} label="어려움" />
                  </RadioGroup>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <FormControl>
                  {!recipes.recipeIngredientRegisterRequest?.mainIngredient ? (
                    <InputLabel>메인 재료 선택</InputLabel>
                  ) : null}
                  <Select
                    style={{ width: "400px" }}
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
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={9}>
                    <TextField
                      label="부가 재료, 추가 버튼을 눌러주세요!"
                      name="additionalIngredient"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      className="custom-input"
                      InputLabelProps={{ shrink: true }}
                      value={additionalIngredient}
                      onChange={(e) => setAdditionalIngredient(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button onClick={addAdditionalIngredient} variant="outlined">
                      추가
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <Grid container spacing={2}>
                  {additionalIngredients.map((ingredient, index) => (
                    <Grid item key={index}>
                      {ingredient.trim()}
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12}>
              {recipeDetails.map((detail) => (
                <Grid item xs={12} key={detail.step}>
                  <TextField
                    label={`단계 ${detail.step} 설명`}
                    variant="outlined"
                    fullWidth
                    value={detail.description}
                    onChange={(e) => {
                      const newDescription = e.target.value;
                      handleDescriptionChange(detail.step, newDescription);
                    }}
                    style={{ marginBottom: "5px" }}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button onClick={handleAddRecipeDetail} variant="outlined">
                  단계 추가
                </Button>
              </Grid>
            </Grid>
          </div>
          <Button type="submit">확인</Button>
        </form>
      </Box>
    </TableContainer>
  );
};
export default RecipeRegisterPage;
